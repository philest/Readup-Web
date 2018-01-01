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
	getIsLiveDemo,
	getClass
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
	YES_CLICKED,
	NO_CLICKED,
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
	SOUND_CHECK_FINISHED,
	SKIP_CLICKED,
	SHOW_SKIP_PROMPT_SET,
	ASSESSMENT_ID_SET,
	AVATAR_CLICKED,
	FINISH_VIDEO_CLICKED,
	IS_WARMUP_SET,
	SPELLING_QUESTION_NUMBER_SET,
	IN_SILENT_READING_SET,
	RESUME_CLICKED,
	COMP_PAUSE_CLICKED,
	SECTION_SET,
	PLAYING_IMMEDIATE_PROMPT_SET,
	setStudents,
	setAssessments,
	setTeacherSignature,
	setSection,
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
	setWrittenCompInput,
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
	PromptAudioOptions,
	SectionOptions,
	FormatOptions,
	Format
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
	getAssessmentID,
	getWrittenQuestionNumber,
	getUserId
} from "./selectors";

import assessmentSaga from "./assessmentSaga";

import {
	compPauseAssessmentSaga,
	resumeAssessmentSaga,
	pauseAssessmentSaga
} from "./assessmentSaga";

import {
	sendEmail,
	sendCall,
	getAssessmentData,
	getTeacher,
	getAllStudents,
	getAllAssessments
} from "../../ReportsInterface/emailHelpers";

const QUESTION_CHANGE_DEBOUNCE_TIME_MS = 200;
const MAX_NUM_PROMPTS = 2;

export const SKIPPED_SECTIONS_IN_WARMUP_LIST = [SectionOptions.compOralSecond];

function getSectionsList(book) {
	if (book.brand === "FP" || book.stepLevel <= 5) {
		return {
			1: SectionOptions.oralReadingFullBook,
			2: SectionOptions.compOralFirst,
			3: SectionOptions.spelling
		};
	} else if (book.stepLevel <= 8) {
		return {
			1: SectionOptions.oralReadingPartialAtStart,
			2: SectionOptions.compOralFirst,
			3: SectionOptions.silentReadingPartialAtEnd,
			4: SectionOptions.compOralSecond,
			5: SectionOptions.spelling
		};
	} else if (book.stepLevel <= 12) {
		return {
			1: SectionOptions.silentReadingFullBook,
			2: SectionOptions.compWritten,
			3: SectionOptions.compOralFirst,
			4: SectionOptions.oralReadingPartialAtEnd,
			5: SectionOptions.spelling
		};
	} else {
		return false;
		console.log(`book ${book} not detected`);
	}
}

function* celebrationSaga() {
	yield call(delay, 350);

	yield put.resolve(setReaderState(ReaderStateOptions.finishedAssessment));

	yield put.resolve(setCurrentModal("no-modal"));

	yield call(playSound, "/audio/celebration.mp3");
}

