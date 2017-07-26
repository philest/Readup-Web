// @flow
import { fork, call, take, takeLatest, cancel, put, select } from 'redux-saga/effects'


import { playSound, stopAudio as stopAudioRef } from '../audioPlayer'

import {
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

  // yield takeLatest(MIC_SET_PERMISSIONS, function* (action) {
  //   yield call(stopAudioSaga)

  //   if (action.payload.micPermissionsStatus === MicPermissionsStatusOptions.granted) {
  //     const error = yield call(playSound, '/audio/sample.m4a')
  //     yield put({ type: BOOK_INTRO_RECORDING_ENDED })
  //   }
  // })

  // yield takeLatest(RECORDING_STOP, function* (action) {
  //   yield call(playSound, '/audio/done.m4a')
  // })

  // yield takeLatest(RECORDING_PAUSE, function* (action) {
  //   yield call(playSound, '/audio/paused.m4a')
  // })

  // yield takeLatest(PERMISSIONS_ARROW_CLICKED, function* (action) {
  //   yield call(playSound, '/audio/click_allow_button.m4a')
  // })

  yield takeLatest(PAGE_INCREMENT, stopAudioSaga)

  yield takeLatest(PAGE_DECREMENT, stopAudioSaga)

  yield takeLatest(RECORDING_START, stopAudioSaga)

  yield takeLatest(RECORDING_RESUME, stopAudioSaga)

  yield takeLatest(RECORDING_SUBMIT, stopAudioSaga)

  yield takeLatest(RECORDING_RESTART, stopAudioSaga)

  yield takeLatest(RECORDING_PLAYBACK, stopAudioSaga)
}


