// @flow
import {
  fork,
  call,
  take,
  takeLatest,
  takeEvery,
  cancel,
  put,
  select,
  race,
} from 'redux-saga/effects'
import { delay } from 'redux-saga'


import {
  getS3Presign,
  sendAudioToS3,
  requestNewAssessment,
} from './networkingHelpers'

import {
  clog,
} from './helpers'

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
  IS_DEMO_SET,
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





function* playSoundAsync(sound) {
  yield call(playSound, sound)
  return
}





function* getMicPermissionsSaga() {

  const hasPermissions = yield checkPermission()
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






function* turnInAudio(blob, assessmentId: number) {
  for (let i = 0; i < 3; i++) {
    try {
      const presign = yield getS3Presign(assessmentId)
      const res = yield sendAudioToS3(blob, presign)
      yield call(clog, 'yay response!', res)
      return yield res
    } catch (err) {
      yield call(clog, "ERR:", err, err.request)
    }
  }
  return yield false // TODO: this is pretty meh
}





  const hasPermissions = yield call(checkPermission)
  if (hasPermissions) {
    yield put(setMicPermissions(MicPermissionsStatusOptions.granted))
    return true
  }
  else {
    yield put(setMicPermissions(MicPermissionsStatusOptions.awaiting))
    yield put(setCurrentOverlay('overlay-permissions'))


function* exitClick() {
  const recorder = yield select(getRecorder)
  yield call(recorder.pauseRecording)
  yield put.resolve(setReaderState(
    ReaderStateOptions.paused,
  ))
  yield put(setCurrentModal('modal-exit'))
}






function* assessThenSubmitSaga() {

  const effects = []

  yield put(setCurrentOverlay('overlay-intro'))
  yield take(INTRO_CONTINUE_CLICKED)
  yield put(setCurrentOverlay('no-overlay'))
  
  
  // TODO: convert this into a batched action
  yield put.resolve(setPageNumber(0))
  yield put.resolve(setHasRecordedSomething(false))
  yield put.resolve(setCurrentModal('no-modal'))

  const permissionsGranted = yield* getMicPermissionsSaga() // blocks
  
  yield put(setCurrentOverlay('no-overlay'))

  if (!permissionsGranted) {
    yield put(setCurrentOverlay('overlay-blocked-mic'))
    // TODO asap as possible
    return
  }

  let recorder = yield select(getRecorder)
  yield call(recorder.initialize)


  // TODO: D. Ernst pls fix dis tx
  yield put(setCurrentSound('/audio/book_intro.m4a'))
  // yield take(BOOK_INTRO_RECORDING_ENDED)
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
  effects.push(
    yield takeLatest(EXIT_CLICKED, exitClick),
  )


  // TODO: convert the countdown to saga!!!!
  yield put.resolve(setPageNumber(1))
  yield put.resolve(setReaderState(
    ReaderStateOptions.countdownToStart,
  ))
  yield playSoundAsync('/audio/recording_countdown.m4a')


  // WAIT for the countdown sequence to end
  yield take(COUNTDOWN_ENDED)

  yield put.resolve(setReaderState(
    ReaderStateOptions.inProgress,
  ))

  // this ensures that effects are canceleld
  // while (true) {
  //   const {exit} = yield race({
  //     exit:             take(EXIT_CLICKED),
  //     assessmentResult: call(assessmentSaga),
  //   })

  //   if (exit) {
  //     yield call(exitClick)
  //   } else {

  //   }
  // }
  // starts the recording assessment flow
  effects.push(
    yield fork(assessmentSaga)
  )
  yield take(STOP_RECORDING_CLICKED) // TODO: better name

  yield put.resolve(setCurrentModal('modal-done'))
  // yield call(recorder.forceDownloadRecording, ['_test_.wav'])

  recorder = yield select(getRecorder)
  const recordingBlob = yield* haltRecordingAndGenerateBlobSaga(recorder);
  yield call(clog, 'url for recording!!!', recordingBlob)

  yield take(TURN_IN_CLICKED)

  yield cancel(...effects)
  return recorder.getBlob()
}



function* rootSaga() {
  const { payload: { isDemo } } = yield take(IS_DEMO_SET)

  yield clog('Root Saga Started')

  yield call(clog, 'Generating assessment...')

  yield clog(isDemo)

  const bookKey = isDemo ? 'demo' : 'unclear'

  const assessmentId = yield requestNewAssessment(bookKey)
    .catch(e => e.request)

  yield clog(assessmentId)



  // watchers
  yield* audioEffectsSaga()
  yield takeLatest(HEAR_RECORDING_CLICKED, function* (action) {
    yield put.resolve(setCurrentModal('modal-playback'))
  })



  yield call(clog, 'Race About To Start')

  // race between clicking 'TURN IN RECORDING' and 'RESTART THE RECORDING'
  while (true) {
    const {
      restartAssessment,
      recordingBlob,
    } = yield race({
      restartAssessment: take(RESTART_RECORDING_CLICKED),
      recordingBlob: call(assessThenSubmitSaga),
    })
    yield call(clog, 'Race Finished')


    // restart!
    if (restartAssessment) {
      const recorder = yield select(getRecorder)
      yield call(recorder.reset)


    // turn it in!
    } else {

      const turnedIn = yield* turnInAudio(recordingBlob, assessmentId)

      // success!
      if (turnedIn) {
        yield call(clog,'turned it in!')

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

      // fail! allow option to turn in again?
      } else {
        yield call(clog, 'could not turn it in :/')
      }


    } // END if (restartAssessment)
  } // END while (true)
} // END function* rootSaga()

export default rootSaga

