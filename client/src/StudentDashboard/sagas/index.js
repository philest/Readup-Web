import { fork, call, take, takeLatest, takeEvery, cancel, put, select, apply } from 'redux-saga/effects'


import recorderSaga from './recorderSaga'
import audioEffectsSaga from './audioEffectsSaga'

import Recorder from '../recorder'


import {
  ReaderStateOptions,
  ReaderState,
  MicPermissionsStatusOptions,
  PauseTypeOptions
} from '../types'


// selectors
const getRecorder = state => state.reader.recorder
const getIsDemo = state => state.reader.isDemo


// actions
import {
  // not currently used
  MIC_SET_PERMISSIONS,
  startRecording,
  RECORDING_COUNTDOWN_TO_START,
  RECORDING_START,
  RECORDING_STOP,
  RECORDING_PAUSE,
  RECORDING_RESUME,
  RECORDING_SUBMIT,
  RECORDING_RESTART,
  RECORDING_PLAYBACK,
  PERMISSIONS_ARROW_CLICKED,

  // currently being used

  START_RECORDING_CLICKED,
  STOP_RECORDING_CLICKED,

  PAGE_INCREMENT,
  PAGE_DECREMENT,

  BOOK_INTRO_RECORDING_ENDED,
  NEXT_PAGE_CLICKED,
  PREVIOUS_PAGE_CLICKED,
  PAUSE_CLICKED,
  RESUME_CLICKED,
  RESTART_RECORDING_CLICKED,
  HEAR_RECORDING_CLICKED,
  TURN_IN_CLICKED,

  COUNTDOWN_ENDED,
  EXIT_CLICKED,

  startCountdownToStart,
  setMicPermissions,
  setReaderState,
  setPageNumber,
  setHasRecordedSomething,
  setCurrentSound,
  setRecordingURL,
  setCurrentModal,
  setCurrentOverlay,
} from '../state'



function getPermission(recorder) {

  return new Promise(function(resolve, reject) {
    recorder.initialize((error) => {
      // User responded to permissions request
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

  let recorder = yield select(getRecorder)

  const permissionsGranted = yield* getMicPermissions() // blocks

  if (!permissionsGranted) {
    return
  }

  const exitClickedTask = yield fork(onExit)

  recorder = yield select(getRecorder)

  // apply used instead of call because apply binds function to recorder object
  // soure: ???
  yield call(recorder.initialize)

  yield put.resolve(setCurrentSound('/audio/book_intro.m4a'))


  yield take(BOOK_INTRO_RECORDING_ENDED)

  yield put.resolve(setReaderState(ReaderStateOptions.awaitingStart))

  yield take(START_RECORDING_CLICKED)

  yield put.resolve(setPageNumber(1))
  yield put.resolve(setReaderState(ReaderStateOptions.countdownToStart))

  yield take(COUNTDOWN_ENDED)

  yield put.resolve(setReaderState(ReaderStateOptions.inProgress))
  recorder = yield select(getRecorder)
  yield call(recorder.startRecording)
  yield put.resolve(setHasRecordedSomething(true))

  // assign a new saga for exit clicking henceforth
  yield cancel(exitClickedTask)

  yield takeLatest(EXIT_CLICKED, function* (payload) {
    recorder = yield select(getRecorder)
    yield call(recorder.pauseRecording)
    yield put.resolve(setReaderState(ReaderStateOptions.paused))
    yield put.resolve(setCurrentModal('modal-exit'))
  })

  yield takeLatest(TURN_IN_CLICKED, function* (payload) {
    // need to put this up here because might turn in from paused view


    // TODO submit the recording

    yield put.resolve(setReaderState(ReaderStateOptions.submitted))

    const isDemo = yield select(getIsDemo)
    if (isDemo) {
      yield put.resolve(setCurrentOverlay('overlay-demo-submitted'))
    }
    else {
      yield put.resolve(setCurrentOverlay('overlay-submitted'))
      setTimeout(() => {
        window.location.href = "/" // TODO where to redirect?
      }, 5000)
    }

  })


  yield takeEvery(PAUSE_CLICKED, function* (payload) {
    recorder = yield select(getRecorder)
    yield call(recorder.pauseRecording)
    yield put.resolve(setReaderState(ReaderStateOptions.paused))
    yield put.resolve(setCurrentSound('/audio/paused.m4a'))
    yield put.resolve(setCurrentModal('modal-paused'))
    // directly show modal here
  })

  yield takeEvery(RESUME_CLICKED, function* (payload) {
    recorder = yield select(getRecorder)
    yield call(recorder.resumeRecording)
    yield put.resolve(setReaderState(ReaderStateOptions.inProgress))
    yield put.resolve(setCurrentModal('no-modal'))
  })

  yield takeEvery(NEXT_PAGE_CLICKED, function* (payload) {
    yield put.resolve({ type: PAGE_INCREMENT })
  })

  yield takeEvery(PREVIOUS_PAGE_CLICKED, function* (payload) {
    yield put.resolve({ type: PAGE_DECREMENT })
  })

  yield takeEvery(RESTART_RECORDING_CLICKED, function* (action) {
    recorder = yield select(getRecorder)
    yield call(recorder.reset)
    yield put.resolve(setCurrentModal('no-modal'))
    yield put.resolve(setReaderState(ReaderStateOptions.awaitingStart))
    yield put.resolve(setPageNumber(0))
  })



  yield take(STOP_RECORDING_CLICKED)

  yield put.resolve(setReaderState(ReaderStateOptions.done))
  recorder = yield select(getRecorder)
  const blobURL = yield stopRecorderAndGetBlobURL(recorder)

  yield put.resolve(setRecordingURL(blobURL))
  yield put.resolve(setCurrentModal('modal-done'))
  // yield call(recorder.forceDownloadRecording, ['_test_.wav'])

  yield takeEvery(HEAR_RECORDING_CLICKED, function* (action) {
    yield put.resolve(setCurrentModal('modal-playback'))
  })








}


