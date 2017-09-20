// @flow

/* Hi!  How to write FSA-compliant Redux stuff:
 *  1. actions:
 *       <NOUN>_<VERB>, e.g. 'TODO_ADD'
 *  2. action creators:
 *       <verb><Noun>, e.g. addTodo
 */


// TODO REMOVE, put recorder logic in saga
import Recorder from './recorder'

import { ReaderStateOptions, ReaderState, MicPermissionsStatusOptions, MicPermissionsStatus, PauseType, PauseTypeOptions, Prompt, PromptOptions  } from './types'


export const READER_STATE_SET = 'READER_STATE_SET'

export const COUNTDOWN_VALUE_SET = 'COUNTDOWN_VALUE_SET'
export const COUNTDOWN_ENDED = 'COUNTDOWN_ENDED'
export const HAS_RECORDED_SOMETHING_SET = 'RECORDED_SOMETHING_SET'


export const INTRO_CONTINUE_CLICKED = 'INTRO_CONTINUE_CLICKED'
export const START_RECORDING_CLICKED = 'START_RECORDING_CLICKED'
export const STOP_RECORDING_CLICKED = 'CLICK_STOP_RECORDING'
export const PAUSE_CLICKED = 'PAUSE_CLICKED'
export const RESUME_CLICKED = 'RESUME_CLICKED'
export const NEXT_PAGE_CLICKED = 'NEXT_PAGE_CLICKED'
export const PREVIOUS_PAGE_CLICKED = 'PREVIOUS_PAGE_CLICKED'
export const EXIT_CLICKED = 'EXIT_CLICKED'
export const RESTART_RECORDING_CLICKED = 'RESTART_RECORDING_CLICKED'
export const TURN_IN_CLICKED = 'TURN_IN_CLICKED'
export const HEAR_QUESTION_AGAIN_CLICKED = 'HEAR_QUESTION_AGAIN_CLICKED'
export const RECORDING_URL_SET = 'RECORDING_URL_SET'

export const SEE_BOOK_CLICKED = 'SEE_BOOK_CLICKED'
export const HEAR_RECORDING_CLICKED = 'HEAR_RECORDING_CLICKED'

export const DEMO_SUBMITTED_LOGOUT_CLICKED = 'DEMO_SUBMITTED_LOGOUT_CLICKED'
export const SPINNER_SHOW = 'SPINNER_SHOW'
export const SPINNER_HIDE = 'SPINNER_HIDE'

export const CURRENT_SOUND_SET = 'CURRENT_SOUND_SET'
export const CURRENT_MODAL_SET = 'CURRENT_MODAL_SET'
export const CURRENT_OVERLAY_SET = 'CURRENT_OVERLAY_SET'

export const MIC_SET_PERMISSIONS = 'MIC_SET_PERMISSION'
export const BOOK_INTRO_RECORDING_ENDED = 'BOOK_INTRO_RECORDING_ENDED'
export const PAGE_NUMBER_SET = 'PAGE_NUMBER_SET'

export const PAGE_INCREMENT = 'PAGE_INCREMENT'
export const PAGE_DECREMENT = 'PAGE_DECREMENT'

export const RECORDING_COUNTDOWN_TO_START = 'RECORDING_COUNTDOWN_TO_START'
export const RECORDING_START = 'RECORDING_START'
export const RECORDING_STOP = 'RECORDING_STOP'
export const RECORDING_PAUSE = 'RECORDING_PAUSE'
export const RECORDING_RESUME = 'RECORDING_RESUME'
export const RECORDING_SUBMIT = 'RECORDING_SUBMIT'
export const RECORDING_SUBMITTED = 'RECORDING_SUBMITTED'
export const RECORDING_RESTART = 'RECORDING_RESTART'
export const RECORDING_PLAYBACK = 'RECORDING_PLAYBACK'



export const PERMISSIONS_ARROW_CLICKED = 'PERMISSIONS_ARROW_CLICKED'
export const IS_DEMO_SET = 'IS_DEMO_SET'

export const IN_COMP_SET = 'IN_COMP_SET'
export const SEE_COMP_CLICKED = 'SEE_COMP_CLICKED'

export const QUESTION_INCREMENT = 'QUESTION_INCREMENT'
export const QUESTION_DECREMENT = 'QUESTION_DECREMENT'
export const QUESTION_NUMBER_SET = 'QUESTION_NUMBER_SET'

