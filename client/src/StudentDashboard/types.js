//@flow

export const ReaderStateOptions = {
  initializing: 'READER_STATE_INITIALIZING', // i.e. waiting to determine if we have permissions
  awaitingPermissions: 'READER_STATE_AWAITING_PERMISSIONS',
  permissionsBlocked: 'READER_STATE_PERMISSIONS_BLOCKED',
  playingBookIntro: 'READER_STATE_PLAYING_BOOK_INTRO',
  talkingAboutStartButton: 'READER_STATE_TALKING_ABOUT_START_BUTTON',
  talkingAboutStopButton: 'READER_STATE_TALKING_ABOUT_STOP_BUTTON',
  talkingAboutSeeBook: 'READER_STATE_TALKING_ABOUT_SEE_BOOK',
  awaitingStart: 'READER_STATE_AWAITING_START',
  countdownToStart: 'READER_STATE_COUNTDOWN_TO_START',
  inProgress: 'READER_STATE_IN_PROGRESS',
  paused: 'READER_STATE_PAUSED',
  done: 'READER_STATE_DONE',
  doneDisplayingPlayback: 'READER_STATE_PLAYBACK',
  submitted: 'READER_STATE_SUBMITTED',
}
export type ReaderState = Keys<typeof ReaderStateOptions>;

export const PauseTypeOptions = {
  noPause: 'PAUSE_TYPE_NOT_PAUSED',
  fromPauseButton: 'PAUSE_TYPE_PAUSE_BUTTON',
  contemplatingExit: 'PAUSE_TYPE_MAY_EXIT',
}
export type PauseType = Keys<typeof PauseTypeOptions>;

export const MicPermissionsStatusOptions = {
  granted: 'MIC_PERMISSIONS_STATUS_GRANTED',
  awaiting: 'MIC_PERMISSIONS_STATUS_AWAITING',
  blocked: 'MIC_PERMISSIONS_STATUS_BLOCKED',
}
export type MicPermissionsStatus = Keys<typeof MicPermissionsStatusOptions>;


export const PromptOptions = {
  awaitingPrompt: 'AWAITING_PROMPT',
  tellSomeMore: 'TELL_SOME_MORE',
  whatInStory: 'WHAT_IN_STORY',
  whyImportant: 'WHY_IMPORTANT',
  whyThinkThat: 'WHY_THINK_THAT',
  repeatQuestion: 'REPEAT_QUESTION',
  noPromptNeeded: 'NO_PROMPT_NEEDED',
}

export type Prompt = Keys<typeof PromptOptions>;



export const PromptTextOptions = {
  TELL_SOME_MORE: 'Tell some more.',
  WHAT_IN_STORY: 'What in the story makes you think that?',
  WHY_IMPORTANT: 'Why is that important?',
  WHY_THINK_THAT: 'Why do you think that?',
  REPEAT_QUESTION: "Try reading the question again.",
}

export type pPromptText = Keys<typeof promptTextOptions>;



export const PromptAudioOptions = {
  TELL_SOME_MORE: '/audio/prompts/VB-tell-some-more.mp3',
  WHAT_IN_STORY: '/audio/prompts/VB-what-in-story.mp3',
  WHY_IMPORTANT: '/audio/prompts/VB-why-important.mp3',
  WHY_THINK_THAT: '/audio/prompts/VB-why-think-that.mp3',
  AWAITING_PROMPT: '/audio/prompts/VB-tell-some-more.mp3', // HACK to have default
}

export type PromptAudio = Keys<typeof promptAudioOptions>;