function* playSectionSaga(
	section,
	effects,
	helperEffect,
	earlyExitEffect,
	isWarmup,
	isDemo,
	book,
	assessmentId
) {
	// Set the new section
	yield put.resolve(setSection(section));

	if (section === SectionOptions.oralReadingFullBook) {
		yield* oralReadingSaga(
			effects,
			helperEffect,
			earlyExitEffect,
			isWarmup,
			isDemo,
			false, //isPartialOralReading,
			true, //isStartsWithOralReading,
			assessmentId
		);
	} else if (section === SectionOptions.oralReadingPartialAtStart) {
		yield* oralReadingSaga(
			effects,
			helperEffect,
			earlyExitEffect,
			isWarmup,
			isDemo,
			true, //isPartialOralReading,
			true, //isStartsWithOralReading,
			assessmentId
		);
	} else if (section === SectionOptions.oralReadingPartialAtEnd) {
		yield* oralReadingSaga(
			effects,
			helperEffect,
			earlyExitEffect,
			isWarmup,
			isDemo,
			true, //isPartialOralReading,
			false, //isStartsWithOralReading,
			assessmentId
		);
	} else if (section === SectionOptions.silentReadingFullBook) {
		yield* silentReadingSaga(
			effects,
			helperEffect,
			true //isFullBook
		);
	} else if (section === SectionOptions.silentReadingPartialAtEnd) {
		yield* silentReadingSaga(
			effects,
			helperEffect,
			false //isFullBook
		);
	} else if (section === SectionOptions.compOralFirst) {
		yield* newCompSaga(effects, false, isWarmup, book); // isSilent: false
	} else if (section === SectionOptions.compOralSecond) {
		yield* newCompSaga(effects, true, isWarmup, book); // isSilent: true
	} else if (section === SectionOptions.compWritten) {
		yield* writtenCompSaga(effects);
	} else if (section === SectionOptions.spelling) {
		yield* spellingSaga(effects);
	} else {
		yield clog("WARN: Did not detect a section called :", section);
	}
}

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
	try {
		const presign = yield getS3Presign(assessmentId, isCompBlob);
		const res = yield sendAudioToS3(blob, presign, isCompBlob, questionNum);
		yield clog("yay response!", res);
		return yield res;
	} catch (err) {
		yield clog("turnInAudio error ERR:", err, err.request);
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

		if (book.stepLevel >= 8) {
			yield put.resolve(
				setQuestionNumber(book.numOralReadingQuestions + 1 + 1) // extra for retell
			);
		} else if (book.stepLevel >= 6) {
			yield put.resolve(
				setQuestionNumber(book.numOralReadingQuestions + 1) // skip to first Q in second part
			);
		}

		// halt the recorder if it's still going
		let recorder = yield select(getRecorder);

		if (
			recorder &&
			recorder.rtcRecorder &&
			(recorder.recording || recorder.rtcRecorder.state === "paused")
		) {
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

			const assessmentID = yield select(getAssessmentID);

			const currQ = yield select(getQuestionNumber);

			uploadEffects.push(
				yield fork(turnInAudio, newBlob, assessmentID, true, currQ)
			);

			yield call(delay, 1000);

			yield cancel(...uploadEffects);
		}

		yield clog("made it here???");

		yield put({ type: FINAL_COMP_QUESTION_ANSWERED });
	}

	const inSpelling = yield select(getInSpelling);

	if (inSpelling) {
		yield call(playSound, "/audio/complete.mp3");
		yield call(delay, 500);

		yield put.resolve(
			setSpellingQuestionNumber(book.numSpellingQuestions) // skip to first Q in second part
		);

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

export function* questionIncrementSaga(
	section,
	spellingEffects,
	isSilentReading,
	uploadEffects
) {
	yield clog("here in QUESTION_INCREMENT........: ", section);

	yield call(playSound, "/audio/complete.mp3");

	yield call(delay, QUESTION_CHANGE_DEBOUNCE_TIME_MS);

	// if we just answered the last question, exit spelling

	if (section === "spelling") {
		const spellingQuestionNumber = yield select(getSpellingQuestionNumber);
		const book = yield select(getBook);

		const isWarmup = yield select(getIsWarmup);
		let newBlob;

		if (
			book.numSpellingQuestions === spellingQuestionNumber ||
			(isWarmup && spellingQuestionNumber === 2)
		) {
			yield put({ type: FINAL_SPELLING_QUESTION_ANSWERED });
			return;
		}
	}

	if (section === "comp") {
		const questionNumber = yield select(getQuestionNumber);
		const book = yield select(getBook);

		const isWarmup = yield select(getIsWarmup);

		const assessmentID = yield select(getAssessmentID);

		const numQuestionsInSection = getNumQuestionsinThisCompSection(
			isWarmup,
			isSilentReading,
			book
		);

		let newBlob;
		const recorder = yield select(getRecorder);

		try {
			newBlob = recorder.getBlob();
		} catch (err) {
			yield clog("err: ", err);
			newBlob = "it broke";
		}

		// turn in the blob
		// reset the recorder

		if (questionNumber < numQuestionsInSection) {
			uploadEffects.push(
				yield fork(
					turnInAudio,
					newBlob,
					assessmentID,
					true,
					questionNumber
				)
			);
			yield* resetRecorderSaga();
		} else {
			yield* turnInFinalCompSaga(newBlob, assessmentID, questionNumber);
			yield* resetRecorderSaga();
			yield cancel(...uploadEffects);
			yield put({ type: FINAL_COMP_QUESTION_ANSWERED });
			yield put.resolve(incrementQuestion(section));
			return;
		}
	}

	yield put.resolve(incrementQuestion(section));

	if (section === "writtenComp") {
		yield put.resolve(setWrittenCompInput(""));
	}

	// redisable button
	if (section === "spelling") {
		yield put.resolve(setSpellingAnswerGiven(false));
		yield call(playSpellingQuestionSaga, false);
	}

	if (section === "comp") {
		const questionNumber = yield select(getQuestionNumber);
		yield* compQuestionSaga(questionNumber, false);
	}
}

export function* questionDecrementSaga(section) {
	yield clog("here in QUESTION_DECREMENT........: ", section);

	yield call(playSoundAsync, "/audio/bamboo.mp3");

	yield call(delay, QUESTION_CHANGE_DEBOUNCE_TIME_MS);

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

	if (section === "writtenComp") {
		const assessmentID = yield select(getAssessmentID);

		const assessment = yield getAssessmentData(assessmentID).catch(
			e => e.request
		);

		if (assessment && assessment.student_written_responses) {
			yield clog("assessment: ", assessment);
			yield clog(
				"student_written_responses: ",
				assessment.student_written_responses
			);

			const writtenQuestionNumber = yield select(
				getWrittenQuestionNumber
			);
			yield clog(
				"prev written response: ",
				assessment.student_written_responses[writtenQuestionNumber - 1]
			);

			yield put.resolve(
				setWrittenCompInput(
					assessment.student_written_responses[writtenQuestionNumber]
				)
			);
		} else {
			yield put.resolve(setWrittenCompInput(""));
		}
	}

	if (section === "comp") {
		const questionNumber = yield select(getQuestionNumber);
		yield* playCompQuestionSaga(questionNumber, false, true); // not isHearAgais, but yes isBack
	}

	// redisable button
	if (section === "spelling") {
		yield put.resolve(setSpellingAnswerGiven(true));
		yield call(playSpellingQuestionSaga, true);
	}
}

function* playSpellingQuestionSaga(isHearAgain) {
	let audiofile;
	const spellingQuestionNumber = yield select(getSpellingQuestionNumber);
	const book = yield select(getBook);
	// audiofile = `/audio/${book.bookKey}/spelling/${2}.mp3`

	let spellingGroupNumber = book.spellingObj.libraryIndex;
	if (book.stepSeries === "PURPLE") {
		spellingGroupNumber -= 4;
	}

	if (book.stepSeries === "PURPLE") {
		audiofile = `/audio/purple/spelling/group${spellingGroupNumber}/${spellingQuestionNumber}.mp3`;
	} else {
		audiofile = `/audio/spelling-group-${spellingGroupNumber}/${spellingQuestionNumber}.mp3`;
	}

	const isWarmup = yield select(getIsWarmup);
	if (isWarmup && spellingQuestionNumber === 1) {
		audiofile = "/audio/warmup/w-10.mp3";
	} else if (isWarmup && spellingQuestionNumber === 2) {
		audiofile = "/audio/warmup/w-11.mp3";
	}

	if (spellingQuestionNumber === 2 && !isHearAgain) {
		yield call(playSound, "/audio/nice-job.mp3");
		yield call(playSound, "/audio/remember-say-words.mp3");
		yield call(delay, 200);
	}

	// halfway point motivation
	if (
		((spellingGroupNumber <= 2 && spellingQuestionNumber === 8) ||
			(spellingGroupNumber > 2 && spellingQuestionNumber === 10)) &&
		!isHearAgain
	) {
		yield call(playSound, "/audio/halfway-through-spelling.mp3");
		yield call(delay, 120);
	}

	// ending motivation
	if (
		((spellingGroupNumber <= 2 && spellingQuestionNumber === 12) ||
			(spellingGroupNumber > 2 && spellingQuestionNumber === 16)) &&
		!isHearAgain
	) {
		yield call(playSound, "/audio/couple-more-words-spelling.mp3");
		yield call(delay, 50);
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
	isName,
	isSoundCheck
) {
	let numAttempts = 0;

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
		yield call(delay, 95000);
		yield call(playSoundAsync, "/audio/gen/instruct-2.mp3");
	} else if (isName) {
		while (true) {
			yield call(delay, 19500);
			yield call(playSoundAsync, "/audio/gen/instruct-1.mp3");
		}
	} else if (isSoundCheck) {
		while (numAttempts <= 3) {
			yield call(delay, 8000);
			yield call(playSoundAsync, "/audio/additions/sound-check.mp3");
			numAttempts += 1;
		}
		yield put({ type: NO_CLICKED });
	}
}

function* generalHearAgain() {
	//TODO build this
}

// wrapper that cancels side effects that interrupt, then restarts saga.
function* hearIntroAgainSaga(
	helperEffect,
	book,
	isOral,
	isStartsWithOralReading,
	isFull
) {
	yield clog("in hear again saga...");

	if (helperEffect.length >= 1) {
		yield cancel(...helperEffect);
	}

	const isWarmup = yield select(getIsWarmup);
	const isPartialOralReading = hasSilentReading(book);

	if (isStartsWithOralReading) {
		yield call(bookIntroSaga, book);
	}

	if (isOral) {
		yield* oralReadingInstructionSaga(
			isWarmup,
			isPartialOralReading,
			isStartsWithOralReading
		);
	} else {
		yield* silentReadingInstructionSaga(isFull);
	}
}

function* hearQuestionAgainSaga() {
	const isWarmup = yield select(getIsWarmup);
	const questionNumber = yield select(getQuestionNumber);
	const inComp = yield select(getInComp);

	if (inComp) {
		yield* playCompQuestionSaga(questionNumber, true);
	} else {
		// in spelling
		yield* playSpellingQuestionSaga(true);
	}
}

function* silentReadingInstructionSaga(isFull) {
	const isWarmup = yield select(getIsWarmup);

	yield put.resolve(setInSilentReading(true));
	yield put.resolve(setInOralReading(true));

	// START: the silent reading of the book
	yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));

	if (isWarmup && !isFull) {
		yield call(playSound, "/audio/new-warmup/6.mp3");
	} else if (isWarmup && isFull) {
		yield call(
			playSound,
			"/audio/pickups/try-silent-reading-title-then.mp3"
		); // TODO
	} else if (!isFull) {
		yield call(playSound, "/audio/laura/now-read-silently-intro.mp3");
	} else {
		yield call(playSound, "/audio/gen/instruct-4.mp3");
		yield call(playSound, "/audio/gen/instruct-5.mp3");
	}

	yield put.resolve(
		setReaderState(ReaderStateOptions.talkingAboutStopButton)
	);

	yield put.resolve(showVolumeIndicator());

	if (isWarmup) {
		yield call(playSound, "/audio/pickups/just-click-finish.mp3");
	} else {
		yield call(playSound, "/audio/laura/click-finish-book.mp3");
	}

	yield call(playSound, "/audio/complete.mp3");

	yield put.resolve(setReaderState(ReaderStateOptions.awaitingFinishBook));
}

