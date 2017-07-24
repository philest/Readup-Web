// @flow

/* Hi!  How to write FSA-compliant Redux stuff:
 *  1. actions:
 *       <NOUN>_<VERB>, e.g. 'TODO_ADD'
 *  2. action creators:
 *       <verb><Noun>, e.g. addTodo
 */


// TODO REMOVE, put recorder logic in saga
import Recorder from './recorder' 

import { ReaderStateOptions, ReaderState, MicPermissionsStatusOptions, MicPermissionsStatus, PauseType, PauseTypeOptions } from './types'


export const READER_STATE_SET = 'READER_STATE_SET'

export const COUNTDOWN_ENDED = 'COUNTDOWN_ENDED'
export const HAS_RECORDED_SOMETHING_SET = 'RECORDED_SOMETHING_SET'


export const START_RECORDING_CLICKED = 'CLICK_START_READING'
export const STOP_RECORDING_CLICKED = 'CLICK_STOP_RECORDING'
export const PAUSE_CLICKED = 'PAUSE_CLICKED'
export const RESUME_CLICKED = 'RESUME_CLICKED'
export const NEXT_PAGE_CLICKED = 'NEXT_PAGE_CLICKED'
export const PREVIOUS_PAGE_CLICKED = 'PREVIOUS_PAGE_CLICKED'
export const RESTART_RECORDING_CLICKED = 'RESTART_RECORDING_CLICKED'
export const TURN_IN_CLICKED = 'TURN_IN_CLICKED'
export const HEAR_RECORDING_CLICKED = 'HEAR_RECORDING_CLICKED'



export const CURRENT_SOUND_SET = 'CURRENT_SOUND_SET'
export const CURRENT_MODAL_SET = 'CURRENT_SOUND_SET'

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


export function setReaderState(readerState: ReaderState) {
  return {
    type: READER_STATE_SET,
    payload: {
      readerState,
    }
  }
}

export function setPageNumber(pageNumber: number) {
  return {
    type: PAGE_NUMBER_SET,
    payload: {
      pageNumber,
    }
  }
}

export function setHasRecordedSomething(hasRecordedSomething: bool) {
  return {
    type: HAS_RECORDED_SOMETHING_SET,
    payload: {
      hasRecordedSomething,
    }
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
    }
  }
}

export function setCurrentModal(currentModalId: string) {
  return {
    type: CURRENT_MODAL_SET,
    payload: {
      currentModalId,
    }
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
    type: previousPageClicked,
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
    }
  }
}


const sampleBook = {
  title: "Cezar Chavez",
  author: "Ginger Wordsworth",
  s3Key: 'rocket',
  description: "Mom gets to come along on a space adventure",
  numPages: 2,
  coverImage: 'https://marketplace.canva.com/MAB___U-clw/1/0/thumbnail_large/canva-yellow-lemon-children-book-cover-MAB___U-clw.jpg',
  pages: {
    1: {
      lines: [
          "This is the first line of the first page.",
          "This is the second line of the first page."
      ],
      img: 'http://cdn.wonderfulengineering.com/wp-content/uploads/2014/03/high-resolution-wallpapers-1-610x381.jpg',
    },
    2: {
      lines: [
        "This is the first line of the second page.",
        "This is the second line of the second page."
      ],
      img: 'http://mediad.publicbroadcasting.net/p/shared/npr/201405/306846592.jpg',
    },
    3: {
      lines: [
        "This is the first line of the third page.",
        "This is the second line of the third page."
      ],
      img: 'http://cdn.wonderfulengineering.com/wp-content/uploads/2014/03/high-resolution-wallpapers-3-610x457.jpg',
    },
    4: {
      lines: [
        "This is the first line of the fourth page.",
        "This is the second line of the fourth page."
      ],
      img: 'http://cdn.wonderfulengineering.com/wp-content/uploads/2014/03/high-resolution-wallpapers-5-610x343.jpg',
    },
    5: {
      lines: [
        "This is the first line of the fifth page.",
        "The end."
      ],
      img: 'http://cdn.wonderfulengineering.com/wp-content/uploads/2014/03/high-resolution-wallpapers-6-610x381.jpg',
    },
  },
};



const initialState = {
  pageNumber: 0,
  book: sampleBook,
  readerState:  ReaderStateOptions.initializing,
  pauseType: PauseTypeOptions.fromPauseButton,
  hasRecordedSomething: false,
  recorder: new Recorder(),
  micPermissionsStatus: MicPermissionsStatusOptions.awaiting,
  currentSoundId: null,
  currentModalId: null,
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

    case HAS_RECORDED_SOMETHING_SET: {
      return { ...state, hasRecordedSomething: payload.hasRecordedSomething }
    }

    case CURRENT_SOUND_SET: {
      return { ...state, currentSoundId: payload.currentSoundId }
    }

    case CURRENT_MODAL_SET: {
      return { ...state, currentModalId: payload.currentModalId }
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

    // case BOOK_INTRO_RECORDING_ENDED: {
    //   return { ...state, readerState: ReaderStateOptions.awaitingStart }
    // }

    case PAGE_INCREMENT: {
      history.pushState({}, 'Readup', '#/story/demo/page/' + (state.pageNumber+1))
      return { ...state, pageNumber: state.pageNumber + 1}
    }
    case PAGE_DECREMENT: {
      history.pushState({}, 'Readup', '#/story/demo/page/' + (state.pageNumber-1))
      return { ...state, pageNumber: state.pageNumber - 1}
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

    default: return state;
  }
}




export default reducer
