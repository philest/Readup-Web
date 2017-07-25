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
  apply,
} from 'redux-saga/effects'

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


function* pauseAssessmentSaga (action) {
  const recorder = yield select(getRecorder)
  yield call(recorder.pauseRecording)
  yield put.resolve(setReaderState(
    ReaderStateOptions.paused,
  ))
  yield put.resolve(setCurrentSound('/audio/paused.m4a'))
  yield put.resolve(setCurrentModal('modal-paused'))
  // directly show modal here
}

function* resumeAssessmentSaga (action) {
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
  yield takeEvery(PAUSE_CLICKED, pauseAssessmentSaga)
  yield takeEvery(RESUME_CLICKED, resumeAssessmentSaga)

  yield takeEvery(NEXT_PAGE_CLICKED, function* (payload) {
    yield put({ type: PAGE_INCREMENT })
  })

  yield takeEvery(PREVIOUS_PAGE_CLICKED, function* (payload) {
    yield put.resolve({ type: PAGE_DECREMENT })
  })
  // start recording the assessment audio
  const recorder = yield select(getRecorder)
  yield call(recorder.startRecording)
  yield put.resolve(setHasRecordedSomething(true))

  yield call(console.log, 'hiiiiiii')
  yield take(STOP_RECORDING_CLICKED) // TODO: better name

  return yield { some: 'sick results' }


}


