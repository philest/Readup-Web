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
  race,
  all,
} from 'redux-saga/effects'
import { delay } from 'redux-saga'


import {
  getS3Presign,
  sendAudioToS3,
  requestNewAssessment,
  getStudentPromptStatus,
  resetToAwaitingPrompt,
  getLastStudentID,
} from './networkingHelpers'

import {
  clog,
  isMobileDevice,
} from './helpers'


import audioEffectsSaga from './audioEffectsSaga'
import Recorder from '../recorder'
import { playSound, stopAudio, playSoundAsync as _pSA, DEV_DISABLE_VOICE_INSTRUCTIONS } from '../audioPlayer'

// actions
import {
  PERMISSIONS_ARROW_CLICKED,
  PAUSE_CLICKED,
  START_RECORDING_CLICKED,
  STOP_RECORDING_CLICKED,
  BOOK_INTRO_RECORDING_ENDED,
  INTRO_CONTINUE_CLICKED,
  HEAR_RECORDING_CLICKED,
  SEE_BOOK_CLICKED,
  COUNTDOWN_ENDED,
  EXIT_CLICKED,
  RESTART_RECORDING_CLICKED,
  TURN_IN_CLICKED,
  IS_DEMO_SET,
  SPINNER_SHOW,
  SPINNER_HIDE,
  DEMO_SUBMITTED_LOGOUT_CLICKED,
  IN_COMP_SET,
  SEE_COMP_CLICKED,
  HEAR_QUESTION_AGAIN_CLICKED,
  QUESTION_INCREMENT,
  QUESTION_DECREMENT,
  LAST_QUESTION_EXITED,
  VOLUME_INDICATOR_HIDDEN,
  BOOK_KEY_SET,
  startCountdownToStart,
  setMicPermissions,
  setHasRecordedSomething,
  setReaderState,
  setPageNumber,
  setCurrentSound,
  setRecordingURL,
  setCurrentModal,
  setCurrentOverlay,
  setCountdownValue,
  setInComp,
  setQuestionNumber,
  setPrompt,
  hideVolumeIndicator,

} from '../state'


import {
  ReaderStateOptions,
  MicPermissionsStatusOptions,
  PromptOptions,
  PromptAudioOptions,
} from '../types'

import {
  getRecorder,
  getIsDemo,
  getNumQuestions,
} from './selectors'

import assessmentSaga from './assessmentSaga'

import { sendEmail } from '../../ReportsInterface/emailHelpers'


const QUESTION_CHANGE_DEBOUNCE_TIME_MS = 200
const MAX_NUM_PROMPTS = 2

function getPermission(recorder) {

  return navigator.mediaDevices.getUserMedia({audio: true})
  .then(function(yay) {
    recorder.initialize()
    return true
  }).catch(function(err) {
    return false
  });
  // return new Promise(function(resolve, reject) {
  //   console.log('hihihih');

  //   const result = recorder.initialize((error) => {
  //     resolve(error)
  //   })
  //   console.log('CLOG', result);
  // });
}






function* playSoundAsync(sound) {
  yield call(_pSA, sound)
  return
}





function* getMicPermissionsSaga() {

  const hasPermissions = yield new Promise((resolve, reject) => {
    Recorder.hasRecordingPermissions((permissions) => {
      console.log("We have permissions? " + permissions)
      resolve(permissions)
    })
  })

  if (hasPermissions) {
    yield put.resolve(setMicPermissions(MicPermissionsStatusOptions.granted))
    return true
  }

  yield put.resolve(setMicPermissions(MicPermissionsStatusOptions.awaiting))
  yield put.resolve(setCurrentOverlay('overlay-permissions'))

  const recorder =              yield select(getRecorder)
  const getPermissionSuccess =  yield getPermission(recorder)

  const micPermissions = getPermissionSuccess ? MicPermissionsStatusOptions.granted : MicPermissionsStatusOptions.blocked
  yield put.resolve(setMicPermissions(micPermissions))

  return getPermissionSuccess
}


function errorHandler(error) {
    console.log("saw this error:", error);
}

function* haltRecordingAndGenerateBlobSaga(recorder, isCompBlob, firstTime) {
  yield put.resolve(setReaderState(ReaderStateOptions.done))

  let blobURL

  try {
      blobURL = yield new Promise(function(resolve, reject) {

      recorder.stopRecording((blobUrl) => {
        resolve(blobUrl)
      })

    });
  } catch (err) {
      yield clog("ERROR: ", err)

  }

  blobURL = blobURL || 'fake'

  // this is done in the Store because PlaybackModal takes this is a prop
  if (!isCompBlob) {
    yield put.resolve(setRecordingURL(blobURL, isCompBlob))
  }
  else if (firstTime) {
    yield put.resolve(setRecordingURL(blobURL, isCompBlob))
  }

  return yield blobURL
}