function* silentReadingSaga(effects, helperEffect, isFull) {
	let book = yield select(getBook);

	effects.push(
		yield takeLatest(
			HEAR_INTRO_AGAIN_CLICKED,
			hearIntroAgainSaga,
			helperEffect,
			book,
			false, // isOral
			false, // isStartsWithOralReading
			isFull
		)
	);

	yield* silentReadingInstructionSaga(isFull);

	yield take(STOP_RECORDING_CLICKED);

	// cancel the hear again saga...
	yield cancel(effects.slice(-1)[0]);

	yield put.resolve(hideVolumeIndicator());

	yield put.resolve(setCurrentModal("no-modal"));
	yield call(playSound, "/audio/complete.mp3");

	yield put.resolve(setInSilentReading(false));
	yield put.resolve(setInOralReading(false));
}

function* spellingSaga(effects) {
	yield put.resolve(setInSpelling(true));
	yield put.resolve(setSpellingAnswerGiven(false));

	yield call(spellingInstructionSaga);

	yield* playSpellingQuestionSaga(false);

	yield put.resolve(setShowSkipPrompt(true));

	effects.push(
		yield takeLatest(NEXT_WORD_CLICKED, questionIncrementSaga, "spelling")
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
}

function* bookIntroSaga(book) {
	const isWarmup = yield select(getIsWarmup);

	yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));
	yield put.resolve(showVolumeIndicator());

	yield clog("set it");

	yield call(stopAudio);

	if (isWarmup && !hasWrittenComp(book)) {
		yield put.resolve(setCurrentOverlay("overlay-flash-notice"));

		// yield call(playSound, "/audio/warmup/w-1.mp3");
		yield call(playSound, "/audio/helper/lets-try-practice.mp3");

		yield put.resolve(setCurrentOverlay("no-overlay"));

		yield call(playSound, "/audio/warmup/w-2.mp3");
	} else if (isWarmup && hasWrittenComp(book)) {
		yield put.resolve(setCurrentOverlay("overlay-flash-notice"));

		yield call(playSound, "/audio/helper/lets-try-practice.mp3");

		yield put.resolve(setCurrentOverlay("no-overlay"));

		yield call(playSound, "/audio/new-warmup/new-intro-1-02.mp3");
	} else if (hasWrittenComp(book)) {
		yield put.resolve(setCurrentOverlay("overlay-flash-notice"));
		yield call(playSound, "/audio/gen/instruct-3.mp3");
		yield put.resolve(setCurrentOverlay("no-overlay"));

		yield call(
			playSound,
			"/audio/helper/if-you-ever-dont-know-something.mp3"
		);

		yield put.resolve(showVolumeIndicator());
		yield call(playSound, book.introAudioSrc);
	} else {
		//standard oral reading
		yield put.resolve(setCurrentOverlay("overlay-flash-notice"));

		yield call(playSound, "/audio/helper/your-teacher-wants-to-hear.mp3");

		yield put.resolve(setCurrentOverlay("no-overlay"));

		yield call(
			playSound,
			"/audio/helper/if-you-ever-dont-know-something.mp3"
		);

		yield put.resolve(showVolumeIndicator());

		yield call(playSound, book.introAudioSrc);
	}
}

