// @flow

/* Hi!  How to write FSA-compliant Redux stuff:
 *  1. actions:
 *       <NOUN>_<VERB>, e.g. 'TODO_ADD'
 *  2. action creators:
 *       <verb><Noun>, e.g. addTodo
 */

// TODO REMOVE, put recorder logic in saga
import Recorder from "./recorder";

import {
  ReaderStateOptions,
  SectionOptions,
  ReaderState,
  MicPermissionsStatusOptions,
  MicPermissionsStatus,
  PauseType,
  PauseTypeOptions,
  Prompt,
  PromptOptions
} from "./types";

import { library, fireflyBook } from "../sharedComponents/bookObjects.js";

export const READER_STATE_SET = "READER_STATE_SET";

export const COUNTDOWN_VALUE_SET = "COUNTDOWN_VALUE_SET";
export const COUNTDOWN_ENDED = "COUNTDOWN_ENDED";
export const HAS_RECORDED_SOMETHING_SET = "RECORDED_SOMETHING_SET";

export const INTRO_CONTINUE_CLICKED = "INTRO_CONTINUE_CLICKED";
export const START_RECORDING_CLICKED = "START_RECORDING_CLICKED";
export const STOP_RECORDING_CLICKED = "STOP_RECORDING_CLICKED";
export const PAUSE_CLICKED = "PAUSE_CLICKED";
export const RESUME_CLICKED = "RESUME_CLICKED";
export const NEXT_PAGE_CLICKED = "NEXT_PAGE_CLICKED";

export const NEXT_QUESTION_CLICKED = "NEXT_QUESTION_CLICKED";
export const PREVIOUS_QUESTION_CLICKED = "PREVIOUS_QUESTION_CLICKED";

export const PREVIOUS_PAGE_CLICKED = "PREVIOUS_PAGE_CLICKED";
export const PREVIOUS_WORD_CLICKED = "PREVIOUS_WORD_CLICKED";
export const EXIT_CLICKED = "EXIT_CLICKED";
export const RESTART_RECORDING_CLICKED = "RESTART_RECORDING_CLICKED";
export const TURN_IN_CLICKED = "TURN_IN_CLICKED";
export const HEAR_QUESTION_AGAIN_CLICKED = "HEAR_QUESTION_AGAIN_CLICKED";
export const RECORDING_URL_SET = "RECORDING_URL_SET";

export const FINISH_VIDEO_CLICKED = "FINISH_VIDEO_CLICKED";

export const SEE_BOOK_CLICKED = "SEE_BOOK_CLICKED";
export const HEAR_RECORDING_CLICKED = "HEAR_RECORDING_CLICKED";

export const DEMO_SUBMITTED_LOGOUT_CLICKED = "DEMO_SUBMITTED_LOGOUT_CLICKED";
export const SPINNER_SHOW = "SPINNER_SHOW";
export const SPINNER_HIDE = "SPINNER_HIDE";

export const CURRENT_SOUND_SET = "CURRENT_SOUND_SET";
export const CURRENT_MODAL_SET = "CURRENT_MODAL_SET";
export const CURRENT_OVERLAY_SET = "CURRENT_OVERLAY_SET";

export const MIC_SET_PERMISSIONS = "MIC_SET_PERMISSION";
export const BOOK_INTRO_RECORDING_ENDED = "BOOK_INTRO_RECORDING_ENDED";
export const PAGE_NUMBER_SET = "PAGE_NUMBER_SET";

export const PAGE_INCREMENT = "PAGE_INCREMENT";
export const PAGE_DECREMENT = "PAGE_DECREMENT";

export const RECORDING_COUNTDOWN_TO_START = "RECORDING_COUNTDOWN_TO_START";
export const RECORDING_START = "RECORDING_START";
export const RECORDING_STOP = "RECORDING_STOP";
export const RECORDING_PAUSE = "RECORDING_PAUSE";
export const RECORDING_RESUME = "RECORDING_RESUME";
export const RECORDING_SUBMIT = "RECORDING_SUBMIT";
export const RECORDING_SUBMITTED = "RECORDING_SUBMITTED";
export const RECORDING_RESTART = "RECORDING_RESTART";
export const RECORDING_PLAYBACK = "RECORDING_PLAYBACK";