function* redirectToHomepage () {
  yield window.location.href = "/"
}






function* turnInAudio(blob, assessmentId: number, isCompBlob: boolean) {

  let numAttempts = 2

  if (isCompBlob) {
    numAttempts = 1
  }


  for (let i = 0; i < numAttempts; i++) {
    try {
      const presign = yield getS3Presign(assessmentId, isCompBlob)
      const res = yield sendAudioToS3(blob, presign)
      yield clog('yay response!', res)
      return yield res
    } catch (err) {
      yield clog("turnInAudio error ERR:", err, err.request)
    }
  }
  return yield false // TODO: this is pretty meh
}







function* exitClick() {
  const recorder = yield select(getRecorder)
  yield call(recorder.pauseRecording)
  yield put.resolve(setReaderState(
    ReaderStateOptions.paused,
  ))

  yield call(stopAudio)
  yield call(playSoundAsync, '/audio/bamboo.mp3')

  yield put(setCurrentModal('modal-exit'))
}




function* questionIncrementSaga (action) {
  yield clog("here in QUESTION_INCREMENT........")

  yield call(delay, QUESTION_CHANGE_DEBOUNCE_TIME_MS)
  yield put({ type: QUESTION_INCREMENT })
}




function* playPromptSaga(prompt, studentID) {
    let audiofile = PromptAudioOptions[prompt]
    yield playSound(audiofile)
    yield call(resetToAwaitingPrompt, studentID)
}




function* newFetchUntilPrompt(studentID){
  let fetchedPrompt = PromptOptions.awaitingPrompt

  while (fetchedPrompt === PromptOptions.awaitingPrompt) {
    fetchedPrompt = yield getStudentPromptStatus(studentID)
      .catch(e => e.request) // TODO
  
    if (fetchedPrompt === PromptOptions.noPromptNeeded) {
      yield call(resetToAwaitingPrompt, studentID)
      return null
    }
    
    yield clog('Prompt:', fetchedPrompt)
    yield call(delay, 1000)
  }

  return fetchedPrompt // a meaningful prompt was found 
}




function* instructionSaga() {
    yield put.resolve(setPageNumber(0))
    yield put.resolve(setInComp(true))

    if (!DEV_DISABLE_VOICE_INSTRUCTIONS) {

      yield call(delay, 500)

      yield playSoundAsync('/audio/VB/min/VB-comp-instructions.mp3')

      yield call(delay, 1400)

      yield put.resolve(setReaderState(
        ReaderStateOptions.talkingAboutStartButton,
      ))

      yield call(delay, 2480)

      yield put.resolve(setReaderState(
        ReaderStateOptions.talkingAboutStopButton,
      ))

      yield call(delay, 1900)

    }

}


// assumes at least one question...
function* definedCompSaga(numQuestions) {
  
  let compBlobArray = []

  for(let currQ = 1; currQ <= numQuestions; currQ++){

      yield clog("currQ IS", currQ)

      let isFirstTime = (currQ === 1)
      if (isFirstTime) { // first time, play instructions 
          yield put.resolve(setCurrentModal('modal-comp'))
          yield call(instructionSaga)
      }


      let newBlob = yield* compSaga(isFirstTime)
      compBlobArray.push(newBlob)

        // reset the recorder each time
        let recorder = yield select(getRecorder)
        yield call(recorder.reset)
        recorder = yield select(getRecorder)
        yield call(recorder.initialize)
  }

  return compBlobArray

}

// worry about pause->stop later. 
function* promptSaga() {

  yield put.resolve(setReaderState(
    ReaderStateOptions.awaitingStart,
  ))


  yield take(START_RECORDING_CLICKED)

  yield call(stopAudio)

  yield playSoundAsync('/audio/single_countdown.mp3')

  yield call(delay, 900)

  let recorder = yield select(getRecorder)

  // resume recording 
  try {
    yield call(recorder.resumeRecording)
    yield put.resolve(setReaderState(
      ReaderStateOptions.inProgress,
    ))
  } catch (err) {
    yield clog("ERROR: ", err)
    yield call(sendEmail, err, "Recorder failed to resume in promptSaga...", "philesterman@gmail.com") // move here so don't break
  }

  yield take(STOP_RECORDING_CLICKED)
  yield call(stopAudio)

  try {
    yield call(recorder.pauseRecording)
    yield put.resolve(setReaderState(
      ReaderStateOptions.paused,
    ))
  } catch (err) {
    yield clog("ERROR: ", err)
    yield call(sendEmail, err, "Recorder failed to pause in promptSaga...", "philesterman@gmail.com") // move here so don't break
  }

}


