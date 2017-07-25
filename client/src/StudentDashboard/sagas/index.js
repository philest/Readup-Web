import {
  fork,
  call,
  take,
  takeLatest,
  takeEvery,
  cancel,
  put,
  select,
  apply,
  race,
} from 'redux-saga/effects'

import { delay } from 'redux-saga'

import audioEffectsSaga from './audioEffectsSaga'
import Recorder from '../recorder'
import { playSound } from '../audioPlayer'






// actions
import {
  // currently being used

  START_RECORDING_CLICKED,
  STOP_RECORDING_CLICKED,
  BOOK_INTRO_RECORDING_ENDED,
  HEAR_RECORDING_CLICKED,
  COUNTDOWN_ENDED,
  EXIT_CLICKED,
  RESTART_RECORDING_CLICKED,
  TURN_IN_CLICKED,
  NEXT_PAGE_CLICKED,
  PAUSE_CLICKED,

  startCountdownToStart,
  setMicPermissions,
  setHasRecordedSomething,
  setReaderState,
  setPageNumber,
  setCurrentSound,
  setRecordingURL,
  setCurrentModal,
  setCurrentOverlay,
} from '../state'


import {
  ReaderStateOptions,
  MicPermissionsStatusOptions,
} from '../types'

import {
  getRecorder,
  getIsDemo,
} from './selectors'

import assessmentSaga from './assessmentSaga'


function getPermission(recorder) {
  return new Promise(function(resolve, reject) {
    recorder.initialize((error) => {
      resolve(error)
    })
  });

}

function checkPermission() {
  return new Promise(function(resolve, reject) {
    Recorder.hasRecordingPermissions((hasPermissions) => {
      console.log("We have permissions? " + hasPermissions)
      resolve(hasPermissions)
    });
  });
}


function* getMicPermissions() {

  const hasPermissions = yield call(checkPermission)
  if (hasPermissions) {
    yield put.resolve(setMicPermissions(MicPermissionsStatusOptions.granted))
    return true
  }

  yield put.resolve(setMicPermissions(MicPermissionsStatusOptions.awaiting))
  yield put.resolve(setCurrentOverlay('overlay-permissions'))

  // initialize
  const recorder =              yield select(getRecorder)
  const getPermissionSuccess =  yield call(getPermission, recorder)

  yield put.resolve(setCurrentOverlay('no-overlay'))

  const micPermissions = getPermissionSuccess ? MicPermissionsStatusOptions.granted : MicPermissionsStatusOptions.blocked
  yield put.resolve(setMicPermissions(micPermissions))
  return micPermissions
}




function* haltRecordingAndGenerateBlobSaga(recorder) {
  yield put.resolve(setReaderState(ReaderStateOptions.done))
  const blobURL = yield new Promise(function(resolve, reject) {
    recorder.stopRecording((blobUrl) => {
      resolve(blobUrl)
    })
  });
  // this is done in the Store because PlaybackModal takes this is a prop
  yield put.resolve(setRecordingURL(blobURL))
  return yield blobURL
}

function* redirectToHomepage () {
  yield window.location.href = "/"
}


function* clog(...args) {
  yield call(console.log, 'SAGA CLOG: ', ...args)
}

function* assessThenSubmitSaga() {

  // TODO: convert this into a batched action
  yield put.resolve(setPageNumber(0))
  yield put.resolve(setHasRecordedSomething(false))
  yield put.resolve(setCurrentModal('no-modal'))

  const permissionsGranted = yield* getMicPermissions() // blocks

  if (!permissionsGranted) {
    return
  }

  let recorder = yield select(getRecorder)
  yield call(recorder.initialize)


  // TODO: D. Ernst pls fix dis tx
  yield put(setCurrentSound('/audio/book_intro.m4a'))
  yield take(BOOK_INTRO_RECORDING_ENDED)
  yield put.resolve(setReaderState(
    ReaderStateOptions.awaitingStart,
  ))

  // before assessment has started, clicking exit immediately quits app
  // I guess. We will probably change this
  const { exit } = yield race({
    exit: take(EXIT_CLICKED),
    startAssessment: take(START_RECORDING_CLICKED),
  })

  // the app will end :O
  if (exit) {
    yield* redirectToHomepage()
  }

  // now we start the assessment for real
  yield takeLatest(EXIT_CLICKED, function* (payload) {
    recorder = yield select(getRecorder)
    yield call(recorder.pauseRecording)
    yield put.resolve(setReaderState(
      ReaderStateOptions.paused,
    ))
    yield put(setCurrentModal('modal-exit'))
  })


  // TODO: convert the countdown to saga!!!!
  yield put.resolve(setPageNumber(1))
  yield put.resolve(setReaderState(
    ReaderStateOptions.countdownToStart,
  ))
  yield call(playSound, '/audio/recording_countdown.m4a')


  // WAIT for the countdown sequence to end
  yield take(COUNTDOWN_ENDED)

  yield put.resolve(setReaderState(
    ReaderStateOptions.inProgress,
  ))

  // starts the recording assessment flow
  yield* assessmentSaga()

  yield put.resolve(setCurrentModal('modal-done'))
  // yield call(recorder.forceDownloadRecording, ['_test_.wav'])

  yield takeEvery(HEAR_RECORDING_CLICKED, function* (action) {
    yield put.resolve(setCurrentModal('modal-playback'))
  })

  const recordingBlob = yield* haltRecordingAndGenerateBlobSaga(yield select(getRecorder));
  yield* clog('url for recording!!!', recordingBlob)
  yield recordingBlob
}


function* rootSaga() {
  yield* clog('Root Saga Started')

  yield fork(audioEffectsSaga)

  yield* clog('Race About To Start')
  while (true) {
    const {
      restartAssessment,
      recordingBlob,
    } = yield race({
      restartAssessment: take(RESTART_RECORDING_CLICKED),
      recordingBlob: call(assessThenSubmitSaga),
    })

    yield* clog('Race Finished')


    // restart!
    if (restartAssessment) {
      const recorder = yield select(getRecorder)
      yield call(recorder.reset)


    // turn it in!
    } else {
      yield take(TURN_IN_CLICKED)

      


      yield take('TURN_IN_SUCCESS')

      const isDemo = yield select(getIsDemo)
      if (isDemo) {
        yield put.resolve(setCurrentOverlay('overlay-demo-submitted'))

      } else {
        yield put.resolve(setCurrentOverlay('overlay-submitted'))
        setTimeout(() => {
          window.location.href = "/" // TODO where to redirect?
        }, 5000)
      }

      yield put(setReaderState(
        ReaderStateOptions.submitted,
      ))
    } // END if (restartAssessment)
  } // END while (true)
} // END function* rootSaga()

export default rootSaga

