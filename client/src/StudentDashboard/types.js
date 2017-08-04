// @flow

export const ReaderStateOptions = {
  initializing: 'READER_STATE_INITIALIZING', // i.e. waiting to determine if we have permissions
  awaitingPermissions: 'READER_STATE_AWAITING_PERMISSIONS',
  permissionsBlocked: 'READER_STATE_PERMISSIONS_BLOCKED',
  playingBookIntro: 'READER_STATE_PLAYING_BOOK_INTRO',
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
