import {
  fork,
  call,
  take,
  takeLatest,
  takeEvery,
  cancel,
  put,
  select,
} from 'redux-saga/effects'

import {
  ReaderStateOptions,
  ReaderState,
  MicPermissionsStatus,
  MicPermissionsStatusOptions,
} from '../types'


// actions
import {
  MIC_SET_PERMISSIONS,
  PAGE_INCREMENT,
  PAGE_DECREMENT,
  RECORDING_COUNTDOWN_TO_START,
  RECORDING_START,
  RECORDING_STOP,
  RECORDING_PAUSE,
  RECORDING_RESUME,
  RECORDING_SUBMIT,
  RECORDING_RESTART,
  RECORDING_PLAYBACK,
  PERMISSIONS_ARROW_CLICKED,
} from '../state'

import {
  getRecorder,
} from './selectors'

export default function* recorderSaga() {

  yield call(console.log, 'Loading Recorder Saga')


  yield takeEvery(MIC_SET_PERMISSIONS, function* (action) {
    if (action.payload.micPermissionsStatus === MicPermissionsStatusOptions.granted) {
      const recorder = yield select(getRecorder)
      yield call(recorder.initialize)
    }
  })

  yield takeEvery(PAGE_INCREMENT, function* (action) {

  })

  yield takeEvery(PAGE_DECREMENT, function* (action) {
  })

  yield takeEvery(RECORDING_COUNTDOWN_TO_START, function* (action) {
  })

  yield takeEvery(RECORDING_START, function* (action) {
    const recorder = yield select(getRecorder)
    yield call(recorder.startRecording)
  })

  yield takeEvery(RECORDING_STOP, function* (action) {
    const recorder = yield select(getRecorder)
    yield call(recorder.stopRecording)
  })

  yield takeEvery(RECORDING_PAUSE, function* (action) {
    const recorder = yield select(getRecorder)
    yield call(recorder.pauseRecording)
  })

  yield takeEvery(RECORDING_RESUME, function* (action) {
    const recorder = yield select(getRecorder)
    yield call(recorder.resumeRecording)
  })

  yield takeEvery(RECORDING_SUBMIT, function* (action) {
  })

  yield takeEvery(RECORDING_RESTART, function* (action) {
    const recorder = yield select(getRecorder)
    yield call(recorder.reset)
  })

  yield takeEvery(RECORDING_PLAYBACK, function* (action) {

  })

  yield takeEvery(PERMISSIONS_ARROW_CLICKED, function* (action) {

  })

}