function* compSaga(firstTime: boolean, isPrompt: boolean) {

  const compEffects = []

  yield put.resolve(setReaderState(
    ReaderStateOptions.playingBookIntro,
  ))


  yield put.resolve(setCurrentModal('modal-comp'))



  yield put.resolve(setReaderState(
    ReaderStateOptions.playingBookIntro,
  ))

  if (firstTime) {
    yield call(delay, 8200)
  }

  yield put.resolve(setReaderState(
    ReaderStateOptions.awaitingStart,
  ))



  // BEGIN the former compSeeBookSaga

  compEffects.push(
    yield takeLatest(SEE_BOOK_CLICKED, function* () {
      yield put.resolve(setCurrentModal('no-modal'))
      yield call(stopAudio)
    })
  )

  compEffects.push(
    yield takeLatest(SEE_COMP_CLICKED, function* () {
      yield put.resolve(setCurrentModal('modal-comp'))
    })
  )

  // END the former compSeeBookSaga



  yield take(START_RECORDING_CLICKED)

  yield call(stopAudio)

  yield playSoundAsync('/audio/single_countdown.mp3')

  yield call(delay, 900)

  let recorder = yield select(getRecorder)


  if (!isPrompt) {
    // Start recording 
    try {
      yield call(recorder.startRecording)
      yield put.resolve(setHasRecordedSomething(true))
      yield put.resolve(setReaderState(
        ReaderStateOptions.inProgress,
      ))
    } catch (err) {
      yield clog("ERROR: ", err)
      yield call(sendEmail, err, "Recorder failed to start in comp...", "philesterman@gmail.com") // move here so don't break
    }
  }
  else {
    try {
      yield call(recorder.resumeRecording)
      yield put.resolve(setReaderState(
        ReaderStateOptions.inProgress,
      ))
    } catch (err) {
      yield clog("ERROR: ", err)
      yield call(sendEmail, err, "Recorder failed to resume in comp...", "philesterman@gmail.com") // move here so don't break
    }
  }



  // In middle of recording 



  const studentID = yield getLastStudentID()
    .catch(e => e.request) // TODO

  yield clog('studentID is', studentID)


  yield take(STOP_RECORDING_CLICKED)

  yield call(stopAudio)


  recorder = yield select(getRecorder)

  // Pause it for the prompt fetching 
  yield call(recorder.pauseRecording)
  yield put.resolve(setReaderState(
    ReaderStateOptions.paused,
  ))


  yield playSound('/audio/complete.mp3')




  yield clog('made it here 3')

  yield clog('compEffects is....', compEffects)


  yield put({ type: SPINNER_SHOW })



  const { prompt, timeout } = yield race({
    prompt: call(newFetchUntilPrompt, studentID),
    timeout: call(delay, 5000),
  })


    yield put.resolve(setReaderState(
      ReaderStateOptions.playingBookIntro,
    ))

    yield put({ type: SPINNER_HIDE })




  if (prompt) {

    yield clog("111 We found a prompt!: ", prompt)

    yield call(playPromptSaga, prompt, studentID)

    yield cancel(...compEffects)

    return yield call(compSaga, false)

  }


  else {
    yield clog("111 NO PROMPT FOUND")

    // stop it 
    const compRecordingURL = yield* haltRecordingAndGenerateBlobSaga(recorder, true, firstTime);
    yield clog('url for comp recording!!!', compRecordingURL)

    yield put.resolve(setReaderState(
      ReaderStateOptions.playingBookIntro,
    ))


    yield put.resolve(setCurrentModal('no-modal'))

    yield* questionIncrementSaga()

    yield cancel(...compEffects)

    try {
      return recorder.getBlob()
    } catch (err) {
      yield clog ('err: ', err)
      return 'it broke'
    }

  }

}


function* hideVolumeSaga() {
    yield call(delay, 4000)
    yield put.resolve(hideVolumeIndicator())
}




