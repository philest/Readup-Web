// @flow
import {
	fork,
	call,
	take,
	takeLatest,
	takeEvery,
	cancel,
	put,
	select,
	race,
	all
} from "redux-saga/effects";
import { delay } from "redux-saga";

import {
	getS3Presign,
	sendAudioToS3,
	requestNewAssessment,
	getStudentPromptStatus,
	resetToAwaitingPrompt,
	getLastStudentID,
	getLastAssessmentID,
	markCompleted,
	getIsLiveDemo
} from "./networkingHelpers";

import { clog, isMobileDevice } from "./helpers";

import audioEffectsSaga from "./audioEffectsSaga";
import Recorder from "../recorder";
import {
	playSound,
	stopAudio,
	playSoundAsync as _pSA,
	DEV_DISABLE_VOICE_INSTRUCTIONS
} from "../audioPlayer";

// actions
import {
	PERMISSIONS_ARROW_CLICKED,
	PAUSE_CLICKED,
	START_RECORDING_CLICKED,
	STOP_RECORDING_CLICKED,
	BOOK_INTRO_RECORDING_ENDED,
	INTRO_CONTINUE_CLICKED,
	HEAR_RECORDING_CLICKED,
	HEAR_INTRO_AGAIN_CLICKED,
	SEE_BOOK_CLICKED,
	COUNTDOWN_ENDED,
	EXIT_CLICKED,
	RESTART_RECORDING_CLICKED,
	TURN_IN_CLICKED,
	IS_DEMO_SET,
	SPINNER_SHOW,
	SPINNER_HIDE,
	DEMO_SUBMITTED_LOGOUT_CLICKED,
	IN_COMP_SET,
	IN_SPELLING_SET,
	SEE_COMP_CLICKED,
	HEAR_QUESTION_AGAIN_CLICKED,
	QUESTION_INCREMENT,
	QUESTION_DECREMENT,
	LAST_QUESTION_EXITED,
	VOLUME_INDICATOR_HIDDEN,
	BOOK_KEY_SET,
	STUDENT_NAME_SET,
	LIVE_DEMO_SET,
	SPELLING_ANSWER_GIVEN_SET,
	NEXT_WORD_CLICKED,
	PREVIOUS_WORD_CLICKED,
	NEXT_QUESTION_CLICKED,
	PREVIOUS_QUESTION_CLICKED,
	VOLUME_INDICATOR_SHOWN,
	FINAL_SPELLING_QUESTION_ANSWERED,
	FINAL_COMP_QUESTION_ANSWERED,
	FINAL_WRITTEN_COMP_QUESTION_ANSWERED,
	SECTION_SKIPPED,
	SKIP_CLICKED,
	SHOW_SKIP_PROMPT_SET,
	ASSESSMENT_ID_SET,
	AVATAR_CLICKED,
	FINISH_VIDEO_CLICKED,
	IS_WARMUP_SET,
	SPELLING_QUESTION_NUMBER_SET,
	IN_SILENT_READING_SET,
	RESUME_CLICKED,
	avatarClicked,
	startCountdownToStart,
	setMicPermissions,
	setHasRecordedSomething,
	setReaderState,
	setPageNumber,
	setCurrentSound,
	setRecordingURL,
	setCurrentModal,
	setCurrentOverlay,
	setCountdownValue,
	setInComp,
	setInSpelling,
	setSpellingAnswerGiven,
	setSpellingInput,
	setQuestionNumber,
	setSpellingQuestionNumber,
	setWrittenQuestionNumber,
	setPrompt,
	hideVolumeIndicator,
	showVolumeIndicator,
	setLiveDemo,
	incrementQuestion,
	decrementQuestion,
	setInOralReading,
	setInSilentReading,
	stopRecordingClicked,
	setShowSkipPrompt,
	setAssessmentID,
	setAssessmentSubmitted,
	setIsWarmup
} from "../state";

import {
	ReaderStateOptions,
	MicPermissionsStatusOptions,
	PromptOptions,
	PromptAudioOptions
} from "../types";

import {
	getRecorder,
	getIsDemo,
	getIsWarmup,
	getNumQuestions,
	getQuestionNumber,
	getSpellingQuestionNumber,
	getBook,
	getInComp,
	getInOralReading,
	getInSpelling,
	getHasLoggedIn,
	getStudentName,
	getAssessmentID
} from "./selectors";

import assessmentSaga from "./assessmentSaga";

import {
	sendEmail,
	sendCall,
	getAssessmentData
} from "../../ReportsInterface/emailHelpers";

const QUESTION_CHANGE_DEBOUNCE_TIME_MS = 200;
const MAX_NUM_PROMPTS = 2;

function hasSilentReading(book) {
	return (
		book.brand === "STEP" && (book.stepLevel >= 6 && book.stepLevel <= 8)
	);
}

function hasWrittenComp(book) {
	return book.brand === "STEP" && book.stepLevel >= 9;
}

function getPermission(recorder, isDemo) {
	console.log("Here in getPerm, we say isDemo: ", isDemo);

	return navigator.mediaDevices
		.getUserMedia({ audio: true, video: !isDemo })
		.then(function(yay) {
			recorder.initialize();
			return true;
		})
		.catch(function(err) {
			console.log("ERROR getting mic permissions : ", err);
			return false;
		});
}

function* playSoundAsync(sound) {
	yield call(_pSA, sound);
	return;
}

function* getMicPermissionsSaga() {
	const hasPermissions = yield new Promise((resolve, reject) => {
		Recorder.hasRecordingPermissions(permissions => {
			console.log("We have permissions? " + permissions);
			resolve(permissions);
		});
	});

	if (hasPermissions) {
		yield put.resolve(
			setMicPermissions(MicPermissionsStatusOptions.granted)
		);
		return true;
	}

	yield put.resolve(setMicPermissions(MicPermissionsStatusOptions.awaiting));
	yield put.resolve(setCurrentOverlay("overlay-permissions"));

	// an asynchronous play helper in 8 seconds that then...
	// const permissionEffects = []
	// permissionEffects.push(yield fork(playPermissionsInstructionSaga ));
	yield call(playSoundAsync, "/audio/allow.mp3");

	const recorder = yield select(getRecorder);

	const isDemo = yield select(getIsDemo);

	const getPermissionSuccess = yield getPermission(recorder, isDemo);

	// ...is cancelled after a student clicks a permission button.
	yield call(stopAudio);

	const micPermissions = getPermissionSuccess
		? MicPermissionsStatusOptions.granted
		: MicPermissionsStatusOptions.blocked;
	yield put.resolve(setMicPermissions(micPermissions));

	return getPermissionSuccess;
}

