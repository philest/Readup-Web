// @flow

/* Hi!  How to write FSA-compliant Redux stuff:
 *  1. actions:
 *       <NOUN>_<VERB>, e.g. 'TODO_ADD'
 *  2. action creators:
 *       <verb><Noun>, e.g. addTodo
 */


// TODO REMOVE, put recorder logic in saga
import Recorder from './recorder' 

import { ReaderStateOptions, ReaderState, MicPermissionsStatusOptions, MicPermissionsStatus } from './types'


const DEV_DISABLE_VOICE_INSTRUCTIONS = false


const MIC_SET_PERMISSIONS = 'MIC_SET_PERMISSION'

const PAGE_INCREMENT = 'PAGE_INCREMENT'
const PAGE_DECREMENT = 'PAGE_DECREMENT'

const RECORDING_COUNTDOWN_TO_START = 'RECORDING_COUNTDOWN_TO_START'
const RECORDING_START = 'RECORDING_START'
const RECORDING_STOP = 'RECORDING_STOP'
const RECORDING_PAUSE = 'RECORDING_PAUSE'
const RECORDING_RESUME = 'RECORDING_RESUME'
const RECORDING_SUBMIT = 'RECORDING_SUBMIT'
const RECORDING_RESTART = 'RECORDING_RESTART'
const RECORDING_PLAYBACK = 'RECORDING_PLAYBACK'



const PERMIMSSIONS_ARROW_CLICKED = 'PERMIMSSIONS_ARROW_CLICKED'


export function setMicPermissions(micPermissionsStatus: MicPermissionsStatus) {
  return {
    type: MIC_SET_PERMISSIONS,
    payload: {
      micPermissionsStatus,
    },
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

export function pauseRecording() {
  return {
    type: RECORDING_PAUSE,
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


export function clickedPermissionsArrow() {
  return {
    type: PERMIMSSIONS_ARROW_CLICKED,
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
  recorder: new Recorder(),
  micPermissionsStatus: MicPermissionsStatusOptions.awaiting,
}


// Should move this to a saga

function playSound(file) {
  if (DEV_DISABLE_VOICE_INSTRUCTIONS) return

  var audio = new Audio(file);
  audio.play();
}


// any way to do this other than writing a custom reducer for each?

// how to use flow here then?


function reducer(state = initialState, action = {}) {
  const { payload, type } = action
  switch (type) {

    case MIC_SET_PERMISSIONS: {

      switch (payload.micPermissionsStatus) {
        // I don't think I actually need micPermissionStatus here, because it's encapsulated in ReaderStateOptions
        // ^ Is that good or bad...?
        case MicPermissionsStatusOptions.granted: {
          state.recorder.initialize() // do in a saga
          playSound('/audio/book_intro.m4a')
          return { ...state, readerState: ReaderStateOptions.awaitingStart, micPermissionsStatus: payload.micPermissionsStatus }
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


    case PAGE_INCREMENT: {
      return { ...state, pageNumber: state.pageNumber + 1}
    }
    case PAGE_DECREMENT: {
      return { ...state, pageNumber: state.pageNumber - 1}
    }
    case RECORDING_COUNTDOWN_TO_START: {
      return { ...state, readerState: ReaderStateOptions.countdownToStart, pageNumber: 1 }
    }
    case RECORDING_START: {
      state.recorder.startRecording()
      return { ...state, readerState: ReaderStateOptions.inProgress, pageNumber: 1 }
    }
    case RECORDING_STOP: {
      state.recorder.stopRecording()
      playSound('/audio/done.m4a')
      return { ...state, readerState: ReaderStateOptions.done}
    }
    case RECORDING_PAUSE: {
      state.recorder.pauseRecording()
      playSound('/audio/paused.m4a')
      return { ...state, readerState: ReaderStateOptions.paused }
    }
    case RECORDING_RESUME: {
      state.recorder.resumeRecording()
      return { ...state, readerState: ReaderStateOptions.inProgress }
    }
    case RECORDING_SUBMIT: {
      setTimeout(() => {
        window.location.href = "/" // TODO where to redirect?
      }, 5000)
      return { ...state, readerState: ReaderStateOptions.submitted }
    }
    case RECORDING_RESTART: {
      state.recorder.reset()
      return { ...state, pageNumber: 0, readerState: ReaderStateOptions.inProgress }
    }
    case RECORDING_PLAYBACK: {
      return { ...state, readerState: ReaderStateOptions.doneDisplayingPlayback }
    }


    case PERMIMSSIONS_ARROW_CLICKED: {
      playSound('/audio/click_allow_button.m4a')
    }

    default: return state;
  }
}




export default reducer