function* oralReadingInstructionSaga(
	isWarmup,
	isPartialOralReading,
	isStartsWithOralReading
) {
	yield put.resolve(setInOralReading(true));
	yield put.resolve(setInSilentReading(false));

	yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));

	if (!isStartsWithOralReading) {
		if (isWarmup) {
			yield call(playSound, "/audio/new-warmup/5.mp3");
		} else {
			yield call(playSound, "/audio/written/4.mp3");
		}
	}

	yield put.resolve(
		setReaderState(ReaderStateOptions.talkingAboutStartButton)
	);

	yield put.resolve(showVolumeIndicator());

	if (isWarmup) {
		yield call(playSound, "/audio/warmup/w-3.mp3");
		yield put.resolve(setReaderState(ReaderStateOptions.awaitingStart));
		yield call(playSound, "/audio/complete.mp3");
	} else if (isPartialOralReading) {
		yield call(playSound, "/audio/laura/click-start-page-3.mp3");

		yield put.resolve(
			setReaderState(ReaderStateOptions.talkingAboutStopButton)
		);

		yield call(playSound, "/audio/laura/click-stop-laura.mp3");

		yield put.resolve(setReaderState(ReaderStateOptions.awaitingStart));
		yield call(playSound, "/audio/complete.mp3");
	} else {
		// the full thing
		yield call(playSound, "/audio/intro-click-start.mp3");

		yield put.resolve(
			setReaderState(ReaderStateOptions.talkingAboutStopButton)
		);

		yield call(playSound, "/audio/intro-click-stop.mp3");

		yield put.resolve(setReaderState(ReaderStateOptions.awaitingStart));

		yield call(playSound, "/audio/complete.mp3");
	}
}

function* recordingInstructionSaga(isWarmup, isPartialOralReading) {
	yield put.resolve(setCurrentOverlay("overlay-flash-notice"));

	if (isWarmup) {
		yield call(playSound, "/audio/warmup/w-4.mp3");
	} else if (isPartialOralReading) {
		yield call(playSound, "/audio/laura/now-recording-page-3.mp3");
	} else {
		//normal
		yield call(playSound, "/audio/now-recording-read.mp3");
	}

	yield put.resolve(setCurrentOverlay("no-overlay"));
	yield call(playSound, "/audio/complete.mp3"); // IDK too much?
}

export function* countdownSaga(isSingle) {
	if (isSingle) {
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
	} else {
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
		yield put.resolve(setCurrentModal("no-modal"));
	}
}

function* spellingInstructionSaga() {
	const isWarmup = yield select(getIsWarmup);
	let book = yield select(getBook);
	// const isClickingSpelling = book.stepLevel < 10;
	const isClickingSpelling = true;

	if (isWarmup) {
		if (isClickingSpelling) {
			yield call(
				playSound,
				"/audio/helper/great-and-for-your-last-activity-just-spell.mp3"
			);

			yield call(
				playSound,
				"/audio/helper/if-you-need-to-get-rid-of-a-letter.mp3"
			);
		} else {
			yield call(playSound, "/audio/warmup/w-9.mp3");
		}
		yield put.resolve(setReaderState(ReaderStateOptions.done));

		yield call(playSound, "/audio/say-sounds-slowly.mp3");
	} else {
		if (isClickingSpelling) {
			yield call(
				playSound,
				"/audio/helper/great-and-for-your-last-activity-just-spell.mp3"
			);
		} else {
			yield call(playSound, "/audio/spelling-intro-transition.mp3");
			yield put.resolve(
				setReaderState(ReaderStateOptions.talkingAboutSpellingBox)
			);
			yield call(playSound, "/audio/spelling-intro-type-it.mp3");
		}
		yield put.resolve(setReaderState(ReaderStateOptions.done));
		yield call(playSound, "/audio/say-sounds-slowly.mp3");
		yield call(delay, 250);
		yield call(playSound, "/audio/number-one.mp3");
	}
}