function errorHandler(error) {
	console.log("saw this error:", error);
}

function* haltRecordingAndGenerateBlobSaga(recorder, isCompBlob, firstTime) {
	yield put.resolve(setReaderState(ReaderStateOptions.done));

	let blobURL;

	try {
		blobURL = yield new Promise(function(resolve, reject) {
			recorder.stopRecording(blobUrl => {
				resolve(blobUrl);
			});
		});
	} catch (err) {
		yield clog("ERROR: ", err);
	}

	blobURL = blobURL || "fake";

	// this is done in the Store because PlaybackModal takes this is a prop
	if (!isCompBlob) {
		yield put.resolve(setRecordingURL(blobURL, isCompBlob));
	} else if (firstTime) {
		yield put.resolve(setRecordingURL(blobURL, isCompBlob));
	}

	return yield blobURL;
}

function* redirectToHomepage() {
	yield (window.location.href = "/");
}

function* turnInAudio(
	blob,
	assessmentId: number,
	isCompBlob: boolean,
	questionNum: number
) {
	let numAttempts = 2;

	if (isCompBlob) {
		numAttempts = 1;
	}

	yield clog("inside turnInAudio...");

	for (let i = 0; i < numAttempts; i++) {
		try {
			const presign = yield getS3Presign(assessmentId, isCompBlob);
			const res = yield sendAudioToS3(
				blob,
				presign,
				isCompBlob,
				questionNum
			);
			yield clog("yay response!", res);
			return yield res;
		} catch (err) {
			yield clog("turnInAudio error ERR:", err, err.request);
		}
	}
	return yield false; // TODO: this is pretty meh
}

function* skipClick() {
	const inOralReading = yield select(getInOralReading);

	const book = yield select(getBook);

	if (inOralReading) {
		// set page because of skipping
		const lastPage = book.numPages;
		yield put.resolve(setPageNumber(lastPage));

		yield put.resolve(stopRecordingClicked());
	}

	const inComp = yield select(getInComp);

	if (inComp) {
		yield call(playSound, "/audio/complete.mp3");
		yield call(delay, 500);

		if (hasSilentReading(book)) {
			yield put.resolve(
				setQuestionNumber(book.numOralReadingQuestions + 1)
			);
		}

		// halt the recorder if it's still going
		let recorder = yield select(getRecorder);

		if (recorder.recording || recorder.rtcRecorder.state === "paused") {
			// if in middle of prompt thing
			const uploadEffects = [];

			const compRecordingURL = yield* haltRecordingAndGenerateBlobSaga(
				recorder,
				true,
				false
			);

			let newBlob;

			try {
				newBlob = recorder.getBlob();
			} catch (err) {
				yield clog("err: ", err);
				newBlob = "it broke";
			}

			const assessmentId = yield getLastAssessmentID().catch(
				e => e.request
			); // TODO

			const currQ = yield select(getQuestionNumber);

			uploadEffects.push(
				yield fork(turnInAudio, newBlob, assessmentId, true, currQ)
			);

			yield call(delay, 1000);

			yield cancel(...uploadEffects);
		}

		yield put({ type: FINAL_COMP_QUESTION_ANSWERED });
	}

	const inSpelling = yield select(getInSpelling);

	if (inSpelling) {
		yield call(playSound, "/audio/complete.mp3");
		yield call(delay, 500);

		yield put({ type: FINAL_SPELLING_QUESTION_ANSWERED });
	}
}

function* exitClick() {
	const recorder = yield select(getRecorder);

	if (recorder && recorder.recording) {
		yield call(recorder.pauseRecording);
		yield put.resolve(setReaderState(ReaderStateOptions.paused));
	}

	yield call(stopAudio);
	yield call(playSoundAsync, "/audio/bamboo.mp3");

	yield put(setCurrentModal("modal-exit"));
}

export function* questionIncrementSaga(section, spellingEffects) {
	yield clog("here in QUESTION_INCREMENT........: ", section);

	yield call(playSound, "/audio/complete.mp3");

	yield call(delay, QUESTION_CHANGE_DEBOUNCE_TIME_MS);

	// if we just answered the last question, exit spelling

	if (section === "spelling") {
		const spellingQuestionNumber = yield select(getSpellingQuestionNumber);
		const book = yield select(getBook);

		const isWarmup = yield select(getIsWarmup);

		if (
			book.numSpellingQuestions === spellingQuestionNumber ||
			(isWarmup && spellingQuestionNumber === 2)
		) {
			yield put({ type: FINAL_SPELLING_QUESTION_ANSWERED });
			return;
		}
	}

	yield put.resolve(incrementQuestion(section));

	// redisable button
	if (section === "spelling") {
		yield put.resolve(setSpellingAnswerGiven(false));

		yield call(playSpellingQuestionSaga);
	}
}

export function* questionDecrementSaga(section) {
	yield clog("here in QUESTION_DECREMENT........: ", section);

	yield call(delay, QUESTION_CHANGE_DEBOUNCE_TIME_MS);

	// yield call(playSound, "/audio/complete.mp3");

	yield put.resolve(decrementQuestion(section));

	if (section === "spelling") {
		const assessmentID = yield select(getAssessmentID);

		const assessment = yield getAssessmentData(assessmentID).catch(
			e => e.request
		);

		if (assessment && assessment.scored_spelling) {
			yield clog("assessment: ", assessment);
			yield clog("scored_spelling: ", assessment.scored_spelling);
			yield clog("responses: ", assessment.scored_spelling["responses"]);

			const spellingQuestionNumber = yield select(
				getSpellingQuestionNumber
			);
			yield clog(
				"prev word: ",
				assessment.scored_spelling["responses"][
					spellingQuestionNumber - 1
				]
			);

			yield put.resolve(
				setSpellingInput(
					assessment.scored_spelling["responses"][
						spellingQuestionNumber - 1
					]
				)
			);
		}
	}

	// redisable button
	if (section === "spelling") {
		yield put.resolve(setSpellingAnswerGiven(true));
		yield call(playSpellingQuestionSaga);
	}
}