export const PROMPT_SET = 'PROMPT_SET'

export function setReaderState(readerState: ReaderState) {
  return {
    type: READER_STATE_SET,
    payload: {
      readerState,
    },
  }
}

export function setPageNumber(pageNumber: number) {
  return {
    type: PAGE_NUMBER_SET,
    payload: {
      pageNumber,
    },
  }
}

export function setPrompt(prompt: Prompt) {
  return {
    type: PROMPT_SET,
    payload: {
      prompt,
    },
  }
}



export function setHasRecordedSomething(hasRecordedSomething: boolean) {
  return {
    type: HAS_RECORDED_SOMETHING_SET,
    payload: {
      hasRecordedSomething,
    },
  }
}


export function introContinueClicked() {
  return {
    type: INTRO_CONTINUE_CLICKED,
  }
}


export function startRecordingClicked() {
  return {
    type: START_RECORDING_CLICKED,
  }
}

export function stopRecordingClicked() {
  return {
    type: STOP_RECORDING_CLICKED,
  }
}

export function setCountdownValue(countdownValue: number) {
  return {
    type: COUNTDOWN_VALUE_SET,
    payload: {
      countdownValue,
    },
  }
}

export function countdownEnded() {
  return {
    type: COUNTDOWN_ENDED,
  }
}


export function setCurrentSound(currentSoundId: string) {
  return {
    type: CURRENT_SOUND_SET,
    payload: {
      currentSoundId,
    },
  }
}

export function setCurrentModal(currentModalId: string) {
  return {
    type: CURRENT_MODAL_SET,
    payload: {
      currentModalId,
    },
  }
}

export function setCurrentOverlay(currentOverlayId: string) {
  return {
    type: CURRENT_OVERLAY_SET,
    payload: {
      currentOverlayId,
    },
  }
}

export function setMicPermissions(micPermissionsStatus: MicPermissionsStatus) {
  return {
    type: MIC_SET_PERMISSIONS,
    payload: {
      micPermissionsStatus,
    },
  }
}

export function pauseClicked() {
  return {
    type: PAUSE_CLICKED,
  }
}

export function resumeClicked() {
  return {
    type: RESUME_CLICKED,
  }
}


export function nextPageClicked() {
  return {
    type: NEXT_PAGE_CLICKED,
  }
}


export function previousPageClicked() {
  return {
    type: PREVIOUS_PAGE_CLICKED,
  }
}

export function exitClicked() {
  return {
    type: EXIT_CLICKED,
  }
}

export function restartRecordingClicked() {
  return {
    type: RESTART_RECORDING_CLICKED,
  }
}


export function turnInClicked() {
  return {
    type: TURN_IN_CLICKED,
  }
}


export function hearRecordingClicked() {
  return {
    type: HEAR_RECORDING_CLICKED,
  }
}

export function seeBookClicked() {
  return {
    type: SEE_BOOK_CLICKED,
  }
}

export function hearQuestionAgainClicked() {
  return {
    type: HEAR_QUESTION_AGAIN_CLICKED,
  }
}


export function setRecordingURL(recordingURL: string, comp: boolean) {
  return {
    type: RECORDING_URL_SET,
    payload: {
      recordingURL,
      comp,
    },
  }
}


/* stil using these */







export function incrementPage() {
  return {
    type: PAGE_INCREMENT,
  }
}

export function decrementPage() {
  return {
    type: PAGE_DECREMENT,
  }
}




export function startCountdownToStart() {
  return {
    type: RECORDING_COUNTDOWN_TO_START,
  }
}

export function startRecording() {
  return {
    type: RECORDING_START,
  }
}

export function stopRecording() {
  return {
    type: RECORDING_STOP,
  }
}

export function pauseRecording(pauseType: PauseType = PauseTypeOptions.fromPauseButton) {
  return {
    type: RECORDING_PAUSE,
    payload: {
      pauseType,
    }
  }
}

export function resumeRecording() {
  return {
    type: RECORDING_RESUME,
  }
}

export function submitRecording() {
  return {
    type: RECORDING_SUBMIT,
  }
}

export function recordingSubmitted() {
  return {
    type: RECORDING_SUBMITTED,
  }
}

