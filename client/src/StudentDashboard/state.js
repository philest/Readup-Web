// @flow

/* Hi!  How to write FSA-compliant Redux stuff:
 *  1. actions:
 *       <NOUN>_<VERB>, e.g. 'TODO_ADD'
 *  2. action creators:
 *       <verb><Noun>, e.g. addTodo
 */


// TODO REMOVE, put recorder logic in saga
import Recorder from './recorder' 



const PAGE_INCREMENT = 'PAGE_INCREMENT'
const PAGE_DECREMENT = 'PAGE_DECREMENT'


const RECORDING_START = 'RECORDING_START'
const RECORDING_STOP = 'RECORDING_STOP'
const RECORDING_PAUSE = 'RECORDING_PAUSE'
const RECORDING_RESUME = 'RECORDING_RESUME'
const RECORDING_SUBMIT = 'RECORDING_SUBMIT'
const RECORDING_RESTART = 'RECORDING_RESTART'

const RECORDING_PLAYBACK = 'RECORDING_PLAYBACK'


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




export const MIC_SET_PERMISSION = 'MIC_SET_PERMISSION'

export function setMicPermission(micEnabled: false) {
  return {
    type: MIC_SET_PERMISSION,
    payload: {
      micEnabled,
    },
  }
}




const ReaderStateTypes = {
  awaitingPermissions: 'READER_STATE_AWAITING_PERMISSIONS',
  awaitingStart: 'READER_STATE_AWAITING_START',
  inProgress: 'READER_STATE_IN_PROGRESS',
  paused: 'READER_STATE_PAUSED',
  done: 'READER_STATE_DONE',
  doneDisplayingPlayback: 'READER_STATE_PLAYBACK',
  submitted: 'READER_STATE_SUBMITTED',
}

const initialState = {
  pageNumber: 0,
  book: sampleBook,
  readerState:  ReaderStateTypes.awaitingStart,
  recorder: new Recorder(),
}


// any way to do this other than writing a custom reducer for each?

// how to use flow here then?


function reducer(state = initialState, action = {}) {
  const { payload, type } = action
  switch (type) {

    case MIC_SET_PERMISSION: {
      return { ...state, micEnabled: payload.micEnabled }
    }


    case PAGE_INCREMENT: {
      console.log('2state: ' + JSON.stringify(state))
      return { ...state, pageNumber: state.pageNumber + 1}
    }
    case PAGE_DECREMENT: {
      return { ...state, pageNumber: state.pageNumber - 1}
    }

    case RECORDING_START: {
      state.recorder.startRecording()
      console.log('1state: ' + JSON.stringify(state))
      return { ...state, readerState: ReaderStateTypes.inProgress, pageNumber: 1 }
    }
    case RECORDING_STOP: {
      state.recorder.stopRecording()
      return { ...state, readerState: ReaderStateTypes.done}
    }
    case RECORDING_PAUSE: {
      state.recorder.pauseRecording()
      return { ...state, readerState: ReaderStateTypes.paused }
    }
    case RECORDING_RESUME: {
      state.recorder.resumeRecording()
      return { ...state, readerState: ReaderStateTypes.inProgress }
    }
    case RECORDING_SUBMIT: {
      setTimeout(() => {
        window.location.href = "/" // TODO where to redirect?
      }, 5000)
      return { ...state, readerState: ReaderStateTypes.submitted }
    }
    case RECORDING_RESTART: {
      state.recorder.reset()
      return { ...state, pageNumber: 0, readerState: ReaderStateTypes.inProgress }
    }
    case RECORDING_PLAYBACK: {
      return { ...state, readerState: ReaderStateTypes.doneDisplayingPlayback }
    }

    default: return state;
  }
}




export default reducer
