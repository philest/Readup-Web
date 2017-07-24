import { fork, call, take, takeLatest, takeEvery, cancel, put, select, apply } from 'redux-saga/effects'


import recorderSaga from './recorderSaga'
import audioEffectsSaga from './audioEffectsSaga'

import Recorder from '../recorder' 

import { playSound, stopAudio } from '../audioPlayer'

import { ReaderStateOptions, ReaderState, MicPermissionsStatusOptions, PauseTypeOptions } from '../types'


// selectors
const getRecorder = state => state.reader.recorder


// actions

import { MIC_SET_PERMISSIONS, START_RECORDING_CLICKED, STOP_RECORDING_CLICKED, PAGE_INCREMENT, PAGE_DECREMENT, RECORDING_COUNTDOWN_TO_START, RECORDING_START, RECORDING_STOP, RECORDING_PAUSE, RECORDING_RESUME, RECORDING_SUBMIT, RECORDING_RESTART, RECORDING_PLAYBACK, PERMISSIONS_ARROW_CLICKED, BOOK_INTRO_RECORDING_ENDED, NEXT_PAGE_CLICKED, PREVIOUS_PAGE_CLICKED, PAUSE_CLICKED, RESUME_CLICKED, RESTART_RECORDING_CLICKED, startCountdownToStart, setMicPermissions, startRecording, COUNTDOWN_ENDED, setReaderState, setPageNumber, setHasRecordedSomething, setCurrentSound } from '../state'



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

    // initialize
    const recorder = yield select(getRecorder)
    const getPermissionSuccess = yield call(getPermission, recorder)
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

  const permissionsGranted = yield getMicPermissions() // blocks

  if (!permissionsGranted) {
    return
  }

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




  yield takeEvery(PAUSE_CLICKED, function* (payload) {
    recorder = yield select(getRecorder)
    yield apply(recorder, recorder.pauseRecording)
    yield put(setReaderState(ReaderStateOptions.paused))
    yield put(setCurrentSound('/audio/paused.m4a'))
    // directly show modal here
  })

  yield takeEvery(RESUME_CLICKED, function* (payload) {
    recorder = yield select(getRecorder)
    yield apply(recorder, recorder.resumeRecording)
    yield put(setReaderState(ReaderStateOptions.inProgress))
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
  })



  yield take(STOP_RECORDING_CLICKED)

  yield put(setReaderState(ReaderStateOptions.done))
  recorder = yield select(getRecorder)
  const blobURL = yield stopRecorderAndGetBlobURL(recorder)
  
  yield apply(recorder, recorder.forceDownloadRecording, ['_test_.wav'])
  const url = yield apply(recorder, recorder.getBlobURL)
  yield call(console.log, '!!!!!!!!!')
  yield call(console.log, url)


  
  yield takeLatest(RECORDING_SUBMIT, function* (payload) {
    // submit the recording
  })



  

}