function* compInstructionSaga(isWarmup) {
	yield clog("in comp inst saga");

	yield put.resolve(setPageNumber(0));
	yield put.resolve(setInComp(true));
	yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));

	if (!DEV_DISABLE_VOICE_INSTRUCTIONS) {
		yield call(delay, 500);

		if (!isWarmup) {
			yield call(playSound, "/audio/VB/min/VB-now-questions.mp3");

			yield call(delay, 500);

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
			// warmup

			yield call(playSound, "/audio/warmup/w-6-1.mp3");

			yield call(delay, 500);

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

function* turnInDuringCompSaga(uploadEffects) {
	uploadEffects.push(
		yield takeLatest(TURN_IN_CLICKED, function*() {
			yield call(playSound, "/audio/complete.mp3");
			yield put({ type: SPINNER_SHOW });

			const assessmentID = yield select(getAssessmentID);

			const res = yield call(markCompleted, assessmentID);
			yield clog("marked it as completed!: ", res);
			yield put(setAssessmentSubmitted(true));

			window.location.href = "/reports/sample";
		})
	);
}

export function getAllStartQuestionNums(book) {
	if (book.brand === "STEP" && book.stepLevel === 8) {
		return [1, book.numOralReadingQuestions + 1 + 1]; // extra for retell
	} else if (
		book.brand === "STEP" &&
		(book.stepLevel === 7 || book.stepLevel === 6)
	) {
		return [1, book.numOralReadingQuestions + 1]; // no retell
	} else {
		return [1];
	}
}

function getNumQuestionsinThisCompSection(isWarmup, isSilentReading, book) {
	let base;

	if (isWarmup) {
		base = 2;
	} else if (isSilentReading) {
		// return book.numSilentReadingQuestions;
		// for now, do a hack and just use the full thing
		base = book.numQuestions;
	} else {
		// real thing
		base = book.numOralReadingQuestions;
	}

	if (!isWarmup && book.stepLevel >= 8 && book.stepLevel <= 12) {
		base += 1; // add an extra question to the total for the retell
	}

	return base;
}

function* turnInFinalCompSaga(newBlob, assessmentId, currQ) {
	yield put({ type: SPINNER_SHOW });
	yield put.resolve(setCurrentOverlay("overlay-spinner"));

	yield clog("before turn in");

	yield* turnInAudio(newBlob, assessmentId, true, currQ); // wait for the last one

	yield clog("after turn in");

	yield put({ type: SPINNER_HIDE });
	yield put.resolve(setCurrentOverlay("no-overlay"));
}

function* resetRecorderSaga() {
	// reset the recorder each time
	let recorder = yield select(getRecorder);
	yield call(recorder.reset);
	recorder = yield select(getRecorder);
	yield call(recorder.initialize);
}

function* playCompQuestionSaga(currQ, isHearAgain, isBack) {
	if (!isHearAgain) {
		yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));
	}

	let book = yield select(getBook);
	let audioFile = book.questions[String(currQ)].audioSrc;

	const isWarmup = yield select(getIsWarmup);

	if (currQ === 2 && (!isHearAgain && !isBack)) {
		yield call(playSound, "/audio/additions/remember-look-back.mp3");
	}

	if (isWarmup && currQ === 1) {
		yield call(playSound, "/audio/warmup/w-7.mp3");
	} else if (isWarmup && currQ === 2) {
		yield call(playSound, "/audio/additions/warmup-q2.mp3");
	} else {
		yield call(playSound, audioFile);
	}

	yield put.resolve(setShowSkipPrompt(true));

	if (!isHearAgain) {
		yield put.resolve(setReaderState(ReaderStateOptions.awaitingStart));
	}
}

function* startRecordingSaga(recorder) {
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
}

function* resumeRecordingSaga(recorder) {
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

function* findPromptSaga(studentID) {
	let isLiveDemo = yield call(getIsLiveDemo);
	if (isLiveDemo) {
		yield put.resolve(setLiveDemo(true));
	}
	let waitingTime;

	if (false && process.env.NODE_ENV === "development") {
		waitingTime = 200;
	} else {
		waitingTime = isLiveDemo ? 8000 : 1000;
	}

	const { prompt, timeout } = yield race({
		prompt: call(newFetchUntilPrompt, studentID),
		timeout: call(delay, waitingTime)
	});

	return prompt;
}

function* compQuestionSaga(currQ, isPrompt) {
	yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));

	if (!isPrompt) {
		yield* playCompQuestionSaga(currQ, false);
	}

	yield put.resolve(setReaderState(ReaderStateOptions.awaitingStart));
	yield call(playSoundAsync, "/audio/complete.mp3");

	yield take(START_RECORDING_CLICKED);

	yield* countdownSaga(true);

	let recorder = yield select(getRecorder);

	if (!isPrompt) {
		yield* startRecordingSaga(recorder);
	} else {
		yield* resumeRecordingSaga(recorder);
	}

	// In middle of recording

	yield take(STOP_RECORDING_CLICKED);

	// for the physical book version
	yield put.resolve(setCurrentModal("no-modal"));

	yield call(stopAudio);

	recorder = yield select(getRecorder);

	// Pause it for the prompt fetching
	yield call(recorder.pauseRecording);
	yield put.resolve(setReaderState(ReaderStateOptions.paused));

	yield call(playSound, "/audio/complete.mp3");

	yield put.resolve(setCurrentOverlay("overlay-spinner"));

	const assessmentID = yield select(getAssessmentID);
	const assessment = yield getAssessmentData(assessmentID).catch(
		e => e.request
	);

	yield clog("assID: ", assessmentID);
	yield clog("assessment: ", assessment);

	let studentID;

	if (assessment && assessment.student_id) {
		studentID = assessment.student_id; // TODO
	}

	yield clog("studentID: ", studentID);

	const prompt = yield* findPromptSaga(studentID); // retrieve what, if any, prompt.

	yield clog("prompt: ", prompt);

	yield put.resolve(setCurrentOverlay("no-overlay"));

	yield put.resolve(setReaderState(ReaderStateOptions.playingBookIntro));

	if (prompt) {
		yield clog("111 We found a prompt!: ", prompt);

		yield put.resolve(setPrompt(prompt));

		yield* playPromptSaga(prompt, studentID);

		return yield call(compQuestionSaga, currQ, true);
	} else {
		yield clog("111 NO PROMPT FOUND");

		// reset.
		yield put.resolve(setPrompt(PromptOptions.awaitingPrompt));

		// stop it
		const compRecordingURL = yield* haltRecordingAndGenerateBlobSaga(
			recorder,
			true,
			false
		); // dont actually generate url

		yield clog("url for comp recording!!!", compRecordingURL);

		let newBlob;

		try {
			newBlob = recorder.getBlob();
		} catch (err) {
			yield clog("err: ", err);
			newBlob = "it broke";
		}

		yield put.resolve(setCurrentModal("no-modal"));

		yield put({ type: NEXT_QUESTION_CLICKED });
		// yield* questionIncrementSaga("comp");

		return newBlob;
	}
}