function* playSpellingQuestionSaga() {
	let audiofile;
	const spellingQuestionNumber = yield select(getSpellingQuestionNumber);
	const book = yield select(getBook);
	// audiofile = `/audio/${book.bookKey}/spelling/${2}.mp3`

	audiofile = `/audio/spelling/${spellingQuestionNumber}.mp3`;

	const isWarmup = yield select(getIsWarmup);
	if (isWarmup && spellingQuestionNumber === 1) {
		audiofile = "/audio/warmup/w-10.mp3";
	} else if (isWarmup && spellingQuestionNumber === 2) {
		audiofile = "/audio/warmup/w-11.mp3";
	}

	yield call(playSound, audiofile);
}

function* playPromptSaga(prompt, studentID) {
	// in case we're coming from the comp paused modal...
	// yield put.resolve(setCurrentModal("modal-comp"));

	let audiofile;
	if (prompt === PromptOptions.repeatQuestion) {
		const questionNumber = yield select(getQuestionNumber);
		const book = yield select(getBook);
		audiofile = book.questions[questionNumber].audioSrc;
	} else {
		audiofile = PromptAudioOptions[prompt];
	}

	yield call(playSound, audiofile);

	yield put.resolve(setReaderState(ReaderStateOptions.awaitingStart));

	yield call(resetToAwaitingPrompt, studentID);
}

function* newFetchUntilPrompt(studentID) {
	let fetchedPrompt = PromptOptions.awaitingPrompt;

	while (fetchedPrompt === PromptOptions.awaitingPrompt) {
		fetchedPrompt = yield getStudentPromptStatus(studentID).catch(
			e => e.request
		); // TODO

		if (fetchedPrompt === PromptOptions.noPromptNeeded) {
			yield call(resetToAwaitingPrompt, studentID);
			return null;
		}

		yield clog("Prompt:", fetchedPrompt);
		yield call(delay, 1000);
	}

	return fetchedPrompt; // a meaningful prompt was found
}

function* helperInstructionSaga(
	isStartReading,
	isStartAnswer,
	isBlueCheckmark,
	isNextButton,
	isName
) {
	if (isStartReading) {
		yield call(delay, 5000);
		yield call(playSoundAsync, "/audio/click-start.mp3");
	} else if (isStartAnswer) {
		yield call(delay, 16000);
		yield call(playSoundAsync, "/audio/new-comp-start.mp3");
		yield call(delay, 3400);
		yield call(playSoundAsync, "/audio/new-comp-stop.mp3");
	} else if (isBlueCheckmark) {
	} else if (isNextButton) {
		yield call(delay, 79000);
		yield call(playSoundAsync, "/audio/next-button.m4a");
	} else if (isName) {
		yield call(delay, 13500);
		yield call(playSoundAsync, "/audio/find-your-name.m4a");
	}
}

// wrapper that cancels side effects that interrupt, then restarts saga.
function* hearIntroAgainSaga(helperEffect, book) {
	if (helperEffect.length >= 1) {
		yield cancel(...helperEffect);
	}

	yield call(introInstructionSaga, book);
}

function* introInstructionSaga(book) {
	const isWarmup = yield select(getIsWarmup);

	yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));
	yield put.resolve(showVolumeIndicator());

	yield clog("set it");

	yield call(stopAudio);

	yield call(delay, 1350);

	if (isWarmup) {
		yield call(playSound, "/audio/warmup/w-1.mp3");
		yield call(playSound, "/audio/warmup/w-2.mp3");
		yield put.resolve(
			setReaderState(ReaderStateOptions.talkingAboutStartButton)
		);

		yield put.resolve(showVolumeIndicator());

		yield call(playSound, "/audio/warmup/w-3.mp3");
		yield put.resolve(setReaderState(ReaderStateOptions.awaitingStart));
		yield call(playSound, "/audio/complete.mp3");
	} else {
		yield call(playSound, "/audio/your-teacher-wants-intro.mp3");

		yield put.resolve(showVolumeIndicator());

		yield call(playSound, book.introAudioSrc);

		yield put.resolve(
			setReaderState(ReaderStateOptions.talkingAboutStartButton)
		);

		yield put.resolve(showVolumeIndicator());

		yield clog("hasSilentReading: ", hasSilentReading(book));

		if (hasSilentReading(book)) {
			yield call(playSound, "/audio/silent-new-01.mp3");
		} else {
			yield call(playSound, "/audio/intro-click-start.mp3");
		}

		yield put.resolve(
			setReaderState(ReaderStateOptions.talkingAboutStopButton)
		);

		if (hasSilentReading(book)) {
			yield call(playSound, "/audio/silent-stop.m4a");
		} else {
			yield call(playSound, "/audio/intro-click-stop.mp3");
		}

		yield put.resolve(setReaderState(ReaderStateOptions.awaitingStart));

		yield call(playSound, "/audio/complete.mp3");
	}
}

function* spellingInstructionSaga() {
	const isWarmup = yield select(getIsWarmup);

	if (isWarmup) {
		yield call(playSoundAsync, "/audio/warmup/w-9.mp3");
		yield call(delay, 5000);

		yield put.resolve(
			setReaderState(ReaderStateOptions.talkingAboutSpellingBox)
		);
		yield call(delay, 3100);
		yield put.resolve(setReaderState(ReaderStateOptions.done));

		yield call(playSound, "/audio/say-sounds-slowly.mp3");
	} else {
		yield call(playSound, "/audio/spelling-intro-transition.mp3");
		yield put.resolve(
			setReaderState(ReaderStateOptions.talkingAboutSpellingBox)
		);
		yield call(playSound, "/audio/spelling-intro-type-it.mp3");
		yield put.resolve(setReaderState(ReaderStateOptions.done));
		yield call(playSound, "/audio/say-sounds-slowly.mp3");
	}
}

