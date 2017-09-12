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
  setCountdownValue,
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

import { sendEmail } from '../../ReportsInterface/emailHelpers'





function getPermission(recorder) {

  return navigator.mediaDevices.getUserMedia({audio: true})
  .then(function(yay) {
    recorder.initialize()
    return true
  }).catch(function(err) {
    return false
  });
  // return new Promise(function(resolve, reject) {
  //   console.log('hihihih');

  //   const result = recorder.initialize((error) => {
  //     resolve(error)
  //   })
  //   console.log('CLOG', result);
  // });
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

  const recorder =              yield select(getRecorder)
  const getPermissionSuccess =  yield getPermission(recorder)

  const micPermissions = getPermissionSuccess ? MicPermissionsStatusOptions.granted : MicPermissionsStatusOptions.blocked
  yield put.resolve(setMicPermissions(micPermissions))

  return getPermissionSuccess
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


  // TODO: convert this into a batched action
  yield put.resolve(setPageNumber(0))
  yield put.resolve(setHasRecordedSomething(false))
  yield put.resolve(setCurrentModal('no-modal'))

  yield put(setCurrentOverlay('no-overlay'))

  const permissionsGranted = yield* getMicPermissionsSaga() // blocks

  // TODO asap as possible
  // TODO: some loop here :)
  while (!permissionsGranted) {
    yield put(setCurrentOverlay('overlay-blocked-mic'))
    yield take('ickkkkk')
    return
  }

  yield put(setCurrentOverlay('no-overlay'))


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


  // TODO: try sending text notification 
  sendEmail("Demo started", "Demo was started", "philesterman@gmail.com")


  let countdown = 3
  while (countdown > 0) {
    yield put(setCountdownValue(countdown))
    yield call(delay, 1000)
    countdown--
  }


  // yield put(setCurrentSound('/audio/book_intro.mp3'))

  yield put.resolve(setCurrentModal('no-modal'))




  yield put.resolve(setReaderState(
    ReaderStateOptions.inProgress,
  ))

   $.ajax({
      url: '/auth/phil_setup_demo',
      type: 'post',
    }).fail(function(xhr, status, err) {
      console.log(err)
   })

  

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

  // yield playSoundAsync('/audio/done.mp3')




  const { endRecording } = yield race({
    turnItIn: take(TURN_IN_CLICKED),
    endRecording: take(STOP_RECORDING_CLICKED),
  })

  recorder = yield select(getRecorder)
  const recordingBlob = yield* haltRecordingAndGenerateBlobSaga(recorder);
  yield clog('url for recording!!!', recordingBlob)

  yield put.resolve(setCurrentModal('modal-done'))
  // yield call(recorder.forceDownloadRecording, ['_test_.wav'])

  // do not delete, this is import :)
  if (endRecording) {
    yield take(TURN_IN_CLICKED)
  }


  yield cancel(...effects)

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
      quit,
    } = yield race({
      restartAssessment: take(RESTART_RECORDING_CLICKED),
      recordingBlob: call(assessThenSubmitSaga),
      quit: take('QUIT_ASSESSMENT_AND_DESTROY'),
    })
    yield clog('Race Finished')

    if (quit) {
      window.location.href = "/" // eslint-disable-line
      return
    }

    if (restartAssessment) {
      const recorder = yield select(getRecorder)
      yield call(recorder.reset)
      yield put.resolve(setCurrentModal('no-modal'))
      yield put(setCurrentOverlay('no-overlay'))

    } else {

      yield put({ type: SPINNER_SHOW })
      const turnedIn = yield* turnInAudio(recordingBlob, assessmentId)
      yield put({ type: SPINNER_HIDE })

      // success!
      if (turnedIn) {
        yield clog('turned it in!')

        if (isDemo) {
          yield clog('oh hey you r done')

          window.location.href = "/reports/sample"
          yield put({ type: SPINNER_SHOW })


          // TODO where to redirect?
          // window.location.href = "/reports/1"

        } else {
          yield put(setCurrentOverlay('overlay-submitted'))
          setTimeout(() => {
            // TODO where to redirect?
            window.location.href = "/" // eslint-disable-line
          }, 10000)
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