export const PERMISSIONS_ARROW_CLICKED = "PERMISSIONS_ARROW_CLICKED";
export const IS_DEMO_SET = "IS_DEMO_SET";
export const BOOK_KEY_SET = "BOOK_KEY_SET";
export const IS_WARMUP_SET = "IS_WARMUP_SET";
export const BOOK_SET = "BOOK_SET";
export const STUDENT_NAME_SET = "STUDENT_NAME_SET";

export const IN_COMP_SET = "IN_COMP_SET";
export const IN_SPELLING_SET = "IN_SPELLING_SET";

export const SEE_COMP_CLICKED = "SEE_COMP_CLICKED";

export const QUESTION_INCREMENT = "QUESTION_INCREMENT";
export const QUESTION_DECREMENT = "QUESTION_DECREMENT";
export const QUESTION_NUMBER_SET = "QUESTION_NUMBER_SET";

export const PROMPT_SET = "PROMPT_SET";
export const COMP_PAUSE_CLICKED = "COMP_PAUSE_CLICKED";
export const LAST_QUESTION_EXITED = "LAST_QUESTION_EXITED";
export const VOLUME_INDICATOR_HIDDEN = "VOLUME_INDICATOR_HIDDEN";
export const VOLUME_INDICATOR_SHOWN = "VOLUME_INDICATOR_SHOWN";

export const LIVE_DEMO_SET = "LIVE_DEMO_SET";

export const SPELLING_ANSWER_GIVEN_SET = "SPELLING_ANSWER_GIVEN_SET";
export const NEXT_WORD_CLICKED = "NEXT_WORD_CLICKED";
export const FINAL_SPELLING_QUESTION_ANSWERED =
  "FINAL_SPELLING_QUESTION_ANSWERED";
export const FINAL_COMP_QUESTION_ANSWERED = "FINAL_COMP_QUESTION_ANSWERED";

export const FINAL_WRITTEN_COMP_QUESTION_ANSWERED =
  "FINAL_WRITTEN_COMP_QUESTION_ANSWERED";

export const SECTION_SKIPPED = "SECTION_SKIPPED";
export const IN_ORAL_READING_SET = "IN_ORAL_READING_SET";
export const SKIP_CLICKED = "SKIP_CLICKED";

export const SHOW_SKIP_PROMPT_SET = "SHOW_SKIP_PROMPT_SET";

export const ASSESSMENT_ID_SET = "ASSESSMENT_ID_SET";

export const ASSESSMENT_SUBMITTED_SET = "ASSESSMENT_SUBMITTED_SET";

export const SPELLING_INPUT_SET = "SPELLING_INPUT_SET";
export const AVATAR_CLICKED = "AVATAR_CLICKED";

export const SPELLING_QUESTION_NUMBER_SET = "SPELLING_QUESTION_NUMBER_SET";

export const IN_SILENT_READING_SET = "IN_SILENT_READING_SET";

export const HEAR_INTRO_AGAIN_CLICKED = "HEAR_INTRO_AGAIN_CLICKED";

export const WRITTEN_QUESTION_NUMBER_SET = "WRITTEN_QUESTION_NUMBER_SET";
export const WRITTEN_COMP_INPUT_SET = "WRITTEN_COMP_INPUT_SET";

export const YES_CLICKED = "YES_CLICKED";
export const NO_CLICKED = "NO_CLICKED";

export const SECTION_SET = "SECTION_SET";

export const TEACHER_SIGNATURE_SET = "TEACHER_SIGNATURE_SET";
export const STUDENTS_SET = "STUDENTS_SET";
export const ASSESSMENTS_SET = "ASSESSMENTS_SET";
export const USER_ID_SET = "USER_ID_SET";

export const PLAYING_IMMEDIATE_PROMPT_SET = "PLAYING_IMMEDIATE_PROMPT_SET";

export function setReaderState(readerState: ReaderState) {
  return {
    type: READER_STATE_SET,
    payload: {
      readerState
    }
  };
}