function* compInstructionSaga() {
	yield put.resolve(setPageNumber(0));
	yield put.resolve(setInComp(true));

	if (!DEV_DISABLE_VOICE_INSTRUCTIONS) {
		yield call(delay, 500);

		const isWarmup = yield select(getIsWarmup);

		if (!isWarmup) {
			// yield call(playSoundAsync, "/audio/comp-instructions.mp3");

			yield put.resolve(
				setReaderState(ReaderStateOptions.talkingAboutStartButton)
			);

			yield call(playSound, "/audio/new-comp-start.mp3");

			yield put.resolve(
				setReaderState(ReaderStateOptions.talkingAboutStopButton)
			);

			yield call(playSound, "/audio/new-comp-stop.mp3");

			yield call(delay, 150);

			yield call(playSound, "/audio/look-back-book.mp3");

			yield call(delay, 700);
		} else {
			yield put.resolve(
				setReaderState(ReaderStateOptions.talkingAboutStartButton)
			);

			yield call(playSound, "/audio/warmup/w-6-2.mp3");

			yield put.resolve(
				setReaderState(ReaderStateOptions.talkingAboutStopButton)
			);
			yield call(delay, 250);

			yield call(playSound, "/audio/warmup/w-6-3.mp3");

			yield call(delay, 150);
		}

		yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));

		yield put.resolve(setCurrentModal("no-modal"));

		yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));

		// yield put.resolve(setCurrentModal("modal-comp"));
	}
}

// assumes at least one question...
function* definedCompSaga(
	numQuestions,
	assessmentId,
	uploadEffects,
	isSilentReading
) {
	yield put.resolve(setInComp(true));

	let compBlobArray = [];

	uploadEffects.push(
		yield takeLatest(TURN_IN_CLICKED, function*() {
			yield call(playSound, "/audio/complete.mp3");
			yield put({ type: SPINNER_SHOW });

			const assID = yield getLastAssessmentID().catch(e => e.request); // TODO

			const res = yield call(markCompleted, assID);
			yield clog("marked it as completed!: ", res);
			yield put(setAssessmentSubmitted(true));

			window.location.href = "/reports/sample";
		})
	);

	const isWarmup = yield select(getIsWarmup);

	const book = yield select(getBook);

	if (isSilentReading) {
		numQuestions = book.numQuestions;
	}

	numQuestions = isWarmup ? 2 : numQuestions;

	// get currentQuestion
	// initialize currQ to that
	// if it's silent reading, add something to numQuestions to make it larger --> or just make it the real whole thing...

	let questionNumber = yield select(getQuestionNumber);

	yield clog("questionNumber: ", questionNumber);
	yield clog("numQuestions: ", numQuestions);

	for (let currQ = questionNumber; currQ <= numQuestions; currQ++) {
		yield clog("currQ IS", currQ);

		let isFirstTime = currQ === 1;
		if (isFirstTime) {
			// first time, play instructions
			// yield put.resolve(setCurrentModal("modal-comp"));
			yield call(compInstructionSaga);
		}

		let newBlob = yield* compSaga(isFirstTime, false, isFirstTime, currQ);
		compBlobArray.push(newBlob);

		if (currQ < numQuestions) {
			uploadEffects.push(
				yield fork(turnInAudio, newBlob, assessmentId, true, currQ)
			);
		} else {
			yield put({ type: SPINNER_SHOW });
			yield put.resolve(setCurrentOverlay("overlay-spinner"));

			yield clog("before turn in");

			yield* turnInAudio(newBlob, assessmentId, true, currQ); // wait for the last one

			yield clog("after turn in");

			yield put({ type: SPINNER_HIDE });
			yield put.resolve(setCurrentOverlay("no-overlay"));
		}

		// reset the recorder each time
		let recorder = yield select(getRecorder);
		yield call(recorder.reset);
		recorder = yield select(getRecorder);
		yield call(recorder.initialize);
	}

	questionNumber = yield select(getQuestionNumber);

	yield clog("numQuestions: ", numQuestions);
	yield clog("questionNumber: ", questionNumber);

	if (numQuestions <= questionNumber || (isWarmup && questionNumber >= 2)) {
		console.log("in this ending part......");
		yield cancel(...uploadEffects);
		yield put({ type: FINAL_COMP_QUESTION_ANSWERED });
		return compBlobArray;
	}

	yield cancel(...uploadEffects);

	return compBlobArray;
}

