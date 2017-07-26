import { fork, call, take, takeLatest, takeEvery, cancel, put, select, apply } from 'redux-saga/effects'


import recorderSaga from './recorderSaga'
import audioEffectsSaga from './audioEffectsSaga'

import Recorder from '../recorder' 

import { playSound, stopAudio } from '../audioPlayer'

import { ReaderStateOptions, ReaderState, MicPermissionsStatusOptions, PauseTypeOptions } from '../types'


// selectors
const getRecorder = state => state.reader.recorder
const getIsDemo = state => state.reader.isDemo


// actions

import { MIC_SET_PERMISSIONS, START_RECORDING_CLICKED, STOP_RECORDING_CLICKED, PAGE_INCREMENT, PAGE_DECREMENT, RECORDING_COUNTDOWN_TO_START, RECORDING_START, RECORDING_STOP, RECORDING_PAUSE, RECORDING_RESUME, RECORDING_SUBMIT, RECORDING_RESTART, RECORDING_PLAYBACK, PERMISSIONS_ARROW_CLICKED, BOOK_INTRO_RECORDING_ENDED, NEXT_PAGE_CLICKED, PREVIOUS_PAGE_CLICKED, PAUSE_CLICKED, RESUME_CLICKED, RESTART_RECORDING_CLICKED, HEAR_RECORDING_CLICKED, TURN_IN_CLICKED, INTRO_CONTINUE_CLICKED, startCountdownToStart, setMicPermissions, startRecording, COUNTDOWN_ENDED, EXIT_CLICKED, setReaderState, setPageNumber, setHasRecordedSomething, setCurrentSound, setRecordingURL, setCurrentModal, setCurrentOverlay } from '../state'



function getPermission(recorder) {

  return new Promise(function(resolve, reject) {
    recorder.initialize((error) => {
      // User responded to permissions request
      if (error) {
        // this.props.actions.setMicPermissions(MicPermissionsStatusOptions.blocked)
        resolve(false)
      }
      else {
        // this.props.actions.setMicPermissions(MicPermissionsStatusOptions.granted)
        resolve(true)
      }

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
    yield put(setMicPermissions(MicPermissionsStatusOptions.granted))
    return true
  }
  else {
    yield put(setMicPermissions(MicPermissionsStatusOptions.awaiting))
    yield put(setCurrentOverlay('overlay-permissions'))

    // initialize
    const recorder = yield select(getRecorder)
    const getPermissionSuccess = yield call(getPermission, recorder)

    yield put(setCurrentOverlay('no-overlay'))
    
    if (getPermissionSuccess) {
      yield put(setMicPermissions(MicPermissionsStatusOptions.granted))
      return true
    }
    else {
      yield put(setMicPermissions(MicPermissionsStatusOptions.blocked))
      return false
    }
  }

}

function* onExit() {
  yield takeLatest(EXIT_CLICKED, function* (payload) {
    window.location.href = "/"
  })
}

function stopRecorderAndGetBlobURL(recorder) {
  return new Promise(function(resolve, reject) {
    recorder.stopRecording((blobUrl) => {
      resolve(blobUrl)
    })
  });
}

export default function* rootSaga() {

  yield call(console.log, 'ROOT SAGA')

  yield fork(audioEffectsSaga)
  // yield fork(recorderSaga)

  yield put(setCurrentOverlay('overlay-intro'))
  yield take(INTRO_CONTINUE_CLICKED)
  yield put(setCurrentOverlay('no-overlay'))

  let recorder = yield select(getRecorder)

  const permissionsGranted = yield getMicPermissions() // blocks

  if (!permissionsGranted) {
    yield put(setCurrentOverlay('overlay-blocked-mic'))
    return
  }

  const exitTask = yield fork(onExit)

  recorder = yield select(getRecorder)
  yield apply(recorder, recorder.initialize)
  yield put(setCurrentSound('/audio/book_intro.m4a'))


  yield take(BOOK_INTRO_RECORDING_ENDED)

  yield put(setReaderState(ReaderStateOptions.awaitingStart))

  yield take(START_RECORDING_CLICKED)

  yield put(startCountdownToStart())
  yield put(setPageNumber(1))
  yield put(setReaderState(ReaderStateOptions.countdownToStart))

  yield take(COUNTDOWN_ENDED)

  yield put(setReaderState(ReaderStateOptions.inProgress))
  recorder = yield select(getRecorder)
  yield apply(recorder, recorder.startRecording)
  yield put(setHasRecordedSomething(true))


  yield cancel(exitTask)

  yield takeLatest(EXIT_CLICKED, function* (payload) {
    recorder = yield select(getRecorder)
    yield apply(recorder, recorder.pauseRecording)
    yield put(setReaderState(ReaderStateOptions.paused))
    yield put(setCurrentModal('modal-exit'))
  })

  yield takeLatest(TURN_IN_CLICKED, function* (payload) {
    // need to put this up here because might turn in from paused view


    // TODO submit the recording
    
    yield put(setReaderState(ReaderStateOptions.submitted))

    const isDemo = yield select(getIsDemo)
    if (isDemo) {
      yield put(setCurrentOverlay('overlay-demo-submitted'))
    }
    else {
      yield put(setCurrentOverlay('overlay-submitted'))
      setTimeout(() => {
        window.location.href = "/" // TODO where to redirect?
      }, 5000)
    }
    
  })


  yield takeEvery(PAUSE_CLICKED, function* (payload) {
    recorder = yield select(getRecorder)
    yield apply(recorder, recorder.pauseRecording)
    yield put(setReaderState(ReaderStateOptions.paused))
    yield put(setCurrentSound('/audio/paused.m4a'))
    yield put(setCurrentModal('modal-paused'))
    // directly show modal here
  })

  yield takeEvery(RESUME_CLICKED, function* (payload) {
    recorder = yield select(getRecorder)
    yield apply(recorder, recorder.resumeRecording)
    yield put(setReaderState(ReaderStateOptions.inProgress))
    yield put(setCurrentModal('no-modal'))
  })

  yield takeEvery(NEXT_PAGE_CLICKED, function* (payload) {
    yield put({ type: PAGE_INCREMENT })
  })

  yield takeEvery(PREVIOUS_PAGE_CLICKED, function* (payload) {
    yield put({ type: PAGE_DECREMENT })
  })

  yield takeEvery(RESTART_RECORDING_CLICKED, function* (action) {
    recorder = yield select(getRecorder)
    yield apply(recorder, recorder.reset)
    yield put(setCurrentModal('no-modal'))
    yield put(setReaderState(ReaderStateOptions.awaitingStart))
    yield put(setPageNumber(0))
  })



  yield take(STOP_RECORDING_CLICKED)

  yield put(setReaderState(ReaderStateOptions.done))
  recorder = yield select(getRecorder)
  const blobURL = yield stopRecorderAndGetBlobURL(recorder)
  
  yield put(setRecordingURL(blobURL))
  yield put(setCurrentModal('modal-done'))
  // yield apply(recorder, recorder.forceDownloadRecording, ['_test_.wav'])
  
  yield takeEvery(HEAR_RECORDING_CLICKED, function* (action) {
    yield put(setCurrentModal('modal-playback'))
  })

  
  



  

}