export function setSection(section: Section) {
  return {
    type: SECTION_SET,
    payload: {
      section
    }
  };
}

export function setUserId(userId: number) {
  return {
    type: USER_ID_SET,
    payload: {
      userId
    }
  };
}

export function setPlayingImmediatePrompt(playingImmediatePrompt: boolean) {
  return {
    type: PLAYING_IMMEDIATE_PROMPT_SET,
    payload: {
      playingImmediatePrompt
    }
  };
}

export function setTeacherSignature(teacherSignature: string) {
  return {
    type: TEACHER_SIGNATURE_SET,
    payload: {
      teacherSignature
    }
  };
}
export function setStudents(students: string) {
  return {
    type: STUDENTS_SET,
    payload: {
      students
    }
  };
}

export function setAssessments(assessments: string) {
  return {
    type: ASSESSMENTS_SET,
    payload: {
      assessments
    }
  };
}

export function avatarClicked() {
  return {
    type: AVATAR_CLICKED
  };
}

export function setAssessmentSubmitted(assessmentSubmitted: boolean) {
  return {
    type: ASSESSMENT_SUBMITTED_SET,
    payload: {
      assessmentSubmitted
    }
  };
}

export function setAssessmentID(assessmentID: number) {
  return {
    type: ASSESSMENT_ID_SET,
    payload: {
      assessmentID
    }
  };
}

export function setSpellingInput(spellingInput: string) {
  return {
    type: SPELLING_INPUT_SET,
    payload: {
      spellingInput
    }
  };
}

export function setWrittenCompInput(writtenCompInput: string) {
  return {
    type: WRITTEN_COMP_INPUT_SET,
    payload: {
      writtenCompInput
    }
  };
}

export function setShowSkipPrompt(showSkipPrompt: boolean) {
  return {
    type: SHOW_SKIP_PROMPT_SET,
    payload: {
      showSkipPrompt
    }
  };
}

export function setSpellingAnswerGiven(spellingAnswerGiven: boolean) {
  return {
    type: SPELLING_ANSWER_GIVEN_SET,
    payload: {
      spellingAnswerGiven
    }
  };
}

export function setPageNumber(pageNumber: number) {
  return {
    type: PAGE_NUMBER_SET,
    payload: {
      pageNumber
    }
  };
}

export function setPrompt(prompt: Prompt) {
  return {
    type: PROMPT_SET,
    payload: {
      prompt
    }
  };
}

export function setHasRecordedSomething(hasRecordedSomething: boolean) {
  return {
    type: HAS_RECORDED_SOMETHING_SET,
    payload: {
      hasRecordedSomething
    }
  };
}

export function introContinueClicked() {
  return {
    type: INTRO_CONTINUE_CLICKED
  };
}

export function finishVideoClicked() {
  return {
    type: FINISH_VIDEO_CLICKED
  };
}

export function yesClicked() {
  return {
    type: YES_CLICKED
  };
}

export function noClicked() {
  return {
    type: NO_CLICKED
  };
}

export function startRecordingClicked() {
  return {
    type: START_RECORDING_CLICKED
  };
}

export function stopRecordingClicked() {
  return {
    type: STOP_RECORDING_CLICKED
  };
}

export function finalSpellingQuestionAnswered() {
  return {
    type: FINAL_SPELLING_QUESTION_ANSWERED
  };
}

export function finalCompQuestionAnswered() {
  return {
    type: FINAL_COMP_QUESTION_ANSWERED
  };
}

export function finalWrittenCompQuestionAnswered() {
  return {
    type: FINAL_WRITTEN_COMP_QUESTION_ANSWERED
  };
}

export function setCountdownValue(countdownValue: number) {
  return {
    type: COUNTDOWN_VALUE_SET,
    payload: {
      countdownValue
    }
  };
}

export function countdownEnded() {
  return {
    type: COUNTDOWN_ENDED
  };
}

export function setCurrentSound(currentSoundId: string) {
  return {
    type: CURRENT_SOUND_SET,
    payload: {
      currentSoundId
    }
  };
}

