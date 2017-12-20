// @flow
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import * as actionCreators from "./state";
import { bindActionCreators } from "redux";

import Reader from "./Reader";
import Recorder from "./recorder";

import { ReaderStateOptions, SectionOptions } from "./types";

import styles from "./styles.css";

import CompModal from "./modals/CompModal";
import SoundCheckModal from "./modals/SoundCheckModal";
import BookCheckModal from "./modals/BookCheckModal";
import DoneModal from "./modals/DoneModal";
import PausedModal from "./modals/PausedModal";
import CompPausedModal from "./modals/CompPausedModal";
import ExitModal from "./modals/ExitModal";
import MicModal from "./modals/MicModal";
import PlaybackModal from "./modals/PlaybackModal";

import IntroOverlay from "./overlays/IntroOverlay";
import BlockedMicOverlay from "./overlays/BlockedMicOverlay";
import SubmittedOverlay from "./overlays/SubmittedOverlay";
import DemoSubmittedOverlay from "./overlays/DemoSubmittedOverlay";
import PermissionsOverlay from "./overlays/PermissionsOverlay";
import CountdownOverlay from "./overlays/CountdownOverlay";
import SpinnerOverlay from "./overlays/SpinnerOverlay";
import DisabledSTEPOverlay from "./overlays/DisabledSTEPOverlay";
import NoSoundOverlay from "./overlays/NoSoundOverlay";
import WarmupOverlay from "./overlays/WarmupOverlay";

import { Modal } from "react-bootstrap";

import { HashRouter, Route, Redirect } from "react-router-dom";

import { fpBook, fireflyBook } from "./state";

// TODO PUT IN OWN FILE

// how many images in advance to load
const PRELOAD_IMAGES_ADVANCE = 3;

function mapStateToProps(state) {
  return {
    // micEnabled: state.reader.micEnabled,
    pageNumber: state.reader.pageNumber,
    questionNumber: state.reader.questionNumber,
    readerState: state.reader.readerState,
    book: state.reader.book,
    numQuestions: state.reader.book.numQuestions,
    prompt: state.reader.prompt,
    pauseType: state.reader.pauseType,
    hasRecordedSomething: state.reader.hasRecordedSomething,
    recorder: state.reader.recorder, // TODO probably shouldn't have access
    recordingURL: state.reader.recordingURL,
    compRecordingURL: state.reader.compRecordingURL,
    currentShowModal: state.reader.currentModalId,
    currentShowOverlay: state.reader.currentOverlayId,
    showSpinner: state.reader.showSpinner,
    countdownValue: state.reader.countdownValue,
    inComp: state.reader.inComp,
    inSpelling: state.reader.inSpelling,
    inOralReading: state.reader.inOralReading,
    inSilentReading: state.reader.inSilentReading,
    showVolumeIndicator: state.reader.showVolumeIndicator,
    showSkipPrompt: state.reader.showSkipPrompt,
    isLiveDemo: state.reader.isLiveDemo,
    spellingAnswerGiven: state.reader.spellingAnswerGiven,
    spellingInput: state.reader.spellingInput,
    spellingQuestionNumber: state.reader.spellingQuestionNumber,
    writtenQuestionNumber: state.reader.writtenQuestionNumber,
    writtenCompInput: state.reader.writtenCompInput,
    assessmentID: state.reader.assessmentID,
    assessmentSubmitted: state.reader.assessmentSubmitted,
    micPermissionsStatus: state.reader.micPermissionsStatus,
    hasLoggedIn: state.reader.hasLoggedIn,
    studentName: state.reader.studentName,
    isWarmup: state.reader.isWarmup,
    section: state.reader.section,
    teacherSignature: state.reader.teacherSignature,
    students: state.reader.students,
    assessments: state.reader.assessments
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch),
    exitAndUploadRecording() {
      dispatch(actionCreators.turnInClicked());
    },
    quitAssessment() {
      dispatch({ type: "QUIT_ASSESSMENT_AND_DESTROY" });
    }
  };
}

// todo
export class StudentDashboard extends React.Component {
  static propTypes = {
    // studentName: PropTypes.string.isRequired, // this is passed from the Rails view
    isDemo: PropTypes.bool,
    storyID: PropTypes.string,
    routerIsWarmup: PropTypes.bool,
    userID: PropTypes.string
  };

  constructor(props, _railsContext) {
    super(props);
  }

