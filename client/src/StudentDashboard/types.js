//@flow

export const ReaderStateOptions = {
  initializing: 'READER_STATE_INITIALIZING', // i.e. waiting to determine if we have permissions
  awaitingPermissions: 'READER_STATE_AWAITING_PERMISSIONS',
  permissionsBlocked: 'READER_STATE_PERMISSIONS_BLOCKED',
  playingBookIntro: 'READER_STATE_PLAYING_BOOK_INTRO',
  talkingAboutStartButton: 'READER_STATE_TALKING_ABOUT_START_BUTTON',
  talkingAboutStopButton: 'READER_STATE_TALKING_ABOUT_STOP_BUTTON',
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