export function setCurrentModal(currentModalId: string) {
  return {
    type: CURRENT_MODAL_SET,
    payload: {
      currentModalId
    }
  };
}

export function setCurrentOverlay(currentOverlayId: string) {
  return {
    type: CURRENT_OVERLAY_SET,
    payload: {
      currentOverlayId
    }
  };
}

export function setMicPermissions(micPermissionsStatus: MicPermissionsStatus) {
  return {
    type: MIC_SET_PERMISSIONS,
    payload: {
      micPermissionsStatus
    }
  };
}

export function pauseClicked() {
  return {
    type: PAUSE_CLICKED
  };
}

export function compPauseClicked() {
  return {
    type: COMP_PAUSE_CLICKED
  };
}

export function resumeClicked() {
  return {
    type: RESUME_CLICKED
  };
}

export function nextPageClicked() {
  return {
    type: NEXT_PAGE_CLICKED
  };
}

export function previousPageClicked() {
  return {
    type: PREVIOUS_PAGE_CLICKED
  };
}

export function previousWordClicked() {
  return {
    type: PREVIOUS_WORD_CLICKED
  };
}

export function nextWordClicked() {
  return {
    type: NEXT_WORD_CLICKED
  };
}

export function nextQuestionClicked() {
  return {
    type: NEXT_QUESTION_CLICKED
  };
}

export function previousQuestionClicked() {
  return {
    type: PREVIOUS_QUESTION_CLICKED
  };
}

export function exitClicked() {
  return {
    type: EXIT_CLICKED
  };
}

export function restartRecordingClicked() {
  return {
    type: RESTART_RECORDING_CLICKED
  };
}

export function turnInClicked() {
  return {
    type: TURN_IN_CLICKED
  };
}

export function hearRecordingClicked() {
  return {
    type: HEAR_RECORDING_CLICKED
  };
}

export function hearIntroAgainClicked() {
  return {
    type: HEAR_INTRO_AGAIN_CLICKED
  };
}

export function seeBookClicked() {
  return {
    type: SEE_BOOK_CLICKED
  };
}

export function hearQuestionAgainClicked() {
  return {
    type: HEAR_QUESTION_AGAIN_CLICKED
  };
}

export function setRecordingURL(recordingURL: string, comp: boolean) {
  return {
    type: RECORDING_URL_SET,
    payload: {
      recordingURL,
      comp
    }
  };
}

export function hideVolumeIndicator() {
  return {
    type: VOLUME_INDICATOR_HIDDEN
  };
}

export function showVolumeIndicator() {
  return {
    type: VOLUME_INDICATOR_SHOWN
  };
}

/* stil using these */

export function incrementPage() {
  return {
    type: PAGE_INCREMENT
  };
}

export function decrementPage() {
  return {
    type: PAGE_DECREMENT
  };
}

export function startCountdownToStart() {
  return {
    type: RECORDING_COUNTDOWN_TO_START
  };
}

export function startRecording() {
  return {
    type: RECORDING_START
  };
}

export function stopRecording() {
  return {
    type: RECORDING_STOP
  };
}

export function pauseRecording(
  pauseType: PauseType = PauseTypeOptions.fromPauseButton
) {
  return {
    type: RECORDING_PAUSE,
    payload: {
      pauseType
    }
  };
}

export function resumeRecording() {
  return {
    type: RECORDING_RESUME
  };
}

export function submitRecording() {
  return {
    type: RECORDING_SUBMIT
  };
}

export function recordingSubmitted() {
  return {
    type: RECORDING_SUBMITTED
  };
}

export function restartRecording() {
  return {
    type: RECORDING_RESTART
  };
}

export function playbackRecording() {
  return {
    type: RECORDING_PLAYBACK
  };
}

export function bookIntroRecordingEnded() {
  return {
    type: BOOK_INTRO_RECORDING_ENDED
  };
}

export function clickedPermissionsArrow() {
  return {
    type: PERMISSIONS_ARROW_CLICKED
  };
}

export function setIsDemo(isDemo) {
  return {
    type: IS_DEMO_SET,
    payload: {
      isDemo
    }
  };
}