  componentWillMount() {
    this.props.actions.setIsDemo(this.props.isDemo);
    this.props.actions.setBookKey(this.props.storyID);
    this.props.actions.setBook(this.props.storyID);
    this.props.actions.setUserId(this.props.userID);
    // this.props.actions.setStudentName(this.props.studentName);

    console.log("isWarmup: ", this.props.isWarmup);

    this.props.actions.setIsWarmup(this.props.routerIsWarmup === true);

    if (!Recorder.browserSupportsRecording()) {
      alert(
        "Your browser cannot record audio. Please switch to Chrome or Firefox."
      );
      return;
    }

    // This stuff kicks off the process, gets state out of initializing
  }

  componentDidUpdate(nextProps) {
    console.log(
      "ReaderManager updated to pageNumber:  " + this.props.pageNumber
    );
  }

  /* Rendering */
  // Returns a Reader component with /prop/er props based on page number
  renderReaderComponentWithProps = () => {
    // if (this.props.readerState === ReaderStateOptions.submitted) {
    //   return <DemoSubmittedModal />
    // }

    const basicReaderProps = {
      // stuff that doesn't change with page number
      studentName: this.props.studentName,
      pathname: this.props.location.pathname,
      isDemo: this.props.isDemo,
      coverImageURL: this.props.book.coverImage,
      bookTitle: this.props.book.title,
      bookAuthor: this.props.book.author,
      isWideBook: this.props.book.isWideBook,
      showBookInfo: false,
      disabled:
        this.props.readerState === ReaderStateOptions.countdownToStart ||
        this.props.readerState === ReaderStateOptions.playingBookIntro ||
        this.props.readerState === ReaderStateOptions.watchingVideo ||
        (this.props.inSpelling &&
          !this.props.spellingAnswerGiven &&
          this.props.readerState !== "READER_STATE_TALKING_ABOUT_NEXT_BUTTON"),
      onExitClicked: this.props.actions.exitClicked,
      onSkipClicked: this.props.actions.skipClicked,
      onNextPageClicked: this.props.actions.nextPageClicked,
      onNextWordClicked: this.props.actions.nextWordClicked,
      onPreviousWordClicked: this.props.actions.previousWordClicked,

      onSeeCompClicked: this.props.actions.seeCompClicked,
      inComp: this.props.inComp,
      onStartClicked: this.props.actions.startRecordingClicked, // maybe save for cover page  -PHIL
      currentShowModal: this.props.currentShowModal,
      currentShowOverlay: this.props.currentShowOverlay, // include to HACK to screenshare redux
      countdownValue: this.props.countdownValue, // include to HACK screenshare
      inSpelling: this.props.inSpelling,
      onSpellingAnswerGiven: this.props.actions.setSpellingAnswerGiven,
      onSpellingInputSet: this.props.actions.setSpellingInput,
      spellingInput: this.props.spellingInput,
      spellingQuestionNumber: this.props.spellingQuestionNumber,
      inOralReading: this.props.inOralReading,
      showSkipPrompt: this.props.showSkipPrompt,
      readerState: this.props.readerState,
      onStopClicked: this.props.actions.stopRecordingClicked,
      onStartOverClicked: this.props.actions.restartRecordingClicked,
      book: this.props.book,
      questionNumber: this.props.questionNumber,
      assessmentID: this.props.assessmentID,
      micPermissionsStatus: this.props.micPermissionsStatus,
      onStudentNameSet: this.props.actions.setStudentName,
      onAvatarClicked: this.props.actions.avatarClicked,
      onFinishVideoClicked: this.props.actions.finishVideoClicked,
      hasLoggedIn: this.props.hasLoggedIn,
      userID: this.props.userID,
      inSilentReading: this.props.inSilentReading,
      onCompPauseClicked: this.props.actions.compPauseClicked,
      onHearIntroAgainClicked: this.props.actions.hearIntroAgainClicked,
      onHearQuestionAgainClicked: this.props.actions.hearQuestionAgainClicked,
      onSetCurrentOverlay: this.props.actions.setCurrentOverlay,
      writtenCompInput: this.props.writtenCompInput,
      onBookSet: this.props.actions.setBook,
      isWarmup: this.props.isWarmup,
      section: this.props.section,
      teacherSignature: this.props.teacherSignature,
      students: this.props.students,
      assessments: this.props.assessments
    };

    let readerProps = basicReaderProps; // reader props is augmented then stuck into Reader

    if (this.props.pageNumber === 0 && !this.props.inComp) {
      // cover
      readerProps = {
        ...readerProps,
        showCover: true,
        showPauseButton: false,
        introAudioSrc: this.props.book.introAudioSrc,
        readerState: this.props.readerState,
        showVolumeIndicator: this.props.showVolumeIndicator
      };
    } else if (this.props.pageNumber === 0 && this.props.inComp) {
      // cover
      readerProps = {
        ...readerProps,
        showCover: true,
        showPauseButton:
          this.props.readerState === ReaderStateOptions.inProgress,
        onCompPauseClicked: this.props.actions.compPauseClicked
      };
    } else {
      // any other page...

      readerProps = {
        ...readerProps,
        pageNumber: this.props.pageNumber,
        textLines: this.props.book.pages[this.props.pageNumber].lines,
        imageURL: this.props.book.pages[this.props.pageNumber].img,
        showPauseButton:
          this.props.readerState === ReaderStateOptions.inProgress,
        isFirstPage: this.props.pageNumber == 1,
        isLastPage: this.props.pageNumber == this.props.book.numPages,
        onPreviousPageClicked: this.props.actions.previousPageClicked,
        onPauseClicked: this.props.actions.pauseClicked,
        onCompPauseClicked: this.props.actions.compPauseClicked,
        onStopClicked: this.props.actions.stopRecordingClicked
      };
    }

    return <Reader {...readerProps} />;
  };

