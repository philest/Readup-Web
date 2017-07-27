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
import { playSound, stopAudio, playSoundAsync as _pSA } from '../audioPlayer'

// actions
import {
  PERMISSIONS_ARROW_CLICKED,
  PAUSE_CLICKED,
  START_RECORDING_CLICKED,
  STOP_RECORDING_CLICKED,
  BOOK_INTRO_RECORDING_ENDED,
  INTRO_CONTINUE_CLICKED,
  HEAR_RECORDING_CLICKED,
  COUNTDOWN_ENDED,
  EXIT_CLICKED,
  RESTART_RECORDING_CLICKED,
  TURN_IN_CLICKED,
  IS_DEMO_SET,
  SPINNER_SHOW,
  SPINNER_HIDE,
  DEMO_SUBMITTED_LOGOUT_CLICKED,
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






function* playSoundAsync(sound) {
  yield call(_pSA, sound)
  return
}





function* getMicPermissionsSaga() {

  const hasPermissions = yield new Promise((resolve, reject) => {
    Recorder.hasRecordingPermissions((permissions) => {
      console.log("We have permissions? " + permissions)
      resolve(permissions)
    })
  })

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
      yield clog('yay response!', res)
      return yield res
    } catch (err) {
      yield clog("ERR:", err, err.request)
    }
  }
  return yield false // TODO: this is pretty meh
}







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
  // TODO: convert this into a batched action
  yield put.resolve(setPageNumber(0))
  yield put.resolve(setHasRecordedSomething(false))
  yield put.resolve(setCurrentModal('no-modal'))

  yield take(INTRO_CONTINUE_CLICKED)
  yield put(setCurrentOverlay('no-overlay'))

  const permissionsGranted = yield* getMicPermissionsSaga() // blocks

  // TODO asap as possible
  // TODO: some loop here :)
  if (!permissionsGranted) {
    yield put(setCurrentOverlay('overlay-blocked-mic'))
    return
  }

  // permission was granted!!!!
  yield playSoundAsync('https://s3-us-west-2.amazonaws.com/readup-now/website/firefly-intro.mp3')


  let recorder = yield select(getRecorder)
  yield call(recorder.initialize)

  yield put.resolve(setReaderState(
    ReaderStateOptions.awaitingStart,
  ))


  // before assessment has started, clicking exit immediately quits app
  // I guess. We will probably change this
  const { exit } = yield race({
    exit: take(EXIT_CLICKED),
    startAssessment: take(START_RECORDING_CLICKED),
  })

  yield call(stopAudio)

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
  yield playSoundAsync('/audio/recording_countdown.mp3')


  // yield put(setCurrentSound('/audio/book_intro.mp3'))

  // TODO: D. Ernst pls fix dis tx
  yield take(COUNTDOWN_ENDED)
  yield put.resolve(setCurrentModal('no-modal'))


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
    yield fork(assessmentSaga),
  )

  yield take(STOP_RECORDING_CLICKED) // TODO: better name
  // yield playSoundAsync('/audio/done.mp3')


  yield put.resolve(setCurrentModal('modal-done'))
  // yield call(recorder.forceDownloadRecording, ['_test_.wav'])

  recorder = yield select(getRecorder)
  const recordingBlob = yield* haltRecordingAndGenerateBlobSaga(recorder);
  yield clog('url for recording!!!', recordingBlob)

  yield cancel(...effects)

  yield take(TURN_IN_CLICKED)
  return recorder.getBlob()
}



function* rootSaga() {
  const { payload: { isDemo } } = yield take(IS_DEMO_SET)

  yield clog('Root Saga Started')


  const bookKey = isDemo ? 'demo' : 'unclear'
  yield clog('Generating assessment... bookKey:', bookKey)
  const assessmentId = yield requestNewAssessment(bookKey)
    .catch(e => e.request) // TODO

  yield clog('Assessment ID:', assessmentId)


  /*
   ****************
   * watchers
   *****************
   */
  // yield* audioEffectsSaga()

  yield takeLatest(HEAR_RECORDING_CLICKED, function* () {
    yield put(setCurrentModal('modal-playback'))
    yield call(stopAudio)
  })


  // yield takeLatest(PERMISSIONS_ARROW_CLICKED, function* () {
  //   yield call(playSound, '/audio/click_allow_button.mp3')
  // })



  /*
   ****************
   * main race
   *****************
   */
  yield clog('Race About To Start')
  while (true) {
    const {
      restartAssessment,
      recordingBlob,
      turnItIn,
      quit,
    } = yield race({
      restartAssessment: take(RESTART_RECORDING_CLICKED),
      recordingBlob: call(assessThenSubmitSaga),
      turnItIn: take(TURN_IN_CLICKED),
      quit: take('QUIT_ASSESSMENT_AND_DESTROY'),
    })
    yield clog('Race Finished')


    if (restartAssessment) {
      const recorder = yield select(getRecorder)
      yield call(recorder.reset)
      yield put.resolve(setCurrentModal('no-modal'))
      yield put(setCurrentOverlay('no-overlay'))

    } else {

      if (quit) {
        window.location.href = "/" // eslint-disable-line
        return
      }


      yield put({ type: SPINNER_SHOW })
      const turnedIn = yield* turnInAudio(recordingBlob, assessmentId)
      yield put({ type: SPINNER_HIDE })

      // success!
      if (turnedIn) {
        yield clog('turned it in!')

        if (isDemo) {
          yield clog('oh hey you r done')
          yield put(setCurrentOverlay('overlay-demo-submitted'))
          yield take(DEMO_SUBMITTED_LOGOUT_CLICKED)
          // TODO where to redirect?
          window.location.href = "/"

        } else {
          yield put(setCurrentOverlay('overlay-submitted'))
          setTimeout(() => {
            // TODO where to redirect?
            window.location.href = "/" // eslint-disable-line
          }, 5000)
          return
        }

        yield put(setReaderState(
          ReaderStateOptions.submitted,
        ))

      // fail! allow option to turn in again?
      } else {
        yield clog('could not turn it in :/')
      }

    } // END if (restartAssessment)
  } // END while (true)
} // END function* rootSaga()

export default rootSaga