function* writtenCompSaga(effects) {
	yield put.resolve(setReaderState(ReaderStateOptions.inWrittenComp));

	const isWarmup = yield select(getIsWarmup);
	const testEffects = [];

	if (isWarmup) {
		yield call(playSound, "/audio/new-warmup/4.mp3");
	} else {
		yield call(playSound, "/audio/written/1.mp3");
		yield call(playSound, "/audio/written/2.mp3"); // look back at book
	}

	yield put(setCurrentModal("modal-comp"));
	yield call(playSound, "/audio/written/3.mp3");

	testEffects.push(
		yield takeLatest(
			NEXT_QUESTION_CLICKED,
			questionIncrementSaga,
			"writtenComp"
		)
	);

	testEffects.push(
		yield takeLatest(
			PREVIOUS_QUESTION_CLICKED,
			questionDecrementSaga,
			"writtenComp"
		)
	);

	yield take(FINAL_WRITTEN_COMP_QUESTION_ANSWERED);
	yield put(setCurrentModal("no-modal"));

	yield cancel(...testEffects);
}

function* newCompSaga(effects, isSilentReading, isWarmup, book) {
	if (!isSilentReading) {
		yield call(compInstructionSaga, isWarmup);
	} else {
		yield call(playSound, "/audio/laura/now-last-questions.mp3");
	}

	const questionNumber = yield select(getQuestionNumber);

	const uploadEffects = [];
	const testEffects = [];

	yield put.resolve(setInComp(true));

	testEffects.push(
		yield takeLatest(
			NEXT_QUESTION_CLICKED,
			questionIncrementSaga,
			"comp",
			null,
			isSilentReading,
			uploadEffects
		)
	);

	testEffects.push(
		yield takeLatest(
			PREVIOUS_QUESTION_CLICKED,
			questionDecrementSaga,
			"comp"
		)
	);

	testEffects.push(yield fork(compQuestionSaga, questionNumber));

	yield take(FINAL_COMP_QUESTION_ANSWERED);
	yield* compExitSaga(uploadEffects, testEffects);
}

function* compExitSaga(uploadEffects, testEffects) {
	yield put.resolve(setShowSkipPrompt(false));
	yield clog("okay, GOT IT— now canceling uploadEffects: ", uploadEffects);
	yield put({ type: SPINNER_HIDE });

	if (uploadEffects.length > 0) {
		yield cancel(...uploadEffects);
	}
	yield put.resolve(setInComp(false));
	yield clog("okay, GOT IT— now canceling testEffects: ", testEffects);
	yield cancel(...testEffects);
}

function* videoWiggleSaga() {
	yield call(delay, 90000);
	yield put.resolve(setReaderState(ReaderStateOptions.watchedFullVideo));
}

function* loginSaga() {
	const nameEffect = [];
	yield call(playSoundAsync, "/audio/gen/instruct-1.mp3");
	yield clog("in login world...");

	nameEffect.push(
		yield fork(helperInstructionSaga, false, false, false, false, true)
	);

	yield take(AVATAR_CLICKED);

	yield cancel(...nameEffect);

	yield call(playSound, "/audio/complete.mp3");
}

function* classFetchSaga() {
	const userId = yield select(getUserId);

	try {
		const [res1, res2, res3] = yield all([
			call(getTeacher, userId),
			call(getAllStudents, userId),
			call(getAllAssessments, userId)
		]);

		yield clog(res1.data, res2.data, res3.data);

		yield put.resolve(setTeacherSignature(res1.data.signature));
		yield put.resolve(setStudents(res2.data));
		yield put.resolve(setAssessments(res3.data));
	} catch (e) {
		yield clog("didnt work: ", e);
	}

	yield put.resolve(setCurrentOverlay("no-overlay"));
}

function* watchVideoSaga(videoWiggleEffect) {
	// show the video saga
	yield put.resolve(setSection(SectionOptions.video));
	yield put.resolve(hideVolumeIndicator());
	yield put.resolve(setReaderState(ReaderStateOptions.watchingVideo));
	yield put.resolve(setCurrentOverlay("overlay-spinner"));

	yield put({ type: SPINNER_SHOW });

	yield call(delay, 3500);

	yield put.resolve(setCurrentOverlay("no-overlay"));

	// IF REAL THING
	if (process.env.NODE_ENV === "development") {
		yield put.resolve(
			setReaderState(ReaderStateOptions.watchedMostOfVideo)
		);
	}

	if (process.env.NODE_ENV === "production") {
		videoWiggleEffect.push(yield fork(videoWiggleSaga));
		// removed the audio instruction because it sometimes interrupted
	}

	yield put({ type: SPINNER_HIDE });

	yield take(FINISH_VIDEO_CLICKED);
	yield call(playSound, "/audio/complete.mp3");
}

function* oralReadingSaga(
	effects,
	helperEffect,
	earlyExitEffect,
	isWarmup,
	isDemo,
	isPartialOralReading,
	isStartsWithOralReading,
	assessmentId
) {
	const book = yield select(getBook);

	effects.push(
		yield takeLatest(
			HEAR_INTRO_AGAIN_CLICKED,
			hearIntroAgainSaga,
			helperEffect,
			book,
			true, // isOral
			isStartsWithOralReading
		)
	);

	yield* oralReadingInstructionSaga(
		isWarmup,
		isPartialOralReading,
		isStartsWithOralReading
	);

	// if (isStartsWithOralReading) {
	helperEffect.push(yield fork(helperInstructionSaga, true, false, false));
	// set a 8 second saga in background
	// }

	// yield cancel(...earlyExitEffect); // allow for new exit thing

	let returnArr = [];

	returnArr = yield* oralReadingRecordingSaga(
		effects,
		helperEffect,
		isWarmup,
		isDemo,
		isPartialOralReading,
		assessmentId
	);

	// Is this breaking the url, reseting the url?
	yield* resetRecorderSaga();

	return returnArr;
}

