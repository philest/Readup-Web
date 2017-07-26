import {
  fork,
  call,
  take,
  takeLatest,
  takeLatest,
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

  yield takeLatest(MIC_SET_PERMISSIONS, function* (action) {
    if (action.payload.micPermissionsStatus === MicPermissionsStatusOptions.granted) {
      const recorder = yield select(getRecorder)
      yield call(recorder.initialize)
    }
  })

  yield takeLatest(RECORDING_START, function* (action) {
    const recorder = yield select(getRecorder)
    yield call(recorder.startRecording)
  })

  yield takeLatest(RECORDING_STOP, function* (action) {
    const recorder = yield select(getRecorder)
    yield call(recorder.stopRecording)
  })

  yield takeLatest(RECORDING_PAUSE, function* (action) {
    const recorder = yield select(getRecorder)
    yield call(recorder.pauseRecording)
  })

  yield takeLatest(RECORDING_RESUME, function* (action) {
    const recorder = yield select(getRecorder)
    yield call(recorder.resumeRecording)
  })


  yield takeLatest(RECORDING_RESTART, function* (action) {
    const recorder = yield select(getRecorder)
    yield call(recorder.reset)
  })

  // yield takeLatest(RECORDING_SUBMIT, function* (action) {
  // })

  // yield takeLatest(RECORDING_PLAYBACK, function* (action) {
  // })

  // yield takeLatest(PERMISSIONS_ARROW_CLICKED, function* (action) {
  // })

  // yield takeLatest(PAGE_INCREMENT, function* (action) {
  // })

  // yield takeLatest(PAGE_DECREMENT, function* (action) {
  // })

  // yield takeLatest(RECORDING_COUNTDOWN_TO_START, function* (action) {
  // })
}