  renderModalComponentOrNullBasedOnState = () => {
    return (
      <div>
        <PausedModal
          onContinueClicked={this.props.actions.resumeClicked}
          onStartOverClicked={this.props.actions.restartRecordingClicked}
          onTurnInClicked={this.props.actions.turnInClicked}
          currentShowModal={this.props.currentShowModal}
          showSpinner={this.props.showSpinner}
        />

        <SoundCheckModal
          onYesClicked={this.props.actions.yesClicked}
          onNoClicked={this.props.actions.noClicked}
          onHearIntroAgainClicked={this.props.actions.hearIntroAgainClicked}
          currentShowModal={this.props.currentShowModal}
        />

        <BookCheckModal
          bookTitle={this.props.book.title}
          onYesClicked={this.props.actions.yesClicked}
          onNoClicked={this.props.actions.noClicked}
          currentShowModal={this.props.currentShowModal}
        />

        <CompPausedModal
          title={
            this.props.inOralReading ? "Done reading?" : "Done with answer?"
          }
          onContinueClicked={this.props.actions.resumeClicked}
          onStartOverClicked={this.props.actions.restartRecordingClicked}
          currentShowModal={this.props.currentShowModal}
          showSpinner={this.props.showSpinner}
          onDoneClicked={this.props.actions.stopRecordingClicked}
          onExitLastQuestion={
            this.props.questionNumber === this.props.numQuestions
              ? this.props.actions.exitLastQuestion
              : function() {}
          }
        />

        <ExitModal
          startedRecording={this.props.hasRecordedSomething}
          onContinueClicked={this.props.actions.resumeClicked}
          onExitAndUploadClicked={this.props.exitAndUploadRecording}
          onExitNoUploadClicked={this.props.quitAssessment}
          currentShowModal={this.props.currentShowModal}
        />

        <PlaybackModal
          audioSrc={this.props.recordingURL}
          compAudioSrc={this.props.compRecordingURL}
          onStartOverClicked={this.props.actions.restartRecordingClicked}
          onTurnInClicked={this.props.actions.turnInClicked}
          currentShowModal={this.props.currentShowModal}
          showSpinner={this.props.showSpinner}
        />

        <DoneModal
          onHearRecordingClicked={this.props.actions.hearRecordingClicked}
          onTurnInClicked={this.props.actions.turnInClicked}
          currentShowModal={this.props.currentShowModal}
          showSpinner={this.props.showSpinner}
          showCheck={this.props.assessmentSubmitted}
        />

        <CompModal
          isWarmup={this.props.isWarmup}
          onFinalWrittenCompQuestionAnswered={
            this.props.actions.finalWrittenCompQuestionAnswered
          }
          onWrittenCompInputSet={this.props.actions.setWrittenCompInput}
          numWrittenQuestions={this.props.book.numWrittenQuestions}
          onNextQuestionClicked={this.props.actions.nextQuestionClicked}
          onPreviousQuestionClicked={this.props.actions.previousQuestionClicked}
          questionNumber={this.props.questionNumber}
          writtenQuestionNumber={this.props.writtenQuestionNumber}
          onSeeBookClicked={this.props.actions.seeBookClicked}
          onTurnInClicked={this.props.actions.turnInClicked}
          currentShowModal={this.props.currentShowModal}
          onStartClicked={this.props.actions.startRecordingClicked}
          onStopClicked={this.props.actions.stopRecordingClicked}
          readerState={this.props.readerState}
          close={this.props.actions.seeBookClicked}
          disabled={
            this.props.readerState === ReaderStateOptions.playingBookIntro ||
            this.props.readerState ===
              ReaderStateOptions.talkingAboutStartButton ||
            this.props.readerState ===
              ReaderStateOptions.talkingAboutStopButton ||
            this.props.readerState === ReaderStateOptions.talkingAboutSeeBook
          }
          nextDisabled={
            this.props.writtenCompInput === "" || !this.props.writtenCompInput
          }
          showSpinner={this.props.showSpinner}
          showPrompting={this.props.isLiveDemo}
          written={this.props.readerState === ReaderStateOptions.inWrittenComp}
          question={
            this.props.readerState === ReaderStateOptions.inWrittenComp
              ? this.props.book.writtenQuestions[
                  this.props.writtenQuestionNumber
                ]
              : this.props.book.questions[this.props.questionNumber]
          }
          includeDelay={this.props.questionNumber === 1}
          prompt={this.props.prompt}
          onExitLastQuestion={
            this.props.questionNumber === this.props.numQuestions
              ? this.props.actions.exitLastQuestion
              : function() {}
          }
          writtenCompInput={this.props.writtenCompInput}
        />
      </div>
    );
  };

