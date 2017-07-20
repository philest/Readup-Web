import { fork, call, take, takeLatest, takeEvery, cancel, put, select } from 'redux-saga/effects'


import recorderSaga from './recorderSaga'
import audioEffectsSaga from './audioEffectsSaga'

import { ReaderStateOptions, ReaderState, MicPermissionsStatusOptions, MicPermissionsStatus } from '../types'


// selectors

// actions

import { MIC_SET_PERMISSIONS, PAGE_INCREMENT, PAGE_DECREMENT, RECORDING_COUNTDOWN_TO_START, RECORDING_START, RECORDING_STOP, RECORDING_PAUSE, RECORDING_RESUME, RECORDING_SUBMIT, RECORDING_RESTART, RECORDING_PLAYBACK, PERMISSIONS_ARROW_CLICKED } from '../state'




export default function* rootSaga() {

  yield call(console.log, 'ROOT SAGA')

  yield fork(audioEffectsSaga)
  yield fork(recorderSaga)

  

}