export function setIsWarmup(isWarmup) {
  return {
    type: IS_WARMUP_SET,
    payload: {
      isWarmup
    }
  };
}

export function setBookKey(bookKey) {
  return {
    type: BOOK_KEY_SET,
    payload: {
      bookKey
    }
  };
}

export function setStudentName(studentName) {
  return {
    type: STUDENT_NAME_SET,
    payload: {
      studentName
    }
  };
}

export function setBook(bookKey) {
  return {
    type: BOOK_SET,
    payload: {
      bookKey
    }
  };
}

export function setInComp(inComp: boolean) {
  return {
    type: IN_COMP_SET,
    payload: {
      inComp
    }
  };
}

export function setInSpelling(inSpelling: boolean) {
  return {
    type: IN_SPELLING_SET,
    payload: {
      inSpelling
    }
  };
}

export function setInOralReading(inOralReading: boolean) {
  return {
    type: IN_ORAL_READING_SET,
    payload: {
      inOralReading
    }
  };
}

export function setInSilentReading(inSilentReading: boolean) {
  return {
    type: IN_SILENT_READING_SET,
    payload: {
      inSilentReading
    }
  };
}

export function seeCompClicked() {
  return {
    type: SEE_COMP_CLICKED
  };
}

export function incrementQuestion(section: string) {
  return {
    type: QUESTION_INCREMENT,
    payload: {
      section
    }
  };
}

export function decrementQuestion(section: string) {
  return {
    type: QUESTION_DECREMENT,
    payload: {
      section
    }
  };
}

export function setQuestionNumber(questionNumber: number) {
  return {
    type: QUESTION_NUMBER_SET,
    payload: {
      questionNumber
    }
  };
}

export function setSpellingQuestionNumber(spellingQuestionNumber: number) {
  return {
    type: SPELLING_QUESTION_NUMBER_SET,
    payload: {
      spellingQuestionNumber
    }
  };
}

export function setWrittenQuestionNumber(writtenQuestionNumber: number) {
  return {
    type: WRITTEN_QUESTION_NUMBER_SET,
    payload: {
      writtenQuestionNumber
    }
  };
}

export function exitLastQuestion() {
  return {
    type: LAST_QUESTION_EXITED
  };
}

export function setLiveDemo(isLiveDemo: boolean) {
  return {
    type: LIVE_DEMO_SET,
    payload: {
      isLiveDemo
    }
  };
}

export function skipSection() {
  return {
    type: SECTION_SKIPPED
  };
}

export function skipClicked() {
  return {
    type: SKIP_CLICKED
  };
}

export const initialState = {
  pageNumber: 0,
  numPages: fireflyBook.numPages,
  book: fireflyBook,
  questionNumber: 1,
  readerState: ReaderStateOptions.initializing,
  prompt: PromptOptions.awaitingPrompt,
  pauseType: PauseTypeOptions.fromPauseButton,
  hasRecordedSomething: false,
  recorder: new Recorder(),
  recordingURL: null,
  compRecordingURL: null,
  micPermissionsStatus: MicPermissionsStatusOptions.awaiting,
  currentSoundId: "no-sound",
  currentModalId: "no-modal",
  currentOverlayId: "no-overlay",
  showSpinner: false,
  countdownValue: -1,
  showVolumeIndicator: true,
  showSkipPrompt: false,
  inComp: false,
  inSpelling: false,
  inOralReading: true,
  isLiveDemo: false,
  spellingAnswerGiven: false,
  spellingQuestionNumber: 1,
  writtenQuestionNumber: 1,
  assessmentID: null,
  assessmentSubmitted: false,
  spellingInput: "",
  writtenCompInput: "",
  hasLoggedIn: false,
  studentName: "Demo Student",
  inSilentReading: false,
  isWarmup: true,
  section: SectionOptions.initializing,
  teacherSignature: null,
  students: [],
  assessments: [],
  userId: null,
  playingImmediatePrompt: false
};

// any way to do this other than writing a custom reducer for each?

// how to use flow here then?