  renderOverlayOrNullBasedOnState = () => {
    return (
      <div>
        <DisabledSTEPOverlay
          currentShowOverlay={this.props.currentShowOverlay}
        />

        <WarmupOverlay
          currentShowOverlay={this.props.currentShowOverlay}
          text={this.props.isWarmup ? "Practice" : "Full book"}
        />

        <NoSoundOverlay currentShowOverlay={this.props.currentShowOverlay} />

        <BlockedMicOverlay currentShowOverlay={this.props.currentShowOverlay} />

        <SubmittedOverlay currentShowOverlay={this.props.currentShowOverlay} />

        <PermissionsOverlay
          currentShowOverlay={this.props.currentShowOverlay}
          onArrowClicked={this.props.onPermisionsArrowClicked}
        />

        <DemoSubmittedOverlay
          currentShowOverlay={this.props.currentShowOverlay}
          studentName={this.props.studentName}
          onLogoutClicked={this.props.actions.demoSubmittedLogoutClicked}
        />

        {this.props.readerState === ReaderStateOptions.countdownToStart && (
          <CountdownOverlay countdownValue={this.props.countdownValue} />
        )}

        <SpinnerOverlay
          showPrompting={this.props.isLiveDemo}
          currentShowOverlay={this.props.currentShowOverlay}
          text={"Spinner message goes here"}
          isLoadingUpload={this.props.showSpinner}
          isLoadingVideo={
            this.props.readerState === ReaderStateOptions.watchingVideo
          }
          isLoadingClass={this.props.section === SectionOptions.initializing}
        />
      </div>
    );
  }; // END renderOverlayOrNullBasedOnState = () => {

  // The best way to preload images is just to render hidden img components, with src set to the url we want to load
  // That way they'll be cached by the browser for when we actually want to display them
  renderHiddenPreloadImages = () => {
    // the image loading blocks chrome from checking if microphone access exists,
    // so don't do any preloading if we're awaiting permissions
    if (
      !PRELOAD_IMAGES_ADVANCE ||
      this.props.readerState == ReaderStateOptions.initializing ||
      this.props.readerState == ReaderStateOptions.awaitingPermissions
    ) {
      console.log("DONT NEED TO PRELOAD");
      return null;
    }

    let preloadImageURLs = [];
    for (
      let i = this.props.pageNumber + 1;
      i <= this.props.book.numPages &&
      i <= this.props.pageNumber + PRELOAD_IMAGES_ADVANCE;
      i++
    ) {
      preloadImageURLs.push(this.props.book.pages[i].img);
    }

    return (
      <div
        style={{
          visibility: "hidden",
          width: 0,
          height: 0,
          overflow: "hidden"
        }}
      >
        {preloadImageURLs.map(preloadImage => (
          <img key={preloadImage} src={preloadImage} />
        ))}
      </div>
    );
  };

  render() {
    console.log(
      "Rendering ReaderManager with ReaderState: " + this.props.readerState
    );

    // if (this.props.readerState === ReaderStateOptions.initializing) {
    //   return <div className={styles.fill} style={{ backgroundColor: 'black' }} />
    // }

    const ReaderComponent = this.renderReaderComponentWithProps();
    const ModalComponentOrNull = this.renderModalComponentOrNullBasedOnState();
    const OverlayOrNull = this.renderOverlayOrNullBasedOnState();

    return (
      <div className={styles.fill}>
        {ReaderComponent}
        {ModalComponentOrNull}
        {OverlayOrNull}
        {this.renderHiddenPreloadImages()}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentDashboard);