function* assessThenSubmitSaga(bookKey) {

  const effects = []


  // TODO: convert this into a batched action
  yield put.resolve(setPageNumber(0))
  yield put.resolve(setQuestionNumber(1))
  yield put.resolve(setPrompt(
    PromptOptions.awaitingPrompt,
  ))

  yield put.resolve(setInComp(false))
  yield put.resolve(setHasRecordedSomething(false))
  yield put.resolve(setCurrentModal('no-modal'))

  yield put(setCurrentOverlay('no-overlay'))

  const permissionsGranted = yield*  getMicPermissionsSaga() // blocks

  // TODO asap as possible
  // TODO: some loop here :)
  while (!permissionsGranted) {
    yield put(setCurrentOverlay('overlay-blocked-mic'))
    yield take('ickkkkk')
    return
  }

  yield put(setCurrentOverlay('no-overlay'))


  // permission was granted!!!!



  let recorder = yield select(getRecorder)
  yield call(recorder.initialize)

  yield put.resolve(setReaderState(
    ReaderStateOptions.awaitingStart,
  ))

  effects.push(
    yield fork(hideVolumeSaga),
  )

  // before assessment has started, clicking exit immediately quits app
  // I guess. We will probably change this
  const { exit } = yield race({
    exit: take(EXIT_CLICKED),
    startAssessment: take(START_RECORDING_CLICKED),
  })


  // const { exit, fake } = yield all([
  //   race({
  //     exit: take(EXIT_CLICKED),
  //     startAssessment: take(START_RECORDING_CLICKED),
  //   })
  // ])


  yield call(stopAudio)

  // the app will end :O
  if (exit) {
    yield* redirectToHomepage()
  }


  // now we start the assessment for real
  effects.push(
    yield takeLatest(EXIT_CLICKED, exitClick),
  )

  yield call(sendEmail, "Demo started", "Demo was started", "philesterman@gmail.com") // move here so don't break

  // TODO: convert the countdown to saga!!!!
  yield put.resolve(setPageNumber(1))
  yield put.resolve(setReaderState(
    ReaderStateOptions.countdownToStart,
  ))

  yield playSoundAsync('/audio/recording_countdown.mp3')


  if (!DEV_DISABLE_VOICE_INSTRUCTIONS) {

    let countdown = 3
    while (countdown > 0) {
      yield put(setCountdownValue(countdown))
      yield call(delay, 1000)
      countdown--
    }
  }


  // yield put(setCurrentSound('/audio/book_intro.mp3'))

  yield put.resolve(setCurrentModal('no-modal'))




  yield put.resolve(setReaderState(
    ReaderStateOptions.inProgress,
  ))

  // TODO Phil: better user creation. 
   $.ajax({
      url: ('/auth/phil_setup_demo?book_key=' + bookKey),
      type: 'post',
    }).fail(function(xhr, status, err) {
      console.log(err)
   })

  

  // this ensures that effects are canceleld
  // while (true) {
  //   const {exit} = yield race({
  //     exit:             take(EXIT_CLICKED),
  //     assessmentResult: call(assessmentSaga),
  //   })

  //   if (exit) {
  //     yield call(exitClick)
  //   } else {

  //   }
  // }
  // starts the recording assessment flow
  effects.push(
    yield fork(assessmentSaga),
  )


  const { endRecording } = yield race({
    turnItIn: take(TURN_IN_CLICKED),
    endRecording: take(STOP_RECORDING_CLICKED),
  })


  recorder = yield select(getRecorder)


  const recordingURL = yield* haltRecordingAndGenerateBlobSaga(recorder, false, false);

  yield clog('url for recording!!!', recordingURL)

  let recordingBlob

  try {
    recordingBlob = recorder.getBlob()
  }
  catch (err) {
    recordingBlob = 'it broke'
    yield clog('err:', err)
  } 





  let blobAndPrompt
  let fetchedPrompt
  let compBlob

  if (endRecording) {

    yield put.resolve(setReaderState(
      ReaderStateOptions.playingBookIntro,
    ))

    yield playSound('/audio/complete.mp3')


    //  reset recorder
    let recorder = yield select(getRecorder)
    yield call(recorder.reset)
    recorder = yield select(getRecorder)
    yield call(recorder.initialize)


    yield call(delay, 300)

    yield playSound('/audio/VB/min/VB-now-questions.mp3')

    // const {
    //   comp,
    //   finishComp,
    // } = yield race({
    //   comp: call(generalCompSaga),
    //   finishComp: take(LAST_QUESTION_EXITED),
    // })
    const numQuestions = yield select(getNumQuestions)

    const compBlobArray = yield call(definedCompSaga, numQuestions)
    compBlob = compBlobArray[0]




    yield put({ type: SPINNER_HIDE })


    // let compRecordingURL = yield* haltRecordingAndGenerateBlobSaga(recorder, true);
    // yield clog('url for comp recording!!!', compRecordingURL)

    // try {
    //   compBlob = recorder.getBlob()
    // }
    // catch (err) {
    //   combBlob = 'it broke'
    //   yield clog('err:', err) 
    // } 





    yield put.resolve(setCurrentModal('modal-done'))

    yield call(delay, 200)
    yield playSoundAsync('/audio/VB/VB-done.mp3')

  }

  compBlob = compBlob || ''




  // do not delete, this is import :)
  if (endRecording) {
    yield take(TURN_IN_CLICKED)
  }


  yield cancel(...effects)

  yield clog("recordingBlob:   ", recordingBlob)
  yield clog("compblog:   ", compBlob)

  return [recordingBlob, compBlob]

}



