// @flow
import { fork, call, take, takeLatest } from 'redux-saga/effects'


import { playSound, stopAudio as stopAudioRef } from '../audioPlayer'

import {
  MicPermissionsStatusOptions,
} from '../types'


// actions

import {
  PAGE_INCREMENT,
  PAGE_DECREMENT,
  RECORDING_START,
  RECORDING_RESUME,
  RECORDING_SUBMIT,
  RECORDING_RESTART,
  RECORDING_PLAYBACK,
} from '../state'


function* stopAudioSaga() {
  yield call(stopAudioRef)
}

export default function* audioEffectsSaga() {

  yield call(console.log, 'Loading Audio Effects Saga!!!')

  yield takeLatest(PAGE_INCREMENT, stopAudioSaga)

  yield takeLatest(PAGE_DECREMENT, stopAudioSaga)

  yield takeLatest(RECORDING_START, stopAudioSaga)

  yield takeLatest(RECORDING_RESUME, stopAudioSaga)

  yield takeLatest(RECORDING_SUBMIT, stopAudioSaga)

  yield takeLatest(RECORDING_RESTART, stopAudioSaga)

  yield takeLatest(RECORDING_PLAYBACK, stopAudioSaga)
}