function* compSaga(
	firstTime: boolean,
	isPrompt: boolean,
	isOnFirstQuestion: boolean,
	currQ: number
) {
	const compEffects = [];

	yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));

	// yield put.resolve(setCurrentModal("modal-comp"));

	if (!isPrompt) {
		yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));

		let book = yield select(getBook);
		let audioFile = book.questions[String(currQ)].audioSrc;

		const isWarmup = yield select(getIsWarmup);

		if (isWarmup && currQ === 1) {
			yield call(playSound, "/audio/warmup/w-7.mp3");
		} else if (isWarmup && currQ === 2) {
			yield call(playSound, "/audio/warmup/w-8.mp3");
		} else {
			yield call(playSound, audioFile);
		}

		yield put.resolve(setShowSkipPrompt(true));

		yield put.resolve(setReaderState(ReaderStateOptions.awaitingStart));
	}

	yield put.resolve(setReaderState(ReaderStateOptions.awaitingStart));

	yield call(playSoundAsync, "/audio/complete.mp3");

	// yield put.resolve(setReaderState(
	//   ReaderStateOptions.playingBookIntro,
	// ))

	// // if (firstTime) {
	// //   yield call(delay, 8200)
	// // }

	// yield put.resolve(setReaderState(
	//   ReaderStateOptions.awaitingStart,
	// ))

	// BEGIN the former compSeeBookSaga

	compEffects.push(
		yield takeLatest(SEE_BOOK_CLICKED, function*() {
			yield put.resolve(setCurrentModal("no-modal"));
			yield call(stopAudio);
		})
	);

	compEffects.push(
		yield takeLatest(SEE_COMP_CLICKED, function*() {
			// yield put.resolve(setCurrentModal("modal-comp"));
		})
	);

	// END the former compSeeBookSaga

	// if (firstTime) {
	//   const compEffects = [];
	//   helperEffect.push(yield fork(helperInstructionSaga, false, true));
	// }

	yield take(START_RECORDING_CLICKED);

	// if (firstTime) {
	//   // cancel that saga.
	//   yield cancel(...helperEffect);
	// }

	yield call(stopAudio);

	yield put.resolve(setReaderState(ReaderStateOptions.countdownToStart));

	yield playSoundAsync("/audio/single_countdown.mp3");

	// yield playSoundAsync("/audio/recording_countdown.mp3");

	if (!DEV_DISABLE_VOICE_INSTRUCTIONS) {
		let countdown = 1;
		while (countdown > 0) {
			yield put(setCountdownValue(countdown));
			yield call(delay, 1000);
			countdown--;
		}
	}

	// yield call(delay, 900);

	let recorder = yield select(getRecorder);

	if (!isPrompt) {
		// Start recording
		try {
			yield call(recorder.startRecording);
			yield put.resolve(setHasRecordedSomething(true));
			yield put.resolve(setReaderState(ReaderStateOptions.inProgress));
		} catch (err) {
			yield clog("ERROR: ", err);
			yield call(
				sendEmail,
				err,
				"Recorder failed to start in comp...",
				"philesterman@gmail.com"
			); // move here so don't break
		}
	} else {
		try {
			yield call(recorder.resumeRecording);
			yield put.resolve(setReaderState(ReaderStateOptions.inProgress));

			// reset it so that you get expected pausing behavior
			yield put.resolve(setPrompt(PromptOptions.awaitingPrompt));
		} catch (err) {
			yield clog("ERROR: ", err);
			yield call(
				sendEmail,
				err,
				"Recorder failed to resume in comp...",
				"philesterman@gmail.com"
			); // move here so don't break
		}
	}

	// In middle of recording

	const studentID = yield getLastStudentID().catch(e => e.request); // TODO

	let isLiveDemo = yield call(getIsLiveDemo);

	yield clog("isLiveDemo: ", isLiveDemo);

	if (isLiveDemo) {
		yield put.resolve(setLiveDemo(true));
	}

	yield clog("studentID is", studentID);

	yield take(STOP_RECORDING_CLICKED);

	// for the physical book version
	yield put.resolve(setCurrentModal("no-modal"));

	yield call(stopAudio);

	recorder = yield select(getRecorder);

	// Pause it for the prompt fetching
	yield call(recorder.pauseRecording);
	yield put.resolve(setReaderState(ReaderStateOptions.paused));

	yield playSound("/audio/complete.mp3");

	yield clog("made it here 3");

	yield clog("compEffects is....", compEffects);

	// yield put({ type: SPINNER_SHOW });

	yield put.resolve(setCurrentOverlay("overlay-spinner"));

	let waitingTime = isLiveDemo ? 8000 : 3000;
	console.log("waitingTime: ", waitingTime);

	const { prompt, timeout } = yield race({
		prompt: call(newFetchUntilPrompt, studentID),
		timeout: call(delay, waitingTime)
	});

	yield put.resolve(setCurrentOverlay("no-overlay"));

	// yield put({ type: SPINNER_HIDE });

	yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));

	if (prompt) {
		yield clog("111 We found a prompt!: ", prompt);

		yield put.resolve(setPrompt(prompt));

		yield call(playPromptSaga, prompt, studentID);

		yield cancel(...compEffects);

		return yield call(compSaga, false, true, firstTime, currQ);
	} else {
		yield clog("111 NO PROMPT FOUND");

		// reset.
		yield put.resolve(setPrompt(PromptOptions.awaitingPrompt));

		// stop it
		const compRecordingURL = yield* haltRecordingAndGenerateBlobSaga(
			recorder,
			true,
			isOnFirstQuestion
		);
		yield clog("url for comp recording!!!", compRecordingURL);

		let newBlob;

		try {
			newBlob = recorder.getBlob();
		} catch (err) {
			yield clog("err: ", err);
			newBlob = "it broke";
		}

		yield put.resolve(setCurrentModal("no-modal"));

		yield* questionIncrementSaga("comp");

		yield cancel(...compEffects);

		return newBlob;
	}
}

function* writtenCompSaga() {
	yield takeLatest(
		NEXT_QUESTION_CLICKED,
		questionIncrementSaga,
		"writtenComp"
	);

	yield takeLatest(
		PREVIOUS_QUESTION_CLICKED,
		questionDecrementSaga,
		"writtenComp"
	);
}

function* hideVolumeSaga() {
	yield call(delay, 5500);
	yield put.resolve(hideVolumeIndicator());
}

function* videoWiggleSaga() {
	yield call(delay, 75000);
	yield put.resolve(setReaderState(ReaderStateOptions.watchedFullVideo));
}