function* oralReadingRecordingSaga(
	effects,
	helperEffect,
	isWarmup,
	isDemo,
	isPartialOralReading,
	assessmentId
) {
	let recorder = yield select(getRecorder);
	yield call(recorder.initialize);

	yield take(START_RECORDING_CLICKED);

	// cancel that saga.
	if (helperEffect.length >= 1) {
		yield cancel(...helperEffect);
	}

	// cancel the hear again saga...
	yield cancel(effects.slice(-1)[0]);

	yield call(stopAudio);

	yield put.resolve(hideVolumeIndicator());

	yield call(
		sendEmail,
		`${isDemo ? "Demo" : "Real student session"} started`,
		`${isDemo ? "Demo" : "Real student"} started`,
		"philesterman@gmail.com"
	); // move here so don't break

	// TODO: convert the countdown to saga!!!!
	yield put.resolve(setPageNumber(1));

	yield call(countdownSaga, false);

	// yield put.resolve(setCurrentOverlay("overlay-flash-notice"));

	yield put.resolve(setShowSkipPrompt(true));

	yield put.resolve(setReaderState(ReaderStateOptions.inProgress));

	const myOneEffect = [];
	myOneEffect.push(
		yield takeLatest(
			HEAR_INTRO_AGAIN_CLICKED,
			recordingInstructionSaga,
			isWarmup,
			isPartialOralReading
		)
	);

	yield* recordingInstructionSaga(isWarmup, isPartialOralReading);

	// yield put.resolve(setCurrentOverlay("no-overlay"));

	// starts the recording assessment flow
	effects.push(yield fork(assessmentSaga));

	const { endRecording } = yield race({
		turnItIn: take(TURN_IN_CLICKED),
		endRecording: take(STOP_RECORDING_CLICKED)
	});

	yield cancel(myOneEffect.slice(-1)[0]);

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

		yield put.resolve(setInOralReading(false));
	}

	return [recordingBlob, endRecording];
}

function* resetStateSaga() {
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
	yield put.resolve(setWrittenCompInput(""));

	yield put.resolve(setSpellingQuestionNumber(1));
	yield put.resolve(setWrittenQuestionNumber(1));

	yield put.resolve(setSection(SectionOptions.initializing));

	yield put(setCurrentOverlay("no-overlay"));
}

function* teacherHelpInstructions() {
	yield call(playSoundAsync, "/audio/teacher-help.mp3");
}

function* soundCheckInstructions() {
	yield call(playSoundAsync, "/audio/additions/sound-check.mp3");
}

function* canHearSaga() {
	yield call(playSound, "/audio/complete.mp3");
	yield put(setCurrentModal("no-modal"));
	yield put({ type: SOUND_CHECK_FINISHED });
}

function* cannotHearSaga() {
	yield call(playSoundAsync, "/audio/bamboo.mp3");
	yield put(setCurrentOverlay("overlay-no-sound"));
	yield take("NEVER_PASS");
}

function* soundCheckSaga(screwEffects) {
	screwEffects.push(
		yield takeLatest(HEAR_INTRO_AGAIN_CLICKED, soundCheckInstructions)
	);
	screwEffects.push(
		yield fork(
			helperInstructionSaga,
			false,
			false,
			false,
			false,
			false,
			true
		)
	);

	yield put(setCurrentModal("modal-sound-check"));

	yield call(playSoundAsync, "/audio/additions/sound-check.mp3");

	screwEffects.push(yield takeLatest(YES_CLICKED, canHearSaga));

	screwEffects.push(yield takeLatest(NO_CLICKED, cannotHearSaga));

	yield take(SOUND_CHECK_FINISHED);
}

function* bookCheckSaga() {
	yield put.resolve(setCurrentModal("modal-book-check"));

	let bookCheckEffects = [];
	bookCheckEffects.push(
		yield takeLatest(NO_CLICKED, teacherHelpInstructions)
	);

	yield call(
		playSoundAsync,
		"/audio/helper/full-teacher-give-you-a-book.mp3"
	);

	yield take(YES_CLICKED);
	yield call(playSoundAsync, "/audio/complete.mp3");

	yield cancel(...bookCheckEffects);
	yield put.resolve(setCurrentModal("no-modal"));
}

