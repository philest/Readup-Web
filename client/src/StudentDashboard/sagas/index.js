import { fork, call, take, takeLatest, takeEvery, cancel, put, select } from 'redux-saga/effects'


import recorderSaga from './recorderSaga'
import audioEffectsSaga from './audioEffectsSaga'

import Recorder from '../recorder' 

import { ReaderStateOptions, ReaderState, MicPermissionsStatusOptions, MicPermissionsStatus } from '../types'


// selectors
const getRecorder = state => state.reader.recorder


// actions

import { MIC_SET_PERMISSIONS, PAGE_INCREMENT, PAGE_DECREMENT, RECORDING_COUNTDOWN_TO_START, RECORDING_START, RECORDING_STOP, RECORDING_PAUSE, RECORDING_RESUME, RECORDING_SUBMIT, RECORDING_RESTART, RECORDING_PLAYBACK, PERMISSIONS_ARROW_CLICKED, setMicPermissions } from '../state'



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


function* handleMicPermissions() {

  const hasPermissions = yield call(checkPermission)
  if (hasPermissions) {
    yield put(setMicPermissions(MicPermissionsStatusOptions.granted))
  }
  else {
    yield put(setMicPermissions(MicPermissionsStatusOptions.awaiting))

    // initialize
    const recorder = yield select(getRecorder)
    const getPermissionSuccess = yield call(getPermission, recorder)
    if (getPermissionSuccess) {
      yield put(setMicPermissions(MicPermissionsStatusOptions.granted))
    }
    else {
      yield put(setMicPermissions(MicPermissionsStatusOptions.blocked))
    }
  }

}


export default function* rootSaga() {

  yield call(console.log, 'ROOT SAGA')

  yield fork(audioEffectsSaga)
  yield fork(recorderSaga)


  yield handleMicPermissions()


  

}