function* assessThenSubmitSaga(assessmentId) {
	const effects = [];

	// TODO: convert this into a batched action
	yield put.resolve(setPageNumber(0));
	yield put.resolve(setQuestionNumber(1));
	yield put.resolve(setPrompt(PromptOptions.awaitingPrompt));

	yield put.resolve(setInComp(false));
	yield put.resolve(setInSpelling(false));
	yield put.resolve(setInOralReading(true));
	yield put.resolve(setShowSkipPrompt(false));
	yield put.resolve(setInSilentReading(false));

	yield put.resolve(setHasRecordedSomething(false));
	yield put.resolve(setCurrentModal("no-modal"));
	yield put(setAssessmentSubmitted(false));
	yield put.resolve(setSpellingInput(""));
	yield put.resolve(setSpellingQuestionNumber(1));
	yield put.resolve(setWrittenQuestionNumber(1));

	yield put(setCurrentOverlay("no-overlay"));

	const permissionsGranted = yield* getMicPermissionsSaga(); // blocks

	// TODO asap as possible
	// TODO: some loop here :)
	while (!permissionsGranted) {
		yield put(setCurrentOverlay("overlay-blocked-mic"));
		yield call(playSound, "/audio/teacher-help.mp3");
		yield take("ickkkkk");
		return;
	}

	yield put(setCurrentOverlay("no-overlay"));

	const book = yield select(getBook);

	if (hasWrittenComp(book)) {
		effects.push(yield fork(writtenCompSaga));

		yield put.resolve(setReaderState(ReaderStateOptions.inWrittenComp));

		yield put(setCurrentModal("modal-comp"));

		yield take(FINAL_WRITTEN_COMP_QUESTION_ANSWERED);
		yield put(setCurrentModal("no-modal"));
	}

	const earlyExitEffect = [];

	earlyExitEffect.push(yield takeLatest(EXIT_CLICKED, redirectToHomepage));

	effects.push(yield takeLatest(SKIP_CLICKED, skipClick));

	const helperEffect = []; // deals with extra instructions

	effects.push(
		yield takeLatest(
			HEAR_INTRO_AGAIN_CLICKED,
			hearIntroAgainSaga,
			helperEffect,
			book
		)
	);

	// permission was granted!!!!

	const isDemo = yield select(getIsDemo);
	const isWarmup = yield select(getIsWarmup);
	const hasLoggedIn = yield select(getHasLoggedIn);

	if (!isWarmup && isDemo) {
		yield put.resolve(avatarClicked()); /// log in for them
	}

	yield clog(
		"hasLoggedIn, isDemo, isWarmup: ",
		hasLoggedIn,
		isDemo,
		isWarmup
	);

	if (!isDemo && !hasLoggedIn) {
		const nameEffect = [];
		yield call(playSoundAsync, "/audio/find-your-name.m4a");
		yield clog("in login world...");

		nameEffect.push(
			yield fork(helperInstructionSaga, false, false, false, false, true)
		);

		yield take(AVATAR_CLICKED);

		yield cancel(...nameEffect);

		yield call(playSound, "/audio/complete.mp3");
	}

	const studentName = yield select(getStudentName);
	const thisBook = yield select(getBook);

	if (isWarmup) {
		// TODO: A more resilient way to create the user only once, if not warmup...
		$.ajax({
			url: `/auth/phil_setup_demo?book_key=${thisBook.bookKey}&student_name=${studentName}`,
			type: "post"
		}).fail(function(xhr, status, err) {
			console.log(err);
		});
	}

	const videoWiggleEffect = [];

	if (!isDemo && isWarmup) {
		// show the video saga
		yield put.resolve(hideVolumeIndicator());
		yield put.resolve(setReaderState(ReaderStateOptions.watchingVideo));
		yield put.resolve(setCurrentOverlay("overlay-spinner"));

		yield put({ type: SPINNER_SHOW });

		yield call(delay, 3500);

		yield put.resolve(setCurrentOverlay("no-overlay"));

		// IF REAL THING
		if (process.env.NODE_ENV === "production") {
			yield call(delay, 15000);
		}

		yield put.resolve(
			setReaderState(ReaderStateOptions.watchedMostOfVideo)
		);

		if (process.env.NODE_ENV === "production") {
			videoWiggleEffect.push(yield fork(videoWiggleSaga));
			videoWiggleEffect.push(
				yield fork(helperInstructionSaga, false, false, false, true)
			);
		}

		yield put({ type: SPINNER_HIDE });

		yield take(FINISH_VIDEO_CLICKED);
		yield call(playSound, "/audio/complete.mp3");
	}

	if (videoWiggleEffect.length >= 1) {
		yield cancel(...videoWiggleEffect);
	}

	let recorder = yield select(getRecorder);
	yield call(recorder.initialize);

	// yield put.resolve(setReaderState(ReaderStateOptions.awaitingStart));

	effects.push(yield fork(hideVolumeSaga));

	// Put the intro instruction sequence...

	yield call(introInstructionSaga, book);

	helperEffect.push(yield fork(helperInstructionSaga, true, false, false));

	// set a 8 second saga in background

	yield cancel(...earlyExitEffect); // allow for new exit thing

	// before assessment has started, clicking exit immediately quits app
	// I guess. We will probably change this
	const { exit } = yield race({
		exit: take(EXIT_CLICKED),
		startAssessment: take(START_RECORDING_CLICKED)
	});

	// cancel that saga.
	if (helperEffect.length >= 1) {
		yield cancel(...helperEffect);
	}

	yield call(stopAudio);

	yield put.resolve(hideVolumeIndicator());

	// the app will end :O
	if (exit) {
		yield* redirectToHomepage();
	}

	// now we start the assessment for real
	effects.push(yield takeLatest(EXIT_CLICKED, exitClick));

	yield call(
		sendEmail,
		`${isDemo ? "Demo" : "Real student session"} started`,
		`${isDemo ? "Demo" : "Real student"} started`,
		"philesterman@gmail.com"
	); // move here so don't break

	// TODO: convert the countdown to saga!!!!
	yield put.resolve(setPageNumber(1));
	yield put.resolve(setReaderState(ReaderStateOptions.countdownToStart));

	yield playSoundAsync("/audio/recording_countdown.mp3");

	if (!DEV_DISABLE_VOICE_INSTRUCTIONS) {
		let countdown = 3;
		while (countdown > 0) {
			yield put(setCountdownValue(countdown));
			yield call(delay, 1000);
			countdown--;
		}
	}

	// yield put(setCurrentSound('/audio/book_intro.mp3'))

	yield put.resolve(setCurrentModal("no-modal"));

	yield put.resolve(setShowSkipPrompt(true));

	yield put.resolve(setReaderState(ReaderStateOptions.inProgress));

	if (isWarmup) {
		yield call(playSoundAsync, "/audio/warmup/w-4.mp3");
	} else {
		if (hasSilentReading(book)) {
			yield call(playSound, "/audio/silent-reading-page-three.mp3");
		} else {
			yield call(playSound, "/audio/now-recording-read.mp3");
		}
	}

	// this ensures that effects are canceleld
	// while (true) {
	//   const {exit} = yield race({
	//     exit:             take(EXIT_CLICKED),
	//     assessmentResult: call(assessmentSaga),
	//   })

	//   if (exit) {
	//     yield call(exitClick)
	//   } else {

	//   }
	// }
	// starts the recording assessment flow
	effects.push(yield fork(assessmentSaga));

	// set up skipping
	effects.push(yield takeLatest(SKIP_CLICKED, skipClick));

	const { endRecording } = yield race({
		turnItIn: take(TURN_IN_CLICKED),
		endRecording: take(STOP_RECORDING_CLICKED)
	});

	// to hide the comp pause modal
	yield put.resolve(setCurrentModal("no-modal"));

	recorder = yield select(getRecorder);

	yield put.resolve(setCurrentOverlay("overlay-spinner"));

	yield put({ type: SPINNER_SHOW });

	const recordingURL = yield* haltRecordingAndGenerateBlobSaga(
		recorder,
		false,
		false
	);

	yield put({ type: SPINNER_HIDE });

	yield put.resolve(setCurrentOverlay("no-overlay"));

	yield clog("url for recording!!!", recordingURL);

	let recordingBlob;

	try {
		recordingBlob = recorder.getBlob();
	} catch (err) {
		recordingBlob = "it broke";
		yield clog("err:", err);
	}

	let blobAndPrompt;
	let fetchedPrompt;
	let compBlobArray;

	if (endRecording) {
		yield put.resolve(setShowSkipPrompt(false));

		yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));

		yield call(playSound, "/audio/complete.mp3");

		// now start submitting it!

		effects.push(
			yield fork(turnInAudio, recordingBlob, assessmentId, false, 0)
		);

		//  reset recorder
		let recorder = yield select(getRecorder);
		yield call(recorder.reset);
		recorder = yield select(getRecorder);
		yield call(recorder.initialize);

		yield call(delay, 300);

		if (isWarmup) {
			yield playSound("/audio/warmup/w-6-1.mp3");
		} else {
			yield playSound("/audio/VB/min/VB-now-questions.mp3");
		}

		yield put.resolve(setInOralReading(false));

		let numQuestions = yield select(getNumQuestions);

		if (hasSilentReading(book)) {
			numQuestions = book.numOralReadingQuestions;
		}

		const uploadEffects = [];

		effects.push(
			(compBlobArray = yield fork(
				definedCompSaga,
				numQuestions,
				assessmentId,
				uploadEffects,
				false
			))
		);

		yield clog("okay, waiting ");

		yield take(FINAL_COMP_QUESTION_ANSWERED);

		yield put.resolve(setShowSkipPrompt(false));

		yield cancel(...uploadEffects);

		yield clog("okay, GOT IT ");

		yield put({ type: SPINNER_HIDE });

		yield put.resolve(setInComp(false));

		//  A possible additional silent reading + comp section...
		if (hasSilentReading(book)) {
			yield put.resolve(setInSilentReading(true));
			yield put.resolve(setInOralReading(true));

			// START: the silent reading of the book
			yield put.resolve(
				setReaderState(ReaderStateOptions.playingBookIntro)
			);

			yield call(playSound, "/audio/now-silent-read-01.mp3");

			yield put.resolve(
				setReaderState(ReaderStateOptions.talkingAboutStopButton)
			);

			yield call(playSound, "/audio/now-silent-read-02.mp3");

			yield put.resolve(
				setReaderState(ReaderStateOptions.awaitingFinishBook)
			);

			yield take(STOP_RECORDING_CLICKED);
			yield put.resolve(setCurrentModal("no-modal"));
			yield call(playSound, "/audio/complete.mp3");

			yield put.resolve(setInSilentReading(false));
			yield put.resolve(setInOralReading(false));

			// START the next round of questions for the book
			yield call(playSound, "/audio/silent-3.mp3");

			const newNumQuestions = book.numQuestions; // total

			const newUploadEffects = [];

			effects.push(
				(compBlobArray = yield fork(
					definedCompSaga,
					newNumQuestions,
					assessmentId,
					newUploadEffects,
					true
				))
			);

			yield clog("okay, waiting ");

			yield take(FINAL_COMP_QUESTION_ANSWERED);

			yield put.resolve(setShowSkipPrompt(false));

			yield cancel(...newUploadEffects);

			yield clog("okay, GOT IT ");

			yield put({ type: SPINNER_HIDE });

			yield put.resolve(setInComp(false));
		}

		// Spelling!
		yield put.resolve(setInSpelling(true));
		yield put.resolve(setSpellingAnswerGiven(false));

		yield call(spellingInstructionSaga);

		yield call(playSpellingQuestionSaga);

		yield put.resolve(setShowSkipPrompt(true));

		effects.push(
			yield takeLatest(
				NEXT_WORD_CLICKED,
				questionIncrementSaga,
				"spelling"
			)
		);

		effects.push(
			yield takeLatest(
				PREVIOUS_WORD_CLICKED,
				questionDecrementSaga,
				"spelling"
			)
		);

		yield take(FINAL_SPELLING_QUESTION_ANSWERED);

		yield put.resolve(setShowSkipPrompt(false));

		yield put.resolve(setInSpelling(false));
		// End Spelling

		yield put.resolve(setCurrentModal("modal-done"));

		yield call(delay, 200);

		if (isWarmup) {
			yield playSoundAsync("/audio/warmup/w-12.mp3");
		} else {
			yield playSoundAsync("/audio/VB/VB-done.mp3");
		}
	}

	compBlobArray = compBlobArray || "";

	// do not delete, this is import :)
	if (endRecording) {
		yield take(TURN_IN_CLICKED);
	}

	yield cancel(...effects);

	yield clog("recordingBlob:   ", recordingBlob);
	yield clog("compblogArray:   ", compBlobArray);

	return [recordingBlob, compBlobArray];
}

