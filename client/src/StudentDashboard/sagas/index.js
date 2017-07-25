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



function* onClickExit() {
  yield takeLatest(EXIT_CLICKED, function* (action) {
    window.location.href = "/"
  })
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



function* assessmentThenSubmitSaga() {
  const results = yield* assessmentSaga()


  return results
}


export default function* rootSaga() {

  yield call(console.log, 'ROOT SAGA')

  // start saga
  yield fork(audioEffectsSaga)

  let recorder = yield select(getRecorder)

  const permissionsGranted = yield* getMicPermissions() // blocks

  if (!permissionsGranted) {
    return
  }

  // at first, exit clicking redirects to homepage. This changed after assessment has started.
  const exitClickedTask = yield fork(onClickExit)

  recorder = yield select(getRecorder)

  yield call(recorder.initialize)

  // yield put(setCurrentSound('/audio/book_intro.m4a'))


  // yield take(BOOK_INTRO_RECORDING_ENDED)

  yield put.resolve(setReaderState(
    ReaderStateOptions.awaitingStart,
  ))

  yield take(START_RECORDING_CLICKED)


  // TODO: convert the countdown to saga!!!!
  yield put(startCountdownToStart())
  yield put.resolve(setPageNumber(1))
  yield put.resolve(setReaderState(
    ReaderStateOptions.countdownToStart,
  ))

  // WAIT for the countdown sequence to end
  yield take(COUNTDOWN_ENDED)

  yield put.resolve(setReaderState(
    ReaderStateOptions.inProgress,
  ))

  // assign a new saga for exit-clicking henceforth
  yield cancel(exitClickedTask)
  yield takeLatest(EXIT_CLICKED, function* (payload) {
    recorder = yield select(getRecorder)
    yield call(recorder.pauseRecording)
    yield put.resolve(setReaderState(
      ReaderStateOptions.paused,
    ))
    yield put(setCurrentModal('modal-exit'))
  })

  while (true) {
    yield call(console.log, '\n\n\n\n\nstart race!@!!!!!\n\n\n\n\n')
    const {
      resu,
      st,
      restartAssessment,
    } = yield race({
      resu: call(function*(){
        yield* assessmentSaga()

        yield put.resolve(setCurrentModal('modal-done'))
        // yield call(recorder.forceDownloadRecording, ['_test_.wav'])

        yield takeEvery(HEAR_RECORDING_CLICKED, function* (action) {
          yield put.resolve(setCurrentModal('modal-playback'))
        })

        const recordingBlob = yield* haltRecordingAndGenerateBlobSaga(yield select(getRecorder));
        yield call(console.log, 'url for recording!!!', recordingBlob)

        yield take(TURN_IN_CLICKED)

        yield call(console.log, 'turning it in!!!!', recordingBlob)


        const isDemo = yield select(getIsDemo)
        if (isDemo) {
          yield put.resolve(setCurrentOverlay('overlay-demo-submitted'))

        } else {
          yield put.resolve(setCurrentOverlay('overlay-submitted'))
          setTimeout(() => {
            window.location.href = "/" // TODO where to redirect?
          }, 5000)
        }

        // need to put this up here because might turn in from paused view
        // TODO submit the recording
        yield put.resolve(setReaderState(
          ReaderStateOptions.submitted,
        ))
      }),
      restartAssessment: take(RESTART_RECORDING_CLICKED),
      // restartAssessment: delay(2000),
    })

      yield call(console.log, 'woah race done')


    // restart assessment
    if (restartAssessment) {
      yield call(console.log, 'hi')
      recorder = yield select(getRecorder)
      yield call(recorder.reset)
      yield put.resolve(setHasRecordedSomething(false))
      yield put.resolve(setCurrentModal('no-modal'))
      yield put.resolve(setReaderState(
        ReaderStateOptions.awaitingStart,
      ))
      yield put.resolve(setPageNumber(0))

    } else if (st) {

    } else {
      yield call(console.log, 'woot did assessment')
      yield take('TURN_IN_SUCCESS')
    }
  }

}


