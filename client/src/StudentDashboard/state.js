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
  ReaderState,
  MicPermissionsStatusOptions,
  MicPermissionsStatus,
  PauseType,
  PauseTypeOptions,
  Prompt,
  PromptOptions
} from "./types";
import {
  nickMarkup,
  step4Markup,
  step5Markup,
  step6Markup,
  step7Markup,
  step8Markup,
  step9Markup,
  step10Markup,
  step11Markup,
  step12Markup
} from "../sharedComponents/markupObjects";
import { sampleWithMSV } from "../sharedComponents/sampleWithMSV";

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

export function setReaderState(readerState: ReaderState) {
  return {
    type: READER_STATE_SET,
    payload: {
      readerState
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

export const fireflyBook = {
  title: "Firefly Night",
  author: "Dianne Ochiltree",
  bookKey: "demo",
  numPages: 3, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/sample-book-assets/firefly-cover.png",
  introAudioSrc: "/audio/VB/VB-book-intro.mp3",
  pages: {
    1: {
      lines: [
        "The moon is high\nand the stars are bright.",
        'Daddy tells me,\n"It\'s a firefly night!"'
      ],
      img: "/images/dashboard/sample-book-assets/firefly-2.png"
    },
    2: {
      lines: [
        "Fireflies shine.\nAll of them glow.",
        "I race to show Daddy\ntheir dancing light show."
      ],
      img: "/images/dashboard/sample-book-assets/firefly-4.png"
    },
    3: {
      lines: [
        "I open my jar. They fly away quickly and shine. ",
        "I love catching fireflies, but they are not mine."
      ],
      img: "/images/dashboard/sample-book-assets/firefly-3.png"
    }
  },
  numSections: 3,
  sections: {
    1: "Retell",
    2: "Within the Text",
    3: "Beyond and About the Text"
  },
  numQuestions: 3,
  numOralReadingQuestions: 3,
  questions: {
    1: {
      title: "Tell as much as you can about the passage you just read.",
      subtitle: "Be sure to include the beginning, middle and end",
      audioSrc: "/audio/VB/VB-retell-full.mp3",
      rubric: {
        3: "Response shows excellent understanding of Firefly Night. Includes all major events of plot in sequence, and shows insight into the girl's actions. Uses important details to enrich the retelling.",
        2: "Response shows good understanding of Firefly Night. Includes major events of plot in sequence. Describes the girl's actions and character, and uses some details to support the retelling.",
        1: "Response shows partial understanding of Firefly Night. Includes one major event, but doesn't discuss others in-depth. Mentions main characters, but omits some details. Could use more focus on other parts of the story, but a good start.",
        0: "Response does not indicate understanding of Firefly Night. Includes only a part of a major event, and mentions main characters in a limited way. Facts stated are not in sequence, and important ones are left out."
      },
      points: 3,
      section: 1
    },
    2: {
      title: "Why did the girl and her dad go outside?",
      audioSrc: "/audio/VB/firefly/why-did-outside.mp3",
      points: 1,
      section: 2,
      rubric: {
        1: "Response shows partial understanding of Firefly Night. Includes one major event, but doesn't discuss others in-depth. Mentions main characters, but omits some details. Could use more focus on other parts of the story, but a good start.",
        0: "Response does not indicate understanding of Firefly Night. Includes only a part of a major event, and mentions main characters in a limited way. Facts stated are not in sequence, and important ones are left out."
      }
    },
    3: {
      title: "Why do you think the girl chose to let the fireflies go?",
      audioSrc: "/audio/VB/firefly/why-chose.mp3",
      points: 2,
      section: 3,
      rubric: {
        1: "Response shows partial understanding of Firefly Night. Includes one major event, but doesn't discuss others in-depth. Mentions main characters, but omits some details. Could use more focus on other parts of the story, but a good start.",
        0: "Response does not indicate understanding of Firefly Night. Includes only a part of a major event, and mentions main characters in a limited way. Facts stated are not in sequence, and important ones are left out."
      }
    }
  },

  spellingObj: group1SpellingObj,
  numSpellingQuestions: 15
};

export const group1SpellingObj = {
  numWords: 15,
  words: [
    "pest",
    "chip",
    "sand",
    "lump",
    "shop",
    "plum",
    "club",
    "wish",
    "ramp",
    "drip",
    "smog",
    "bath",
    "rent",
    "trot",
    "shed"
  ],
  responses: [],
  numSections: 3,
  sections: {
    1: {
      title: "Short-Vowel Sound",
      statusArr: [
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true
      ]
    },
    2: {
      title: "Initial Blend/Digraph",
      statusArr: [
        "NO_VALUE",
        true,
        "NO_VALUE",
        "NO_VALUE",
        true,
        true,
        true,
        "NO_VALUE",
        "NO_VALUE",
        true,
        true,
        "NO_VALUE",
        "NO_VALUE",
        true,
        true
      ]
    },
    3: {
      title: "Final Blend/Digraph",
      statusArr: [
        true,
        "NO_VALUE",
        true,
        true,
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        true,
        true,
        "NO_VALUE",
        "NO_VALUE",
        true,
        true,
        "NO_VALUE",
        "NO_VALUE"
      ]
    }
  }
};

export const group2SpellingObj = {
  numWords: 15,
  words: [
    "blame",
    "bark",
    "prune",
    "born",
    "train",
    "smoke",
    "slime",
    "firm",
    "boast",
    "chase",
    "road",
    "hurt",
    "feed",
    "short",
    "bean"
  ],
  responses: [],
  numSections: 3,
  sections: {
    1: {
      title: "-V-C-e",
      statusArr: [
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        "NO_VALUE",
        true,
        true,
        "NO_VALUE",
        "NO_VALUE",
        true,
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE"
      ]
    },
    2: {
      title: "Long-Vowel Pattern",
      statusArr: [
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        true,
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        true
      ]
    },
    3: {
      title: "R-controlled Vowel",
      statusArr: [
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        true,
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        "NO_VALUE"
      ]
    }
  }
};

export const group3SpellingObj = {
  numWords: 15,
  words: [
    "skirt",
    "charm",
    "coach",
    "barn",
    "juice",
    "first",
    "saint",
    "curl",
    "sweet",
    "steam",
    "shout",
    "roof",
    "string",
    "howl",
    "badge",
    "coin",
    "catch",
    "yawn",
    "scratch",
    "block"
  ],
  responses: [],
  numSections: 4,
  sections: {
    1: {
      title: "R-Controlled Vowel",
      statusArr: [
        true,
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE"
      ]
    },
    2: {
      title: "Long-Vowel Pattern",
      statusArr: [
        "NO_VALUE",
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        true,
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE"
      ]
    },
    3: {
      title: "Vowel Digraph/Diphthong",
      statusArr: [
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        true,
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        "NO_VALUE"
      ]
    },
    4: {
      title: "Complex Blend",
      statusArr: [
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        "NO_VALUE",
        true,
        true
      ]
    }
  }
};

export const endings = [
  true,
  true,
  true,
  true,
  "NO_VALUE",
  true,
  "NO_VALUE",
  true,
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE"
];

export const doubling = [
  "NO_VALUE",
  "NO_VALUE",
  true,
  "NO_VALUE",
  true,
  "NO_VALUE",
  true,
  "NO_VALUE",
  "NO_VALUE",
  true,
  "NO_VALUE",
  true,
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE"
];

export const long = [
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  true,
  "NO_VALUE",
  true,
  "NO_VALUE",
  true,
  "NO_VALUE",
  true,
  "NO_VALUE",
  true,
  "NO_VALUE"
];

export const rControlled = [
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  true,
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  "NO_VALUE",
  true,
  "NO_VALUE",
  true,
  "NO_VALUE",
  true,
  "NO_VALUE",
  true
];

export const words = [
  "shaking",
  "bagged",
  "batter",
  "running",
  "bitter",
  "hiking",
  "tennis",
  "gripped",
  "warning",
  "dinner",
  "retain",
  "happen",
  "explode",
  "disturb",
  "review",
  "survive",
  "explain",
  "return",
  "complain",
  "boring"
];

export var group4SpellingObj = {
  numWords: 20,
  words: words,
  numSections: 4,
  sections: {
    1: {
      title: "-ed/ing Endings",
      statusArr: endings
    },
    2: {
      title: "Doubling at Syllable Juncture",
      statusArr: doubling
    },
    3: {
      title: "Long-Vowel Two-syllable Words",
      statusArr: long
    },
    4: {
      title: "R-Controlled Two-Syllable Words",
      statusArr: rControlled
    }
  }
};

export const step4 = {
  title: "Upside Down",
  author: "Stefan Olson",
  bookKey: "step",
  brand: "STEP",
  stepLevel: 4,
  fpLevel: "E",
  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/step/step-cover.jpg",
  introAudioSrc: "/audio/peter-intro-short.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numQuestions: 6,
  numOralReadingQuestions: 6,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title: "Where is Peter playing upside down?",
      audioSrc: "/audio/step/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "What are some things Peter sees upside down?",
      audioSrc: "/audio/step/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "Why is Peter looking at things upside down?",
      audioSrc: "/audio/step/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title: "Who comes to visit Peter?",
      audioSrc: "/audio/step/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    5: {
      title: 'Why does Peter say, "Will her hat fall off?"',
      audioSrc: "/audio/step/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    6: {
      title: "Why does Peter ask Jill to play upside down with him?",
      audioSrc: "/audio/step/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: group1SpellingObj,
  numSpellingQuestions: 15
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step5 = {
  title: "Saturday Shopping",
  author: "Stefan Olson",
  bookKey: "step5",
  brand: "STEP",
  stepLevel: 5,
  fpLevel: "G",
  markup: step5Markup,
  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/step5/rufus-cover.jpg",
  introAudioSrc: "/audio/ruffy-intro-new.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numQuestions: 6,
  numOralReadingQuestions: 6,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title: "When does Ruffy bark in the car?",
      audioSrc: "/audio/step5/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "What food does the boy in the story really want to buy?",
      audioSrc: "/audio/step5/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "Why does Ruffy run into the store?",
      audioSrc: "/audio/step5/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title: "Why does the boy think that he and Ruffy are in big trouble?",
      audioSrc: "/audio/step5/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    5: {
      title: "Why doesn't the store manager get mad? How do you know?",
      audioSrc: "/audio/step5/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    6: {
      title: "Why does the family think Ruffy is a good dog?",
      audioSrc: "/audio/step5/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: group1SpellingObj,
  numSpellingQuestions: 15
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step6 = {
  title: "Comedy Garage",
  author: "Jane Richards",
  bookKey: "step6",
  brand: "STEP",
  stepLevel: 6,
  fpLevel: "I",
  markup: step6Markup,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/step6/step6-cover.jpg",
  introAudioSrc: "/audio/ruffy-intro-new.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numOralReadingQuestions: 4,
  numSilentReadingQuestions: 4,
  numQuestions: 8,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title:
        "What do the kids in the story have to do to get ready for the comedy show?",
      audioSrc: "/audio/step6/comp/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "Why do the children put Mittens upstairs?",
      audioSrc: "/audio/step6/comp/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "What do Max and Linda do at the show?",
      audioSrc: "/audio/step6/comp/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title: "Why do the people think the show is funny?",
      audioSrc: "/audio/step6/comp/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    5: {
      title: "What does Zina do at the show?",
      audioSrc: "/audio/step6/comp/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    6: {
      title:
        "Why is the audience surprised when the cat walks across the screen?",
      audioSrc: "/audio/step6/comp/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },
    7: {
      title: "Why do the children want to put on another show the next week?",
      audioSrc: "/audio/step6/comp/7.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },

    8: {
      title: "Why do the children promise to let Mittens be in the next show?",
      audioSrc: "/audio/step6/comp/8.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: group1SpellingObj,
  numSpellingQuestions: 15
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step7 = {
  title: "My Friend Kendra",
  author: "Stefan Olson",
  bookKey: "step6",
  brand: "STEP",
  stepLevel: 7,
  fpLevel: "I",
  markup: step7Markup,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/step7/cover.jpg",
  introAudioSrc: "/audio/ruffy-intro-new.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numOralReadingQuestions: 4,
  numSilentReadingQuestions: 4,
  numQuestions: 8,
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },
  questions: {
    1: {
      title:
        "What do the kids in the story have to do to get ready for the comedy show?",
      audioSrc: "/audio/step7/comp/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "Why do the children put Mittens upstairs?",
      audioSrc: "/audio/step7/comp/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title: "What do Max and Linda do at the show?",
      audioSrc: "/audio/step7/comp/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title: "Why do the people think the show is funny?",
      audioSrc: "/audio/step7/comp/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    5: {
      title: "What does Zina do at the show?",
      audioSrc: "/audio/step7/comp/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    6: {
      title:
        "Why is the audience surprised when the cat walks across the screen?",
      audioSrc: "/audio/step7/comp/6.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },
    7: {
      title: "Why do the children want to put on another show the next week?",
      audioSrc: "/audio/step7/comp/7.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    },

    8: {
      title: "Why do the children promise to let Mittens be in the next show?",
      audioSrc: "/audio/step7/comp/8.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in undertsanding why Peter invites Jill to join him playing upside down. Misses possible answers that include because it's fun to do the same things together; he wants her to see things differently.",
        1: "Response demonstrates proficiency in understanding why Peter invites Jill to join him. Correctly identifies that Peter's motivation, and demonstrates a strong ability for higher-order critical thinking about the text. "
      },
      points: 1,
      standard: "CCRA.R.4 and CCRA.R.1",
      section: 3
    }
  },
  spellingObj: group1SpellingObj,
  numSpellingQuestions: 15
};

// Still needs: 1) CCSS, 2) audio for intro and comp, 3) proper rubric, 4) proper sections
export const step9 = {
  title: "The Fourth Letter",
  author: "Jane Richards",
  bookKey: "step9",
  brand: "STEP",
  stepLevel: 9,
  fpLevel: "I",
  markup: step9Markup,

  numPages: 6, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: "/images/dashboard/step9/step9-cover.jpg",
  introAudioSrc: "/audio/written-comp-02.mp3",
  pages: {
    1: {
      lines: ["My name is Peter.", "I'm upside down."],
      img: "/images/dashboard/step/p1.jpg"
    },
    2: {
      lines: [
        "Things look different upside down.",
        "Here is my name upside down."
      ],
      img: "/images/dashboard/step/p2.jpg"
    },
    3: {
      lines: ["I see the living room upside down.", "Everything looks funny!"],
      img: "/images/dashboard/step/p3.jpg"
    },
    4: {
      lines: ["I toss a ball.", "Does it fall up? Or down?"],
      img: "/images/dashboard/step/p4.jpg"
    },
    5: {
      lines: [
        "Who is at the door? Wow! It's my friend, Jill!",
        "But her feet are up, not down. Will her hat fall off?"
      ],
      img: "/images/dashboard/step/p5.jpg"
    },
    6: {
      lines: [
        '"Jill, do you want to play upside down with me?',
        "Being upside down is fun!'"
      ],
      img: "/images/dashboard/step/p6.jpg"
    }
  },
  numWrittenQuestions: 3,
  numOralReadingQuestions: 5,
  numQuestions: 5, // This *could* fuck you over given how the comp is built (assumes that oral starts at 1)
  numSections: 3,
  sections: {
    1: "Factual",
    2: "Inferential",
    3: "Critical thinking"
  },

  writtenQuestions: {
    1: {
      title:
        "Why does Jeffrey try on Marcus’s skates even though his mother told him not to stop anywhere?",
      audioSrc: "/audio/step5/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "What does Jeffrey do to try to find the lost letter?",
      audioSrc: "/audio/step5/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    3: {
      title:
        "Why isn’t Jeffrey’s mother angry when he tells her the whole story?",
      audioSrc: "/audio/step5/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    }
  },

  questions: {
    1: {
      title:
        "Can you talk about the story? Pretend your teacher never read it and you're going to tell them all about it.",
      audioSrc: "/audio/step-retell.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    2: {
      title: "Why does Jeffrey’s mother trust him to mail the letters?",
      audioSrc: "/audio/step5/1.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding where Upside Down takes place. Possible settings include in his house; on the couch; in his living room. Could benefit from more use of pictures as cues. ",
        1: "Response demonstrates proficiency in understanding setting. Correctly identifies that the story take place in Peter's house. Strong use of picture cues. "
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 1
    },
    3: {
      title: "When does Jeffrey notice that the fourth letter is missing?",
      audioSrc: "/audio/step5/2.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in recalling key details about plot. Misses possible answers that include his name, a living room, and a ball (among others). Could benefit from reviewing and collecting more evidence from the text before answering.",
        1: "Response demonstrates proficiency in recalling key details about plot, correctly identifying some of what Peter sees."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    4: {
      title:
        "Why doesn’t Jeffrey tell his mother about the letter at dinner, as he had planned?",
      audioSrc: "/audio/step5/3.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Peter chooses to look at things upside down. Some possible answers include things look strange, everything looks different, it's fun to see the world in a topsy-turvy way.",
        1: "Response demonstrates proficiency in understanding why Peter chooses to play upside down and how he appreciates the new perspective. Strong understanding of character motivation and theory of mind."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    5: {
      title: "What was in the letter that Jeffrey lost?",
      audioSrc: "/audio/step5/4.mp3",
      rubric: {
        0: "Response is incorrect, missing key point that Peter's friend Jill is who visits him. Response suggests that student could benefit from practice reviewing the text before answering.",
        1: "Response correctly identifies that Peter's friend Jill comes to visit him, demonstrating a proficient understanding of character and plot in the text."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 1
    },
    6: {
      title:
        "Why does Jeffrey finally tell his mother what happened to the fourth letter?",
      audioSrc: "/audio/step5/5.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Peter's perspective and motivation. Misses key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Response suggests student could benefit from reviewing more visual cues from pictures and working to develop a stronger understanding of character perspective and intent (theory of mind skills).",
        1: "Response demonstrates a proficient understanding of Peter's perspective and motivation here. Articulates the key point that, because Peter is upside down, it looks like Jill's hat will fall to the ceiling. Student shows strong ability to process visual cues from pictures and develop understanding of character perspective and intent.  "
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    }
  },
  spellingObj: group1SpellingObj,
  numSpellingQuestions: 15
};

export const fpBook = {
  title: "Bedtime for Nick",
  author: "Steve Olson",
  bookKey: "demo",
  brand: "FP",
  numPages: 10, // if you want a shorter book for testing purposes just change this
  isWideBook: true,
  coverImage: "/images/dashboard/bedtime-large.jpg",
  introAudioSrc: "/audio/intro-nick-short.mp3",
  markup: nickMarkup,
  pages: {
    1: {
      lines: [
        "Nick was looking at his book.",
        'His mom came in and said, "It’s time for bed."',
        '"Okay, Mom," said Nick.'
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/1.jpg"
    },
    2: {
      lines: [
        "Nick put on his pajamas.",
        "He washed his face and brushed his teeth.",
        "He was ready for bed."
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/2.jpg"
    },
    3: {
      lines: [
        '"Will you read me a story?" Nick asked his mom.',
        "Mom read the story to Nick.",
        "Nick liked the story about the magic fish."
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/3.jpg"
    },

    4: {
      lines: [
        "When the story was over, Nick's mom turned off the light.",
        '"Good night, Nick," his mom said.'
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/4.jpg"
    },
    5: {
      lines: [
        '"Will you turn on the nightlight?" asked Nick.',
        '"Okay, Nick," his mom said.',
        "She turned it on."
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/5.jpg"
    },
    6: {
      lines: [
        '"Good night, Nick," his mom said. "Now it’s time to go to sleep."',
        '"I can’t go to sleep," said Nick.',
        '"I will give you a good night kiss," said Nick\'s mom'
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/6.jpg"
    },

    7: {
      lines: [
        '"I can’t go to sleep," said Nick.',
        '"Will you open the door?" he asked.',
        "Nick’s mom opened the door. Light came into the room."
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/7.jpg"
    },

    8: {
      lines: [
        '"Good night, Nick," his mom said. "Go to sleep now."',
        '"I can\'t go to sleep," said Nick. "Something is missing."'
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/8.jpg"
    },

    9: {
      lines: [
        "He looked around the room. Something came in the door.",
        '"Wags! You’re late," said Nick.',
        ' "Now we can go to sleep.'
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/9.jpg"
    },
    10: {
      lines: [
        '"Good night, Nick," said Mom. "Good night, Wags."',
        '"Good night, Mom," said Nick.'
      ],
      img:
        "https://s3-us-west-2.amazonaws.com/readup-now/website/bedtime-for-nick/10.jpg"
    }
  },
  numSections: 2,
  sections: {
    1: "Within the Text",
    2: "Beyond and About the Text"
  },

  numQuestions: 4,
  numOralReadingQuestions: 4,
  questions: {
    1: {
      title: "Tell as much as you can about the passage you just read.",
      subtitle: "Be sure to include the beginning, middle and end",
      audioSrc: "/audio/VB/VB-retell-full.mp3",
      rubric: {
        3: "Response shows excellent understanding of Bedtime For Nick. Includes all major events of plot in sequence, and shows insight into Nick's actions. Uses important details to enrich the retelling.",
        2: "Response shows good understanding of Bedtime For Nick. Includes major events of plot in sequence. Describes Nick's actions and character, and uses some details to support the retelling.",
        1: "Response shows partial understanding of Bedtime For Nick. Includes one major event, but doesn't discuss others in-depth. Mentions main characters, but omits some details. Could use more focus on other parts of the story, but a good start.",
        0: "Response does not indicate understanding of Bedtime For Nick. Includes only a part of a major event, and mentions main characters in a limited way. Facts stated are not in sequence, and important ones are left out."
      },
      points: 3,
      standard: "CCRA.R.1 and CCRA.R.3",
      section: 1
    },
    2: {
      title: "What is the real reason Nick can’t sleep?",
      audioSrc: "/audio/VB/nick/nick-real-reason.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Nick can’t sleep . Misses key point that Nick can’t sleep because he misses Wags. Doesn’t use concrete details to support the answer, such as noting that Nick is only able to sleep when Wags returns.",
        1: "Response demonstrates proficiency in understanding why Nick can’t sleep. Correctly identifies that Nick can’t sleep because he misses Wags. Offers concrete details to support this answer, noting that Nick is only able to sleep when Wags returns."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 2
    },
    3: {
      title: "How do you think Nick feels about Wags?",
      audioSrc: "/audio/VB/nick/nick-how-feels.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Nick’s feelings about Wags. Misses key point that Nick loves Wags and misses him, and lacks strong supporting details (like the fact that Nick is only able to sleep when Wags returns.",
        1: "Response demonstrates an excellent understanding of Nick’s feelings about Wags. Correctly identifies that Nick loves Wags and misses him. Offers strong supporting details for this answer and notes Nick is only able to sleep when Wags comes back."
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 2
    },
    4: {
      title: "Tell about a time when you had trouble with something.",
      subtitle: "Was your problem like Nick’s? Why or why not?",
      audioSrc: "/audio/VB/nick/nick-tell-about-a-time.mp3",
      rubric: {
        0: "Response does not demonstrate a proficiency in thinking beyond the text. Misses a logical connection between the student’s experiences and Nick’s story, and lacks important supporting details.",
        1: "Response demonstrates a very strong ability to think beyond the text. Makes a strong logical connection between personal experiences and Nick’s story, and gives important supporting details."
      },
      points: 1,
      standard: "CCRA.R.9",
      section: 2
    }
  },
  spellingObj: group1SpellingObj,

  numSpellingQuestions: 15
};

export const sampleReportBookFP = {
  title: "No More Magic",
  author: "Avi",
  bookKey: "sample",
  numPages: null, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: null,
  introAudioSrc: null,
  markup: sampleWithMSV,
  pages: null,
  numSections: 3,
  sections: {
    1: "Retell",
    2: "Within the Text",
    3: "Beyond and About the Text"
  },

  numQuestions: 5,
  numOralReadingQuestions: 5,
  questions: {
    1: {
      title: "Tell as much as you can about the passage you just read.",
      subtitle: "Be sure to include the beginning, middle and end",
      audioSrc: "/audio/VB/VB-retell-full.mp3",
      rubric: {
        3: "Response shows excellent understanding of Bedtime For Nick. Includes all major events of plot in sequence, and shows insight into Nick's actions. Uses important details to enrich the retelling.",
        2: "Response shows good understanding of Bedtime For Nick. Includes major events of plot in sequence. Describes Nick's actions and character, and uses some details to support the retelling.",
        1: "Response shows partial understanding of Bedtime For Nick. Includes one major event, but doesn't discuss others in-depth. Mentions main characters, but omits some details. Could use more focus on other parts of the story, but a good start.",
        0: "Response does not indicate understanding of Bedtime For Nick. Includes only a part of a major event, and mentions main characters in a limited way. Facts stated are not in sequence, and important ones are left out."
      },
      points: 3,
      standard: "CCRA.R.1 and CCRA.R.3",
      section: 1
    },
    2: {
      title: "How is the narrator's mom trying to make him feel better?",
      audioSrc: "/audio/VB/nick/nick-real-reason.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Nick can’t sleep . Misses key point that Nick can’t sleep because he misses Wags. Doesn’t use concrete details to support the answer, such as noting that Nick is only able to sleep when Wags returns.",
        1: "Response demonstrates proficiency in understanding why Nick can’t sleep. Correctly identifies that Nick can’t sleep because he misses Wags. Offers concrete details to support this answer, noting that Nick is only able to sleep when Wags returns."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 2
    },
    3: {
      title:
        "Will Chris stop looking for his old bike when he gets a new one? How do you know?",
      audioSrc: "/audio/VB/nick/nick-how-feels.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Nick’s feelings about Wags. Misses key point that Nick loves Wags and misses him, and lacks strong supporting details (like the fact that Nick is only able to sleep when Wags returns.",
        1: "Response demonstrates an excellent understanding of Nick’s feelings about Wags. Correctly identifies that Nick loves Wags and misses him. Offers strong supporting details for this answer and notes Nick is only able to sleep when Wags comes back."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 2
    },
    4: {
      title:
        "Chris's dad says, \"We all know about Mr. Podler…Someday I'll tell you about the ghosts he saw in City Hall.\" What do you think he means?.",
      subtitle: "Was your problem like Nick’s? Why or why not?",
      audioSrc: "/audio/VB/nick/nick-tell-about-a-time.mp3",
      rubric: {
        0: "Response does not demonstrate a proficiency in thinking beyond the text. Misses a logical connection between the student’s experiences and Nick’s story, and lacks important supporting details.",
        1: "Response demonstrates a very strong ability to think beyond the text. Makes a strong logical connection between personal experiences and Nick’s story, and gives important supporting details."
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 3
    },
    5: {
      title:
        "How do you think Chris feels about getting a new bike? What makes you think this?",
      audioSrc: "/audio/VB/nick/nick-tell-about-a-time.mp3",
      rubric: {
        0: "Response does not demonstrate a proficiency in thinking beyond the text. Misses a logical connection between the student’s experiences and Nick’s story, and lacks important supporting details.",
        1: "Response demonstrates a very strong ability to think beyond the text. Makes a strong logical connection between personal experiences and Nick’s story, and gives important supporting details."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 3
    }
  },
  spellingObj: group1SpellingObj,

  numSpellingQuestions: 15
};

export const sampleReportBookSTEP = {
  title: "No More Magic",
  author: "Avi",
  bookKey: "sample",
  brand: "STEP",
  numPages: null, // if you want a shorter book for testing purposes just change this
  isWideBook: false,
  coverImage: null,
  introAudioSrc: null,
  markup: sampleWithMSV,
  pages: null,
  numSections: 3,
  sections: {
    1: "Retell",
    2: "Factual",
    3: "Inferential",
    4: "Critical Thinking"
  },

  numQuestions: 5,
  numOralReadingQuestions: 5,
  questions: {
    1: {
      title: "Tell as much as you can about the passage you just read.",
      subtitle: "Be sure to include the beginning, middle and end",
      audioSrc: "/audio/VB/VB-retell-full.mp3",
      rubric: {
        3: "Response shows excellent understanding of Bedtime For Nick. Includes all major events of plot in sequence, and shows insight into Nick's actions. Uses important details to enrich the retelling.",
        2: "Response shows good understanding of Bedtime For Nick. Includes major events of plot in sequence. Describes Nick's actions and character, and uses some details to support the retelling.",
        1: "Response shows partial understanding of Bedtime For Nick. Includes one major event, but doesn't discuss others in-depth. Mentions main characters, but omits some details. Could use more focus on other parts of the story, but a good start.",
        0: "Response does not indicate understanding of Bedtime For Nick. Includes only a part of a major event, and mentions main characters in a limited way. Facts stated are not in sequence, and important ones are left out."
      },
      points: 3,
      standard: "CCRA.R.1 and CCRA.R.3",
      section: 1
    },
    2: {
      title: "How is the narrator's mom trying to make him feel better?",
      audioSrc: "/audio/VB/nick/nick-real-reason.mp3",
      rubric: {
        0: "Response does not demonstrate proficiency in understanding why Nick can’t sleep . Misses key point that Nick can’t sleep because he misses Wags. Doesn’t use concrete details to support the answer, such as noting that Nick is only able to sleep when Wags returns.",
        1: "Response demonstrates proficiency in understanding why Nick can’t sleep. Correctly identifies that Nick can’t sleep because he misses Wags. Offers concrete details to support this answer, noting that Nick is only able to sleep when Wags returns."
      },
      points: 1,
      standard: "CCRA.R.2",
      section: 2
    },
    3: {
      title:
        "Will Chris stop looking for his old bike when he gets a new one? How do you know?",
      audioSrc: "/audio/VB/nick/nick-how-feels.mp3",
      rubric: {
        0: "Response does not demonstrate a proficient understanding of Nick’s feelings about Wags. Misses key point that Nick loves Wags and misses him, and lacks strong supporting details (like the fact that Nick is only able to sleep when Wags returns.",
        1: "Response demonstrates an excellent understanding of Nick’s feelings about Wags. Correctly identifies that Nick loves Wags and misses him. Offers strong supporting details for this answer and notes Nick is only able to sleep when Wags comes back."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 3
    },
    4: {
      title:
        "Chris's dad says, \"We all know about Mr. Podler…Someday I'll tell you about the ghosts he saw in City Hall.\" What do you think he means?.",
      subtitle: "Was your problem like Nick’s? Why or why not?",
      audioSrc: "/audio/VB/nick/nick-tell-about-a-time.mp3",
      rubric: {
        0: "Response does not demonstrate a proficiency in thinking beyond the text. Misses a logical connection between the student’s experiences and Nick’s story, and lacks important supporting details.",
        1: "Response demonstrates a very strong ability to think beyond the text. Makes a strong logical connection between personal experiences and Nick’s story, and gives important supporting details."
      },
      points: 1,
      standard: "CCRA.R.4",
      section: 3
    },
    5: {
      title:
        "How do you think Chris feels about getting a new bike? What makes you think this?",
      audioSrc: "/audio/VB/nick/nick-tell-about-a-time.mp3",
      rubric: {
        0: "Response does not demonstrate a proficiency in thinking beyond the text. Misses a logical connection between the student’s experiences and Nick’s story, and lacks important supporting details.",
        1: "Response demonstrates a very strong ability to think beyond the text. Makes a strong logical connection between personal experiences and Nick’s story, and gives important supporting details."
      },
      points: 1,
      standard: "CCRA.R.1",
      section: 4
    }
  },
  spellingObj: group1SpellingObj,

  numSpellingQuestions: 15
};

export const library = {
  demo: fireflyBook,
  nick: fpBook,
  step: step4,
  firefly: fireflyBook,
  step4: step4,
  step5: step5,
  step6: step6,
  step7: step7,
  step9: step9
};

export const spellingLibrary = {
  1: group1SpellingObj,
  2: group2SpellingObj,
  3: group3SpellingObj,
  4: group4SpellingObj
};

export const markupLibrary = {
  4: step4Markup,
  5: step5Markup,
  6: step6Markup,
  7: step7Markup,
  8: step8Markup,
  9: step9Markup,
  10: step10Markup,
  11: step11Markup,
  12: step12Markup
};

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
  isWarmup: true
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