export function restartRecording() {
  return {
    type: RECORDING_RESTART,
  }
}


export function playbackRecording() {
  return {
    type: RECORDING_PLAYBACK,
  }
}


export function bookIntroRecordingEnded() {
  return {
    type: BOOK_INTRO_RECORDING_ENDED,
  }
}

export function clickedPermissionsArrow() {
  return {
    type: PERMISSIONS_ARROW_CLICKED,
  }
}

export function setIsDemo(isDemo) {
  return {
    type: IS_DEMO_SET,
    payload: {
      isDemo,
    },
  }
}


export function setInComp(inComp: boolean) {
  return {
    type: IN_COMP_SET,
    payload: {
      inComp,
    },
  }
}

export function seeCompClicked() {
  return {
    type: SEE_COMP_CLICKED,
  }
}


export function incrementQuestion() {
  return {
    type: QUESTION_INCREMENT,
  }
}

export function decrementQuestion() {
  return {
    type: QUESTION_DECREMENT,
  }
}


export function setQuestionNumber(questionNumber: number) {
  return {
    type: QUESTION_NUMBER_SET,
    payload: {
      questionNumber,
    },
  }
}



const sampleBook = {
  title: "Firefly Night",
  author: 'Dianne Ochiltree',
  numPages: 3, // if you want a shorter book for testing purposes just change this
  coverImage: '/images/dashboard/sample-book-assets/firefly-cover.png',
  pages: {
    1: {
      lines: [
        "The moon is high\nand the stars are bright.",
        "Daddy tells me,\n\"It's a firefly night!\"",
      ],
      img: '/images/dashboard/sample-book-assets/firefly-2.png',
    },
    2: {
      lines: [
        "Fireflies shine.\nAll of them glow.",
        "I race to show Daddy\ntheir dancing light show.",
      ],
      img: '/images/dashboard/sample-book-assets/firefly-4.png',
    },
    3: {
      lines: [
        "I open my jar. They fly away quickly and shine. ",
        "I love catching fireflies, but they are not mine.",
      ],
      img: '/images/dashboard/sample-book-assets/firefly-3.png',
    },
  },

  questions: {
    1: {
      title: "Tell as much as you can about the passage you just read.",
      subtitle: "Be sure to include the beginning, middle and end",
      audioSrc: '/audio/retell-full.mp3',
    },
    2: {
      title: "Tell some more.",
      audioSrc: '/audio/prompts/VB-tell-some-more.mp3',
    },
    3: {
      title: "this shouldn't happen",
      audioSrc: '/audio/prompts/VB-tell-some-more.mp3',
    },

  },

};



const initialState = {
  pageNumber: 0,
  numPages: sampleBook.numPages,
  book: sampleBook,
  questionNumber: 1,
  readerState: ReaderStateOptions.initializing,
  prompt: PromptOptions.awaitingPrompt,
  pauseType: PauseTypeOptions.fromPauseButton,
  hasRecordedSomething: false,
  recorder: new Recorder(),
  recordingURL: null,
  compRecordingURL: null,
  micPermissionsStatus: MicPermissionsStatusOptions.awaiting,
  currentSoundId: 'no-sound',
  currentModalId: 'no-modal',
  currentOverlayId: 'no-overlay',
  showSpinner: false,
  countdownValue: -1,
}




// any way to do this other than writing a custom reducer for each?

// how to use flow here then?


