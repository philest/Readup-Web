// @flow
import { fork, call, take, takeLatest, takeEvery, cancel, put, select } from 'redux-saga/effects'


import { playSound, stopAudio as stopAudioRef } from '../audioPlayer'

import {
  ReaderStateOptions,
  ReaderState,
  MicPermissionsStatus,
  MicPermissionsStatusOptions,
} from '../types'


// actions

import {
  MIC_SET_PERMISSIONS,
  BOOK_INTRO_RECORDING_ENDED,
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
  bookIntroRecordingEnded,
} from '../state'



function* stopAudioSaga() {
  yield call(stopAudioRef)
}


export default function* audioEffectsSaga() {

  yield call(console.log, 'Loading Audio Effects Saga!!!')

  yield takeEvery(MIC_SET_PERMISSIONS, function* (action) {
    yield* stopAudioSaga()

    if (action.payload.micPermissionsStatus === MicPermissionsStatusOptions.granted) {
      const error = yield call(playSound, '/audio/sample.m4a')
      yield put({ type: BOOK_INTRO_RECORDING_ENDED })
    }

  })

  yield takeEvery(PAGE_INCREMENT, stopAudioSaga)

  yield takeEvery(PAGE_DECREMENT, stopAudioSaga)


  yield takeEvery(RECORDING_START, stopAudioSaga)

  yield takeEvery(RECORDING_STOP, function* (action) {
    yield call(playSound, '/audio/done.m4a')

  })

  yield takeEvery(RECORDING_PAUSE, function* (action) {
    yield call(playSound, '/audio/paused.m4a')
  })

  yield takeEvery(RECORDING_RESUME, stopAudioSaga)

  yield takeEvery(RECORDING_SUBMIT, stopAudioSaga)

  yield takeEvery(RECORDING_RESTART, stopAudioSaga)

  yield takeEvery(RECORDING_PLAYBACK, stopAudioSaga)

  yield takeEvery(PERMISSIONS_ARROW_CLICKED, function* (action) {
    yield call(playSound, '/audio/click_allow_button.m4a')
  })

}