function* rootSaga() {
  const { payload: { isDemo } } = yield take(IS_DEMO_SET)
  const { payload: { bookKey } } = yield take(BOOK_KEY_SET)

  yield clog("isDemo: ", isDemo)

  yield clog("bookKey: ", bookKey)

  yield clog('Root Saga Started')


  const newBookKey = isDemo ? 'demo' : 'unclear'
  yield clog('Generating assessment... newBookKey:', newBookKey)
  const assessmentId = yield requestNewAssessment(newBookKey)
    .catch(e => e.request) // TODO

  yield clog('Assessment ID:', assessmentId)



  // if isMobileDevice, halt
  const isMobile = yield call(isMobileDevice)
  if (isMobile) {
    window.location.href = '/mobile_halt'
    take('ickkk')
  }


  /*
   ****************
   * watchers
   *****************
   */
  // yield* audioEffectsSaga()

  yield takeLatest(HEAR_RECORDING_CLICKED, function* () {
    yield put(setCurrentModal('modal-playback'))
    yield call(stopAudio)
  })


  // yield takeLatest(PERMISSIONS_ARROW_CLICKED, function* () {
  //   yield call(playSound, '/audio/click_allow_button.mp3')
  // })



  /*
   ****************
   * main race
   *****************
   */
  yield clog('Race About To Start')
  while (true) {
    const {
      restartAssessment,
      recordingBlobArray,
      quit,
    } = yield race({
      restartAssessment: take(RESTART_RECORDING_CLICKED),
      recordingBlobArray: call(assessThenSubmitSaga, bookKey),
      quit: take('QUIT_ASSESSMENT_AND_DESTROY'),
    })
    yield clog('Race Finished')

    yield clog('made it here 6')


    if (quit) {
      window.location.href = "/" // eslint-disable-line
      return
    }

    if (restartAssessment) {
      const recorder = yield select(getRecorder)
      yield call(recorder.reset)
      yield put.resolve(setCurrentModal('no-modal'))
      yield put(setCurrentOverlay('no-overlay'))

    } else {

      const recordingBlob = recordingBlobArray[0]
      const compBlob = recordingBlobArray[1]

      yield put({ type: SPINNER_SHOW })

      yield playSoundAsync('/audio/complete.mp3')

      // const turnedIn = yield* turnInAudio(recordingBlob, assessmentId, false)
      const turnedIn = yield* turnInAudio(recordingBlob, assessmentId, false)

      const compTurnedIn = yield* turnInAudio(compBlob, assessmentId, true)


      yield put({ type: SPINNER_HIDE })


      // success!
      if (turnedIn && compTurnedIn) {
        yield clog('turned it in!')

        if (isDemo) {
          yield clog('oh hey you r done')

          window.location.href = "/reports/sample"
          yield put({ type: SPINNER_SHOW })


          // TODO where to redirect?
          // window.location.href = "/reports/1"

        } else {
          yield put(setCurrentOverlay('overlay-submitted'))
          setTimeout(() => {
            // TODO where to redirect?
            window.location.href = "/" // eslint-disable-line
          }, 10000)
          return
        }

        yield put(setReaderState(
          ReaderStateOptions.submitted,
        ))

        yield take("NEVER_PASS")


      // fail! allow option to turn in again?
      } else {
        yield clog('could not turn it in :/')

          // Keep them moving forward anyway...
          yield call(sendEmail, "Just failed to upload to s3... ", "s3 Upload Failure", "philesterman@gmail.com") // move here so don't break

          window.location.href = "/reports/sample"
          yield put({ type: SPINNER_SHOW })

      }

    } // END if (restartAssessment)
  } // END while (true)
} // END function* rootSaga()

export default rootSaga