function reducer(state = initialState, action = {}) {
  const { payload, type } = action;

  switch (type) {
    case READER_STATE_SET: {
      console.log("SET READER STATE: " + payload.readerState);
      return { ...state, readerState: payload.readerState };
    }

    case SECTION_SET: {
      console.log("SET SECTION: " + payload.section);
      return { ...state, section: payload.section };
    }

    case USER_ID_SET: {
      return { ...state, userId: payload.userId };
    }

    case PLAYING_IMMEDIATE_PROMPT_SET: {
      return {
        ...state,
        playingImmediatePrompt: payload.playingImmediatePrompt
      };
    }

    case ASSESSMENT_SUBMITTED_SET: {
      console.log("SET ASSESSMENT SUBMITTED: " + payload.assessmentSubmitted);
      return { ...state, assessmentSubmitted: payload.assessmentSubmitted };
    }

    case ASSESSMENT_ID_SET: {
      console.log("SET ASSESSMENT ID: " + payload.assessmentID);
      return { ...state, assessmentID: payload.assessmentID };
    }

    case PAGE_NUMBER_SET: {
      return { ...state, pageNumber: payload.pageNumber };
    }

    case PROMPT_SET: {
      console.log("SET PROMPT: ", payload.prompt);
      return { ...state, prompt: payload.prompt };
    }

    case TEACHER_SIGNATURE_SET: {
      return { ...state, teacherSignature: payload.teacherSignature };
    }

    case STUDENTS_SET: {
      return { ...state, students: payload.students };
    }

    case ASSESSMENTS_SET: {
      return { ...state, assessments: payload.assessments };
    }

    case SPELLING_ANSWER_GIVEN_SET: {
      return { ...state, spellingAnswerGiven: payload.spellingAnswerGiven };
    }

    case HAS_RECORDED_SOMETHING_SET: {
      return { ...state, hasRecordedSomething: payload.hasRecordedSomething };
    }

    case CURRENT_SOUND_SET: {
      return { ...state, currentSoundId: payload.currentSoundId };
    }

    case CURRENT_MODAL_SET: {
      return { ...state, currentModalId: payload.currentModalId };
    }

    case CURRENT_OVERLAY_SET: {
      return { ...state, currentOverlayId: payload.currentOverlayId };
    }

    case MIC_SET_PERMISSIONS: {
      switch (payload.micPermissionsStatus) {
        // I don't think I actually need micPermissionStatus here, because it's encapsulated in ReaderStateOptions
        // ^ Is that good or bad...?
        case MicPermissionsStatusOptions.granted: {
          return {
            ...state,
            readerState: ReaderStateOptions.playingBookIntro,
            micPermissionsStatus: payload.micPermissionsStatus
          };
        }
        case MicPermissionsStatusOptions.awaiting: {
          return {
            ...state,
            readerState: ReaderStateOptions.awaitingPermissions,
            micPermissionsStatus: payload.micPermissionsStatus
          };
        }
        case MicPermissionsStatusOptions.blocked: {
          return {
            ...state,
            readerState: ReaderStateOptions.permissionsBlocked,
            micPermissionsStatus: payload.micPermissionsStatus
          };
        }
        default:
          return state;
      }
    }

    case RECORDING_URL_SET: {
      if (payload.comp === true) {
        console.log("Just set compRecordingURL....");
        return { ...state, compRecordingURL: payload.recordingURL };
      } else {
        console.log("Just set recordingURL....");
        return { ...state, recordingURL: payload.recordingURL };
      }
    }

    case SPINNER_SHOW: {
      return { ...state, showSpinner: true };
    }

    case SPINNER_HIDE: {
      return { ...state, showSpinner: false };
    }

    case VOLUME_INDICATOR_HIDDEN: {
      return { ...state, showVolumeIndicator: false };
    }

    case VOLUME_INDICATOR_SHOWN: {
      return { ...state, showVolumeIndicator: true };
    }

    case COUNTDOWN_VALUE_SET: {
      return { ...state, countdownValue: payload.countdownValue };
    }

    // case BOOK_INTRO_RECORDING_ENDED: {
    //   return { ...state, readerState: ReaderStateOptions.awaitingStart }
    // }

    case PAGE_INCREMENT: {
      history.pushState(
        {},
        "Readup",
        "#/story/demo/page/" + (state.pageNumber + 1)
      );
      return { ...state, pageNumber: state.pageNumber + 1 };
    }
    case PAGE_DECREMENT: {
      history.pushState(
        {},
        "Readup",
        "#/story/demo/page/" + (state.pageNumber - 1)
      );
      return { ...state, pageNumber: state.pageNumber - 1 };
    }

    case QUESTION_INCREMENT: {
      // TODO add history here.
      if (payload.section === "comp") {
        return { ...state, questionNumber: state.questionNumber + 1 };
      }

      if (payload.section === "spelling") {
        return {
          ...state,
          spellingQuestionNumber: state.spellingQuestionNumber + 1
        };
      }

      if (payload.section === "writtenComp") {
        return {
          ...state,
          writtenQuestionNumber: state.writtenQuestionNumber + 1
        };
      }
    }

    case QUESTION_DECREMENT: {
      // TODO add history here.

      if (payload.section === "comp") {
        return { ...state, questionNumber: state.questionNumber - 1 };
      }

      if (payload.section === "spelling") {
        return {
          ...state,
          spellingQuestionNumber: state.spellingQuestionNumber - 1
        };
      }

      if (payload.section === "writtenComp") {
        return {
          ...state,
          writtenQuestionNumber: state.writtenQuestionNumber - 1
        };
      }
    }

    case QUESTION_NUMBER_SET: {
      return { ...state, questionNumber: payload.questionNumber };
    }

    case SPELLING_QUESTION_NUMBER_SET: {
      return {
        ...state,
        spellingQuestionNumber: payload.spellingQuestionNumber
      };
    }

    case WRITTEN_QUESTION_NUMBER_SET: {
      return {
        ...state,
        writtenQuestionNumber: payload.writtenQuestionNumber
      };
    }

    case SHOW_SKIP_PROMPT_SET: {
      return { ...state, showSkipPrompt: payload.showSkipPrompt };
    }

    case SPELLING_INPUT_SET: {
      return { ...state, spellingInput: payload.spellingInput };
    }

    case WRITTEN_COMP_INPUT_SET: {
      return { ...state, writtenCompInput: payload.writtenCompInput };
    }

    case AVATAR_CLICKED: {
      return { ...state, hasLoggedIn: true };
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
          window.location.href = "/"; // TODO where to redirect?
        }, 5000);
      }
      return { ...state, readerState: ReaderStateOptions.submitted };
    }
    case RECORDING_RESTART: {
      return {
        ...state,
        pageNumber: 0,
        readerState: ReaderStateOptions.inProgress,
        hasRecordedSomething: false
      };
    }
    case RECORDING_PLAYBACK: {
      return {
        ...state,
        readerState: ReaderStateOptions.doneDisplayingPlayback
      };
    }

    case PERMISSIONS_ARROW_CLICKED: {
      return state;
    }

    case IS_DEMO_SET: {
      return { ...state, isDemo: payload.isDemo };
    }

    case IS_WARMUP_SET: {
      console.log("Setting the warmup here...");
      return { ...state, isWarmup: payload.isWarmup };
    }

    case BOOK_KEY_SET: {
      return { ...state, bookKey: payload.bookKey };
    }

    case STUDENT_NAME_SET: {
      return { ...state, studentName: payload.studentName };
    }

    case BOOK_SET: {
      const book = library[payload.bookKey];
      console.log("I just set the book!: ", book);
      console.log("heres bookKey: ", payload.bookKey);

      return { ...state, book: book };
    }

    case IN_COMP_SET: {
      return { ...state, inComp: payload.inComp };
    }

    case IN_SPELLING_SET: {
      return { ...state, inSpelling: payload.inSpelling };
    }

    case IN_ORAL_READING_SET: {
      return { ...state, inOralReading: payload.inOralReading };
    }

    case IN_SILENT_READING_SET: {
      return { ...state, inSilentReading: payload.inSilentReading };
    }

    case LIVE_DEMO_SET: {
      return { ...state, isLiveDemo: payload.isLiveDemo };
    }

    default:
      return state;
  }
}

export default reducer;