function* rootSaga() {
	const { payload: { isDemo } } = yield take(IS_DEMO_SET);
	const { payload: { bookKey } } = yield take(BOOK_KEY_SET);
	const { payload: { isWarmup } } = yield take(IS_WARMUP_SET);

	yield clog("isDemo: ", isDemo);

	yield clog("bookKey: ", bookKey);

	yield clog("Root Saga Started");

	yield clog("Generating assessment... bookKey:", bookKey);
	const assessmentId = yield requestNewAssessment(bookKey).catch(
		e => e.request
	); // TODO

	yield clog("HERE I AM : ", assessmentId);

	yield clog("assessmentID is: ", assessmentId);

	// yield call(setAssessmentID, assessmentId);

	yield put(setAssessmentID(assessmentId + 1));

	yield clog("Assessment ID:", assessmentId);

	// if isMobileDevice, halt
	const isMobile = yield call(isMobileDevice);
	if (isMobile) {
		window.location.href = "/mobile_halt";
		take("ickkk");
	}

	// CREATE THE USER

	// $.ajax({
	// 	url: `/auth/phil_setup_demo?book_key=${bookKey}&student_name=${studentName}`,
	// 	type: "post"
	// }).fail(function(xhr, status, err) {
	// 	console.log(err);
	// });

	// Call Phil to alert if it's a live student test

	if (!isDemo) {
		yield clog("Call if in production...");
		yield call(sendCall);
	}

	/*
   ****************
   * watchers
   *****************
   */
	// yield* audioEffectsSaga()

	yield takeLatest(HEAR_RECORDING_CLICKED, function*() {
		yield put(setCurrentModal("modal-playback"));
		yield call(stopAudio);
	});

	// yield takeLatest(PERMISSIONS_ARROW_CLICKED, function* () {
	//   yield call(playSound, '/audio/click_allow_button.mp3')
	// })

	/*
   ****************
   * main race
   *****************
   */
	yield clog("Race About To Start");
	while (true) {
		const { restartAssessment, recordingBlobArray, quit } = yield race({
			restartAssessment: take(RESTART_RECORDING_CLICKED),
			recordingBlobArray: call(assessThenSubmitSaga, assessmentId),
			quit: take("QUIT_ASSESSMENT_AND_DESTROY")
		});
		yield clog("Race Finished");

		yield clog("made it here 6");

		if (quit) {
			window.location.href = "/"; // eslint-disable-line
			return;
		}

		if (restartAssessment) {
			yield clog("here i am?????");
			const recorder = yield select(getRecorder);
			if (recorder) {
				yield call(recorder.reset);
			}
			yield put.resolve(setCurrentModal("no-modal"));
			yield put(setCurrentOverlay("no-overlay"));
		} else {
			const recordingBlob = recordingBlobArray[0];
			const compBlobArray = recordingBlobArray[1];
			const numBlobs = compBlobArray.length;

			yield put({ type: SPINNER_SHOW });

			yield playSound("/audio/complete.mp3");

			// const turnedIn = yield* turnInAudio(recordingBlob, assessmentId, false, 0)

			let turnInCheck = true; // fake, defaulting to true.

			const endedInOralReading = yield select(getInOralReading);

			yield clog("endedInOralReading: ", endedInOralReading);
			if (endedInOralReading) {
				yield* turnInAudio(recordingBlob, assessmentId, false, 0);
			}

			// let compTurnedIn = []

			// for(let i = 0; i <=  numBlobs; i++) {
			//   const compBlob = compBlobArray[i]

			//   const newResult = yield* turnInAudio(compBlob, assessmentId, true, i + 1)
			//   compTurnedIn.push(newResult)
			// }

			yield put({ type: SPINNER_HIDE });

			// success! TODO better checking of compTurnedIn
			// if (turnedIn && compTurnedIn) {
			if (turnInCheck) {
				if (isWarmup) {
					yield clog("turned it in!");

					// Mark it as completed
					const assID = yield getLastAssessmentID().catch(
						e => e.request
					); // TODO

					const res = yield call(markCompleted, assID);
					yield clog("marked it as completed!: ", res);

					if (!res) {
						yield call(
							sendEmail,
							"Network timeout failed to mark as completed",
							"Network timeout failed to mark as completed...",
							"philesterman@gmail.com"
						); // move here so don't break
					}

					yield put(setAssessmentSubmitted(true));

					if (isWarmup) {
						yield call(playSound, "/audio/warmup/w-13.mp3");
					} else {
						yield call(playSound, "/audio/celebration.mp3");
					}

					yield put.resolve(setIsWarmup(false));
					yield call(assessThenSubmitSaga, assessmentId);
				}

				yield clog("turned it in!");
				yield call(playSound, "/audio/complete.mp3");

				// Mark it as completed
				const assID = yield getLastAssessmentID().catch(e => e.request); // TODO

				const res = yield call(markCompleted, assID);
				yield clog("marked it as completed!: ", res);

				yield put(setAssessmentSubmitted(true));

				yield call(playSound, "/audio/celebration.mp3");

				if (isWarmup) {
					yield clog("in the ending warmup sequence...");
					yield call(delay, 500);
					yield put.resolve(setCurrentOverlay("overlay-submitted"));
				} else if (isDemo) {
					yield clog("oh hey you r done");

					window.location.href = "/reports/sample";
					yield put({ type: SPINNER_SHOW });

					// TODO where to redirect?
					// window.location.href = "/reports/1"
				} else {
					yield clog("in the ending real thing sequence...");
					yield call(delay, 500);
					yield put.resolve(setCurrentOverlay("overlay-submitted"));
					return;
				}

				yield put(setReaderState(ReaderStateOptions.submitted));

				yield take("NEVER_PASS");

				// fail! allow option to turn in again?
			} else {
				yield clog("could not turn it in :/");

				// Keep them moving forward anyway...
				yield call(
					sendEmail,
					"Just failed to upload to s3... ",
					"s3 Upload Failure",
					"philesterman@gmail.com"
				); // move here so don't break

				window.location.href = "/reports/sample";
				yield put({ type: SPINNER_SHOW });
			}
		} // END if (restartAssessment)
	} // END while (true)
} // END function* rootSaga()

export default rootSaga;