function* assessThenSubmitSaga() {
	const effects = []; // general background stuff
	const earlyExitEffect = []; // for exiting at the start
	const helperEffect = []; // deals with extra instructions

	yield call(resetStateSaga);

	const permissionsGranted = yield* getMicPermissionsSaga(); // blocks

	while (!permissionsGranted) {
		yield put(setCurrentOverlay("overlay-blocked-mic"));
		yield call(playSound, "/audio/teacher-help.mp3");
		yield take("ickkkkk");
		return;
	}

	// permission was granted!!!!
	yield put(setCurrentOverlay("no-overlay"));

	// access state
	const isDemo = yield select(getIsDemo);
	const isWarmup = yield select(getIsWarmup);

	if (isWarmup && !isDemo) {
		yield put.resolve(setCurrentOverlay("overlay-spinner"));
	}

	const hasLoggedIn = yield select(getHasLoggedIn);
	let studentName;
	const thisBook = yield select(getBook);
	let book;
	let sectionList;
	let assessmentID = yield select(getAssessmentID);
	yield clog("sectionList: ", sectionList);

	yield put.resolve(setInSpelling(true));

	// earlyExitEffect.push(yield takeLatest(EXIT_CLICKED, redirectToHomepage));
	// now we start the assessment for real
	effects.push(yield takeLatest(EXIT_CLICKED, exitClick));
	effects.push(yield takeLatest(SKIP_CLICKED, skipClick));
	effects.push(yield takeLatest(COMP_PAUSE_CLICKED, compPauseAssessmentSaga));
	effects.push(yield takeLatest(RESUME_CLICKED, resumeAssessmentSaga));
	effects.push(yield takeLatest(PAUSE_CLICKED, pauseAssessmentSaga));

	effects.push(
		yield takeLatest(HEAR_QUESTION_AGAIN_CLICKED, hearQuestionAgainSaga)
	);

	if (isDemo && !hasLoggedIn) {
		yield put.resolve(avatarClicked()); // log in for them

		let screwEffects = [];
		yield* soundCheckSaga(screwEffects); // sound check for only the real thing?
		yield cancel(...screwEffects);

		book = yield select(getBook);
		studentName = yield select(getStudentName);

		// Only create the user only once, if not warmup...
		$.ajax({
			url: `/auth/phil_setup_demo?book_key=${book.bookKey}&student_name=${studentName}`,
			type: "post"
		}).fail(function(xhr, status, err) {
			console.log(err);
		});
	}

	if (!isDemo && !hasLoggedIn) {
		yield call(classFetchSaga);
		yield put.resolve(setSection(SectionOptions.login));

		let screwEffects = [];
		yield* soundCheckSaga(screwEffects); // sound check for only the real thing?
		yield cancel(...screwEffects);

		// API stuff
		yield call(loginSaga);

		book = yield select(getBook);
		studentName = yield select(getStudentName);

		// Only create the user only once. Create here instead because they skipped warmup...
		$.ajax({
			url: `/auth/phil_setup_demo?book_key=${book.bookKey}&student_name=${studentName}`,
			type: "post"
		}).fail(function(xhr, status, err) {
			console.log(err);
		});

		yield* bookCheckSaga(); // book check for only the real thing?
	}

	book = yield select(getBook);

	sectionList = getSectionsList(book);

	const videoWiggleEffect = [];

	if (!isDemo && isWarmup) {
		yield call(watchVideoSaga, videoWiggleEffect);
	}

	if (videoWiggleEffect.length >= 1) {
		yield cancel(...videoWiggleEffect);
	}

	// Put the intro instruction sequence...

	effects.push(
		yield takeLatest(HEAR_INTRO_AGAIN_CLICKED, bookIntroSaga, book)
	);

	yield put.resolve(setSection(SectionOptions.bookIntro));

	yield call(bookIntroSaga, book);

	// cancel the hear again saga...
	yield cancel(effects.slice(-1)[0]);

	for (var sectionNum in sectionList) {
		if (
			sectionList.hasOwnProperty(sectionNum) &&
			!(
				isWarmup &&
				SKIPPED_SECTIONS_IN_WARMUP_LIST.includes(
					sectionList[sectionNum]
				)
			) // its not a section that should be skipped in warmup
		) {
			yield clog("starting to play section: ", sectionList[sectionNum]);
			yield* playSectionSaga(
				sectionList[sectionNum],
				effects,
				helperEffect,
				earlyExitEffect,
				isWarmup,
				isDemo,
				book,
				assessmentID
			);
			yield clog("finished playing section: ", sectionList[sectionNum]);
		}
	}

	yield put.resolve(setSection(SectionOptions.finished));

	yield put.resolve(setCurrentModal("modal-done"));

	yield call(delay, 200);

	if (isWarmup) {
		yield call(
			playSoundAsync,
			"/audio/helper/great-thats-the-end-of-practice.mp3"
		);
	} else {
		yield call(playSoundAsync, "/audio/VB/VB-done.mp3");
	}

	let compBlobArray, recordingBlob, endRecording;

	endRecording = true; // HACK
	recordingBlob = ""; // HACK

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

	// Possibly in the future, create the assessment HERE
	let assessmentID = yield getLastAssessmentID().catch(e => e.request); // TODO
	assessmentID += 1; // account for the newly created one
	yield put(setAssessmentID(assessmentID));

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
			recordingBlobArray: call(assessThenSubmitSaga),
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

			yield call(playSound, "/audio/complete.mp3");

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

					if (!isWarmup) {
						// Mark it as completed
						const assessmentID = yield select(getAssessmentID);

						const res = yield call(markCompleted, assessmentID);
						yield clog("marked it as completed!: ", res);

						if (!res) {
							yield call(
								sendEmail,
								"Network timeout failed to mark as completed",
								"Network timeout failed to mark as completed...",
								"philesterman@gmail.com"
							); // move here so don't break
						}
					}

					yield put(setAssessmentSubmitted(true));

					if (isWarmup) {
						yield call(playSound, "/audio/warmup/w-13.mp3");
					} else {
						yield call(playSound, "/audio/celebration.mp3");
					}

					yield put.resolve(setIsWarmup(false));
					yield call(assessThenSubmitSaga);
				}

				yield clog("turned it in!");
				yield call(playSound, "/audio/complete.mp3");

				// Mark it as completed
				const assessmentID = yield select(getAssessmentID);

				const res = yield call(markCompleted, assessmentID);
				yield clog("marked it as completed!: ", res);

				yield put(setAssessmentSubmitted(true));

				if (isDemo) {
					yield clog("oh hey you r done");

					yield call(playSound, "/audio/celebration.mp3");

					window.location.href = "/reports/sample";
					yield put({ type: SPINNER_SHOW });
				} else {
					yield clog(
						"in the ending sequence... isWarmup?: ",
						isWarmup
					);

					yield* celebrationSaga();

					yield takeLatest(EXIT_CLICKED, redirectToHomepage);

					return;
					yield take("NEVER_PASS");
				}

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