function reducer(state = initialState, action = {}) {
  const { payload, type } = action


  switch (type) {


    case READER_STATE_SET: {
      console.log('SET READER STATE:: ' + payload.readerState)
      return { ...state, readerState: payload.readerState }
    }

    case PAGE_NUMBER_SET: {
      return { ...state, pageNumber: payload.pageNumber }
    }

    case PROMPT_SET: {
      console.log('SET PROMPT: ', payload.prompt)
      return { ...state, prompt: payload.prompt }

    }


    case HAS_RECORDED_SOMETHING_SET: {
      return { ...state, hasRecordedSomething: payload.hasRecordedSomething }
    }

    case CURRENT_SOUND_SET: {
      return { ...state, currentSoundId: payload.currentSoundId }
    }

    case CURRENT_MODAL_SET: {
      return { ...state, currentModalId: payload.currentModalId }
    }

    case CURRENT_OVERLAY_SET: {
      return { ...state, currentOverlayId: payload.currentOverlayId }
    }

    case MIC_SET_PERMISSIONS: {

      switch (payload.micPermissionsStatus) {
        // I don't think I actually need micPermissionStatus here, because it's encapsulated in ReaderStateOptions
        // ^ Is that good or bad...?
        case MicPermissionsStatusOptions.granted: {
          return { ...state, readerState: ReaderStateOptions.playingBookIntro, micPermissionsStatus: payload.micPermissionsStatus }
        }
        case MicPermissionsStatusOptions.awaiting: {
          return { ...state, readerState: ReaderStateOptions.awaitingPermissions, micPermissionsStatus: payload.micPermissionsStatus }
        }
        case MicPermissionsStatusOptions.blocked: {
          return { ...state, readerState: ReaderStateOptions.permissionsBlocked, micPermissionsStatus: payload.micPermissionsStatus }
        }
        default: return state
      }

    }

    case RECORDING_URL_SET: {

      if (payload.comp === true) {
        console.log("Just set compRecordingURL....")
        return { ...state, compRecordingURL: payload.recordingURL}
      } else {
        console.log("Just set recordingURL....")
        return { ...state, recordingURL: payload.recordingURL}
      }
    }

    case SPINNER_SHOW: {
      return { ...state, showSpinner: true }
    }

    case SPINNER_HIDE: {
      return { ...state, showSpinner: false }
    }

    case COUNTDOWN_VALUE_SET: {
      return { ...state, countdownValue: payload.countdownValue}
    }

    // case BOOK_INTRO_RECORDING_ENDED: {
    //   return { ...state, readerState: ReaderStateOptions.awaitingStart }
    // }

    case PAGE_INCREMENT: {
      history.pushState({}, 'Readup', '#/story/demo/page/' + (state.pageNumber+1))
      return { ...state, pageNumber: state.pageNumber + 1}
    }
    case PAGE_DECREMENT: {
      history.pushState({}, 'Readup', '#/story/demo/page/' + (state.pageNumber-1))
      return { ...state, pageNumber: state.pageNumber - 1 }
    }

    case QUESTION_INCREMENT: {
      // TODO add history here.
      return { ...state, questionNumber: state.questionNumber + 1 }
    }

    case QUESTION_DECREMENT: {
      // TODO add history here.
      return { ...state, questionNumber: state.questionNumber - 1 }
    }

    case QUESTION_NUMBER_SET: {
      return { ...state, questionNumber: payload.questionNumber }
    }


    // case RECORDING_COUNTDOWN_TO_START: {
    //   history.pushState({}, 'Readup', '#/story/demo/page/' + (state.pageNumber+1))
    //   return { ...state, readerState: ReaderStateOptions.countdownToStart, pageNumber: 1 }
    // }
    // case RECORDING_START: {
    //   return { ...state, readerState: ReaderStateOptions.inProgress, hasRecordedSomething: true }
    // }
    // case RECORDING_STOP: {
    //   return { ...state, readerState: ReaderStateOptions.done}
    // }
    // case RECORDING_PAUSE: {
    //   return { ...state, readerState: ReaderStateOptions.paused, pauseType: payload.pauseType }
    // }
    // case RECORDING_RESUME: {
    //   return { ...state, readerState: ReaderStateOptions.inProgress }
    // }
    // case RECORDING_SUBMIT: {
    //   return { ...state }
    // }


    case RECORDING_SUBMITTED: {
      if (!state.isDemo) {
        setTimeout(() => {
          window.location.href = "/" // TODO where to redirect?
        }, 5000)
      }
      return { ...state, readerState: ReaderStateOptions.submitted }
    }
    case RECORDING_RESTART: {
      return { ...state, pageNumber: 0, readerState: ReaderStateOptions.inProgress, hasRecordedSomething: false }
    }
    case RECORDING_PLAYBACK: {
      return { ...state, readerState: ReaderStateOptions.doneDisplayingPlayback }
    }


    case PERMISSIONS_ARROW_CLICKED: {
      return state
    }

    case IS_DEMO_SET: {
      return { ...state, isDemo: payload.isDemo }
    }

    case IN_COMP_SET: {
      return { ...state, inComp: payload.inComp }
    }


    default: return state;
  }
}




export default reducer
