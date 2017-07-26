// @flow
import {
  fork,
  call,
  take,
  takeLatest,
  cancel,
  put,
  select,
  apply,
} from 'redux-saga/effects'

import { delay } from 'redux-saga'

// actions
import {
  PAGE_INCREMENT,
  PAGE_DECREMENT,
  NEXT_PAGE_CLICKED,
  PREVIOUS_PAGE_CLICKED,
  PAUSE_CLICKED,
  RESUME_CLICKED,
  STOP_RECORDING_CLICKED,
  setHasRecordedSomething,
  setCurrentSound,
  setCurrentModal,
  setReaderState,
} from '../state'

import {
  ReaderStateOptions,
} from '../types'

import {
  getRecorder,
  getIsDemo,
} from './selectors'

import { playSoundAsync, stopAudio } from '../audioPlayer'

// import {
//   clog
// } from './helpers'

function* pauseAssessmentSaga (action) {
  const recorder = yield select(getRecorder)
  yield call(recorder.pauseRecording)
  yield delay(300) // delay to prevent phil's voice from getting pick up :/
  yield call(playSoundAsync, '/audio/paused.m4a')
  yield put.resolve(setReaderState(
    ReaderStateOptions.paused,
  ))
  // yield put.resolve(setCurrentSound('/audio/paused.m4a'))
  yield put.resolve(setCurrentModal('modal-paused'))
  return
  // directly show modal here
}

function* resumeAssessmentSaga (action) {
  yield call(stopAudio)
  const recorder = yield select(getRecorder)
  yield call(recorder.resumeRecording)
  yield put.resolve(setReaderState(
    ReaderStateOptions.inProgress,
  ))
  yield put.resolve(setCurrentModal('no-modal'))
}



// TODO: flowtype the assessment results as return value
export default function* assessmentSaga() {

  // watchers!
  // TODO: refactor this into saga for referential integrity of recorder
  yield takeLatest(PAUSE_CLICKED, pauseAssessmentSaga)
  yield takeLatest(RESUME_CLICKED, resumeAssessmentSaga)

  yield takeLatest(NEXT_PAGE_CLICKED, function* (payload) {
    yield put({ type: PAGE_INCREMENT })
  })

  yield takeLatest(PREVIOUS_PAGE_CLICKED, function* (payload) {
    yield put({ type: PAGE_DECREMENT })
  })
  // start recording the assessment audio
  const recorder = yield select(getRecorder)
  yield call(recorder.startRecording)
  yield put.resolve(setHasRecordedSomething(true))

  return { some: 'sick results' }
}


