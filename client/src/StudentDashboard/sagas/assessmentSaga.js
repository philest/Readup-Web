// @flow
import {
  fork,
  call,
  take,
  takeLatest,
  cancel,
  put,
  select,
  apply
} from "redux-saga/effects";

import { delay } from "redux-saga";

// actions
import {
  PAGE_INCREMENT,
  PAGE_DECREMENT,
  NEXT_PAGE_CLICKED,
  PREVIOUS_PAGE_CLICKED,
  PAUSE_CLICKED,
  RESUME_CLICKED,
  STOP_RECORDING_CLICKED,
  COMP_PAUSE_CLICKED,
  setHasRecordedSomething,
  setCurrentSound,
  setCurrentModal,
  setReaderState
} from "../state";

import { ReaderStateOptions } from "../types";

import { getRecorder, getIsDemo, getPrompt, getReaderState } from "./selectors";

import { clog } from "./helpers";

import { playSoundAsync, playSound, stopAudio } from "../audioPlayer";

import { sendEmail } from "../../ReportsInterface/emailHelpers";

const PAGE_CHANGE_DEBOUNCE_TIME_MS = 200;

function* pauseAssessmentSaga(action) {
  try {
    const recorder = yield select(getRecorder);
    yield call(recorder.pauseRecording);
  } catch (err) {
    yield clog("err", err);
  }
  yield delay(300); // delay to prevent phil's voice from getting pick up :/

  yield call(playSoundAsync, "/audio/bamboo.mp3");

  // yield call(playSoundAsync, '/audio/paused.mp3')
  yield put.resolve(setReaderState(ReaderStateOptions.paused));
  // yield put.resolve(setCurrentSound('/audio/paused.mp3'))
  yield put.resolve(setCurrentModal("modal-paused"));
  return;
  // directly show modal here
}

function* compPauseAssessmentSaga(action) {
  try {
    const recorder = yield select(getRecorder);
    yield call(recorder.pauseRecording);
  } catch (err) {
    yield clog("err", err);
  }

  const readerState = yield select(getReaderState);

  yield delay(300); // delay to prevent phil's voice from getting pick up :/

  yield call(playSound, "/audio/complete.mp3");

  if (readerState === "READER_STATE_IN_PROGRESS") {
    yield put.resolve(setReaderState(ReaderStateOptions.paused));
  }

  // yield put.resolve(setCurrentSound('/audio/paused.mp3'))
  yield put.resolve(setCurrentModal("modal-comp-paused"));
  return;
  // directly show modal here
}

function* resumeAssessmentSaga(action) {
  yield call(stopAudio);

  yield call(playSound, "/audio/complete.mp3");

  yield clog("here i am in resume...");

  try {
    const recorder = yield select(getRecorder);
    const prompt = yield select(getPrompt);

    yield clog("recorder: ", recorder);

    // only resume if it's pause and in progres— this makes sure prompt recordings (where the recorder is paused) and resumed when they never stared.
    if (
      recorder &&
      recorder.rtcRecorder.state === "paused" &&
      prompt === "AWAITING_PROMPT"
    ) {
      yield call(recorder.resumeRecording);
      yield put.resolve(setReaderState(ReaderStateOptions.inProgress));
    }
  } catch (err) {
    yield clog("err", err);
  }

  yield put.resolve(setCurrentModal("no-modal"));
}

function* pageIncrementSaga(action) {
  yield call(console.log, "here in PAGE_INCREMENT........");

  yield call(delay, PAGE_CHANGE_DEBOUNCE_TIME_MS);
  yield put({ type: PAGE_INCREMENT });
}

function* pageDecrementSaga(action) {
  yield call(delay, PAGE_CHANGE_DEBOUNCE_TIME_MS);
  yield put({ type: PAGE_DECREMENT });
}

// TODO: flowtype the assessment results as return value
export default function* assessmentSaga() {
  yield call(console.log, "here in assessmentSaga");
  // watchers!
  // TODO: refactor this into saga for referential integrity of recorder
  yield takeLatest(PAUSE_CLICKED, pauseAssessmentSaga);

  yield takeLatest(COMP_PAUSE_CLICKED, compPauseAssessmentSaga);

  yield takeLatest(RESUME_CLICKED, resumeAssessmentSaga);

  yield takeLatest(NEXT_PAGE_CLICKED, pageIncrementSaga);

  yield takeLatest(PREVIOUS_PAGE_CLICKED, pageDecrementSaga);
  // start recording the assessment audio
  const recorder = yield select(getRecorder);

  try {
    yield call(recorder.startRecording);
    yield put.resolve(setHasRecordedSomething(true));
  } catch (err) {
    yield clog("ERROR: ", err);
    yield call(
      sendEmail,
      err,
      "Recorder failed to start",
      "philesterman@gmail.com"
    ); // move here so don't break
  }

  return { some: "sick results" };
}
