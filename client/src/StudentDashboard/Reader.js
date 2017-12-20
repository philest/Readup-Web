import PropTypes from "prop-types";
import React from "react";

import NavigationBar from "./components/NavigationBar";
import BookPage from "./components/BookPage";
import BookCover from "./components/BookCover";
import RectangleButton from "./components/RectangleButton";
import ForwardArrowButton from "./components/ForwardArrowButton";
import BackArrowButton from "./components/BackArrowButton";
import SpellingTextField from "./components/SpellingTextField";
import AvatarContainer from "./components/AvatarContainer";
import FinishedImage from "./components/FinishedImage";
import VolumeIndicator from "./components/VolumeIndicator";

import styles from "./styles.css";
import css from "./components/NavigationBar/styles.css";
import ReportStyles from "../ReportsInterface/styles.css";

import { RouteTransition, presets } from "react-router-transition";

import { ReaderStateOptions, SectionOptions, FormatOptions } from "./types";

import Drag from "./components/Drag";
import SkipPrompt from "./components/SkipPrompt";
// import ProgressBarWithStages from "./components/ProgressBarWithStages";

import { Modal, Button } from "react-bootstrap";

import { Link, Redirect } from "react-router-dom";

import { playSoundAsync, stopAudio } from "./audioPlayer.js";

import VideoChat from "../sharedComponents/VideoChat";
import AssignBooks from "../sharedComponents/AssignBooks";
import LinkInfo from "../sharedComponents/LinkInfo";

export default class Reader extends React.Component {
  static propTypes = {
    isDemo: PropTypes.bool,
    // For displaying the book page
    studentName: PropTypes.string.isRequired, // this is passed from the Rails view
    userID: PropTypes.string,
    pageNumber: PropTypes.number,
    textLines: PropTypes.arrayOf(PropTypes.string),
    imageURL: PropTypes.string,
    isWideBook: PropTypes.bool,

    // For displaying book cover
    showCover: PropTypes.bool,
    coverImageURL: PropTypes.string,
    bookTitle: PropTypes.string,
    bookAuthor: PropTypes.string,

    // other state
    showPauseButton: PropTypes.bool,
    isFirstPage: PropTypes.bool,
    isLastPage: PropTypes.bool,
    showBookInfo: PropTypes.bool,
    disabled: PropTypes.bool,

    // Callback functions
    // not required because not all functions needed for every page
    // i.e. the last page shouldn't have a nextPageClicked function
    onPauseClicked: PropTypes.func,
    onCompPauseClicked: PropTypes.func,
    onStopClicked: PropTypes.func,
    onStartClicked: PropTypes.func,
    onNextPageClicked: PropTypes.func,
    onNextWordClicked: PropTypes.func,
    onPreviousPageClicked: PropTypes.func,
    onPreviousWordClicked: PropTypes.func,
    onExitClicked: PropTypes.func,
    onSeeCompClicked: PropTypes.func,
    onSkipClicked: PropTypes.func,
    onFinishVideoClicked: PropTypes.func,
    onHearIntroAgainClicked: PropTypes.func,
    onHearQuestionAgainClicked: PropTypes.func,
    onBookSet: PropTypes.func,

    //Phil
    inComp: PropTypes.bool,
    inOralReading: PropTypes.bool,
    currentShowModal: PropTypes.string,
    currentShowOverlay: PropTypes.string,
    introAudioSrc: PropTypes.string,
    showVolumeIndicator: PropTypes.bool,
    showSkipPrompt: PropTypes.bool,
    isLiveDemo: PropTypes.bool,
    inSpelling: PropTypes.bool,
    onSpellingAnswerGiven: PropTypes.func,
    spellingQuestionNumber: PropTypes.number,
    assessmentID: PropTypes.number,
    micPermissionsStatus: PropTypes.string,
    onSpellingInputSet: PropTypes.func,
    spellingInput: PropTypes.string,

    onStudentNameSet: PropTypes.func,
    onAvatarClicked: PropTypes.func,
    inSilentReading: PropTypes.bool,
    onSetCurrentOverlay: PropTypes.func,

    isWithinGrader: PropTypes.bool
  };

  static defaultProps = {
    isDemo: false,
    // Default to showing a regular page (neither cover nor first nor last)
    showCover: false,
    showBookInfo: false,
    isFirstPage: false,
    isLastPage: false,
    showPauseButton: true,
    disabled: false,
    isWithinGrader: false
  };

  constructor(props, _railsContext) {
    super(props);
  }

  renderLeftButton = () => {
    if (this.props.inSpelling) {
      return (
        <BackArrowButton
          title="Back"
          subtitle={this.props.inSpelling ? null : "page"}
          style={{
            width: 95,
            height: 75,
            float: "right",
            visibility:
              this.props.spellingQuestionNumber <= 1 ? "hidden" : "visible"
          }}
          onClick={
            this.props.inSpelling
              ? this.props.onPreviousWordClicked
              : this.props.onPreviousPageClicked
          }
        />
      );
    }

    return null;

    if (
      this.props.showCover ||
      (this.props.isFirstPage && !this.props.inComp) ||
      this.props.inSpelling
    ) {
      return null;
    }

    return (
      <BackArrowButton
        title="Back"
        subtitle="page"
        style={{ width: 120, height: 95 }}
        onClick={this.props.onPreviousPageClicked}
        disabled={this.props.disabled}
      />
    );
  };

  renderCenterDisplay = () => {
    // if (this.props.readerState === "TEST") {
    //   return <AvatarContainer />;
    // }

    if (this.props.inSpelling) {
      return null;
    }

    let wideContainerClass;

    if (this.props.showCover) {
      wideContainerClass = styles.largeWideBookpageContainer;
    } else {
      wideContainerClass = styles.wideBookpageContainer;
    }

    if (this.props.readerState === ReaderStateOptions.finishedAssessment) {
      return <FinishedImage />;
    }

    if (
      this.props.readerState === ReaderStateOptions.watchingVideo ||
      this.props.readerState === ReaderStateOptions.watchedMostOfVideo ||
      this.props.readerState === ReaderStateOptions.watchedFullVideo
    ) {
      return (
        <div>
          {this.props.isWithinGrader && (
            <img
              src="/images/dashboard/video-placeholder.jpg"
              style={{
                height: 360,
                width: 640,
                display: "block"
              }}
            />
          )}
          {!this.props.isWithinGrader && (
            <iframe
              src="https://fast.wistia.net/embed/iframe/1rokpxeh2j"
              title="Wistia video player"
              allowTransparency="true"
              frameBorder="0"
              scrolling="no"
              className="wistia_embed"
              name="wistia_embed"
              width="640"
              height="360"
              style={{ zIndex: 999999999 }}
            />
          )}
          <script src="https://fast.wistia.net/assets/external/E-v1.js" async />
        </div>
      );
    }

    if (
      (this.props.inOralReading &&
        this.props.showCover &&
        (this.props.readerState === "READER_STATE_INITIALIZING" ||
          this.props.readerState === ReaderStateOptions.playingBookIntro)) ||
      (!this.props.inOralReading &&
        !this.props.inComp &&
        !this.props.inSpelling &&
        !this.props.inSilentReading)
    ) {
      return (
        <div
          className={[styles.buttonContainer].join(" ")}
          className={
            this.props.isWideBook
              ? wideContainerClass
              : styles.bookpageContainer
          }
        >
          <BookCover imageURL={this.props.coverImageURL} />;
        </div>
      );
    }

    if (
      this.props.readerState === ReaderStateOptions.talkingAboutStartButton ||
      this.props.readerState === ReaderStateOptions.playingBookIntro
    ) {
      return (
        <div className={[styles.buttonContainer].join(" ")}>
          <div
            className={
              this.props.isWideBook
                ? [
                    wideContainerClass,
                    styles.disabledLargeWideBookpageContainer
                  ].join(" ")
                : [
                    styles.bookpageContainer,
                    styles.disabledBookpageContainer
                  ].join(" ")
            }
          >
            <BookCover imageURL={this.props.coverImageURL} />;
          </div>

          <div className={[styles.buttonPlacement].join(" ")}>
            <RectangleButton
              title="Start Recording"
              pulsatingArrow={false && true}
              disabled={this.props.disabled}
              partiallyDisabled
              isLarge
              isGreen
            />
          </div>
        </div>
      );
    }

    if (
      this.props.readerState === "READER_STATE_TALKING_ABOUT_STOP_BUTTON" ||
      this.props.readerState === "READER_STATE_DONE" ||
      this.props.readerState === "READER_STATE_PAUSED"
    ) {
      return (
        <div className={[styles.buttonContainer].join(" ")}>
          <div
            className={
              this.props.isWideBook
                ? [
                    wideContainerClass,
                    styles.disabledLargeWideBookpageContainer
                  ].join(" ")
                : [
                    styles.bookpageContainer,
                    styles.disabledBookpageContainer
                  ].join(" ")
            }
          >
            <BookCover imageURL={this.props.coverImageURL} />;
          </div>

          <div className={[styles.buttonPlacement].join(" ")}>
            <RectangleButton
              title={
                this.props.inSilentReading ? "Finish Book" : "Stop Recording"
              }
              pulsatingArrow={false && true}
              disabled={this.props.disabled}
              partiallyDisabled
              isLarge
              isRed
            />
          </div>
        </div>
      );
    }

    if (this.props.readerState === "READER_STATE_AWAITING_START") {
      return (
        <div className={[styles.buttonContainer].join(" ")}>
          <div>
            <div
              className={
                this.props.isWideBook
                  ? [
                      wideContainerClass,
                      styles.disabledLargeWideBookpageContainer
                    ].join(" ")
                  : [
                      styles.bookpageContainer,
                      styles.disabledBookpageContainer
                    ].join(" ")
              }
            >
              <BookCover imageURL={this.props.coverImageURL} />;
            </div>

            <div
              className={[ReportStyles.wiggler, styles.buttonPlacement].join(
                " "
              )}
            >
              <RectangleButton
                title="Start Recording"
                pulsatingArrow={false && true}
                disabled={this.props.disabled}
                onClick={this.props.onStartClicked}
                isLarge
                isGreen
              />
            </div>
          </div>
        </div>
      );
    }

    if (
      this.props.readerState === "READER_STATE_IN_PROGRESS" ||
      this.props.readerState === "READER_STATE_COUNTDOWN_TO_START" ||
      this.props.readerState === "READER_STATE_AWAITING_FINISH_BOOK" ||
      (this.props.inOralReading &&
        this.props.readerState === ReaderStateOptions.playingBookIntro)
    ) {
      return (
        <div className={[styles.buttonContainer].join(" ")}>
          <div
            className={
              this.props.isWideBook
                ? [
                    wideContainerClass,
                    styles.disabledLargeWideBookpageContainer
                  ].join(" ")
                : [
                    styles.bookpageContainer,
                    styles.disabledBookpageContainer
                  ].join(" ")
            }
          >
            <BookCover imageURL={this.props.coverImageURL} />
          </div>

          <div className={[styles.buttonPlacement].join(" ")}>
            <RectangleButton
              title={
                this.props.inSilentReading ? "Finish Book" : "Stop Recording"
              }
              pulsatingArrow={false}
              pulsatingCircle={
                !this.props.disabled && !this.props.inSilentReading
              }
              disabled={this.props.disabled}
              isLarge
              isRed
              onClick={this.props.onCompPauseClicked}
            />
          </div>
        </div>
      );
    }

    // default
    return (
      <div className={[styles.buttonContainer].join(" ")}>
        <div
          className={
            this.props.isWideBook
              ? [
                  wideContainerClass,
                  styles.disabledLargeWideBookpageContainer
                ].join(" ")
              : [
                  styles.bookpageContainer,
                  styles.disabledBookpageContainer
                ].join(" ")
          }
        >
          <BookCover imageURL={this.props.coverImageURL} />;
        </div>

        <div className={[styles.buttonPlacement].join(" ")}>
          <RectangleButton
            title="Start Recording"
            pulsatingArrow={false && true}
            disabled={this.props.disabled}
            partiallyDisabled
            isLarge
            isGreen
          />
        </div>
      </div>
    );
  };

  renderRightButton = () => {
    if (!this.props.hasLoggedIn) {
      return null;
    }

    if (
      [
        ReaderStateOptions.watchingVideo,
        ReaderStateOptions.watchedMostOfVideo,
        ReaderStateOptions.watchedFullVideo
      ].includes(this.props.readerState)
    ) {
      return (
        <ForwardArrowButton
          title="Next"
          subtitle={null}
          style={{ width: 145, height: 120 }}
          disabled={this.props.disabled}
          onClick={this.props.onFinishVideoClicked}
          wiggle={
            this.props.readerState === ReaderStateOptions.watchedFullVideo
          }
        />
      );
    }

    if (!this.props.inComp && !this.props.inSpelling) {
      return (
        <VolumeIndicator
          hearAgainClicked={this.props.onHearIntroAgainClicked}
          visible={
            this.props.readerState !== ReaderStateOptions.playingBookIntro
          }
        />
      );
    }

    if (this.props.inComp) {
      return (
        <VolumeIndicator
          hearAgainClicked={this.props.onHearQuestionAgainClicked}
          visible={
            this.props.readerState === "READER_STATE_IN_PROGRESS" ||
            this.props.readerState === "READER_STATE_AWAITING_START"
          }
        />
      );
    }

    if (this.props.inSpelling) {
      return (
        <ForwardArrowButton
          title="Next"
          subtitle={this.props.inSpelling ? null : "page"}
          style={{ width: 145, height: 120 }}
          disabled={this.props.disabled}
          onClick={
            this.props.inSpelling
              ? this.props.onNextWordClicked
              : this.props.onNextPageClicked
          }
        />
      );
    }

    return null;

    if (this.props.isLastPage && !this.props.inComp) {
      return (
        <RectangleButton
          title="Stop"
          subtitle="recording"
          style={{ width: 200, height: 70, backgroundColor: "#982E2B" }}
          pulsatingArrow={true}
          disabled={this.props.disabled}
          onClick={this.props.onStopClicked}
          visibility={this.props.inComp ? "hidden" : "inherit"}
        />
      );
    } else if (this.props.isLastPage && this.props.inComp) {
      return;
    } else if (
      this.props.showCover &&
      !this.props.inComp &&
      !this.props.inSpelling
    ) {
      return (
        <RectangleButton
          title="Start Recording"
          style={{ width: 230, height: 70, backgroundColor: "#249C44" }}
          pulsatingArrow={true}
          disabled={this.props.disabled}
          onClick={this.props.onStartClicked}
        />
      );
    }
  };

  renderUpperLeftButton = () => {
    if (
      false &&
      this.props.inComp &&
      this.props.currentShowModal !== "modal-comp"
    ) {
      return (
        <div className={css.subContainer}>
          <div className={[css.centerDisplayContainer].join(" ")}>
            <RectangleButton
              title="See"
              subtitle="Question"
              style={{
                width: 200,
                height: 70,
                backgroundColor: "#F5F5F5",
                color: "#4a4a4a"
              }}
              pulsatingArrow={false}
              disabled={this.props.disabled}
              onClick={this.props.onSeeCompClicked}
            />
            <i
              className={[
                "fa",
                "fa-question",
                "faa-pulse animated",
                styles.myQuestionMarkIcon
              ].join(" ")}
              aria-hidden={"true"}
            />
          </div>
        </div>
      );
    }
  };

  getNextSection = () => {
    if (this.props.inOralReading) {
      return "comprehension";
    } else if (this.props.inComp) {
      return "spelling";
    } else {
      return "end";
    }
  };

  getSkipPromptTopOffset = () => {
    return this.props.inSpelling ? -10 : this.props.inComp ? -5 : -5;
  };

  getFormat = book => {
    if (book.brand === "FP" || book.stepLevel <= 5) {
      return FormatOptions.standard;
    } else if (book.stepLevel <= 8) {
      return FormatOptions.stepFiveThroughEight;
    } else if (book.stepLevel <= 12) {
      return FormatOptions.stepNineThroughTwelve;
    } else {
      return false;
      throw "BOOK_NOT_RECOGNIZED";
      console.log(`book ${book} not detected`);
    }
  };

  renderNavigationBar = () => {
    let navProps = {
      className: styles.navBar,
      studentName: this.props.studentName,
      showPauseButton: this.props.showPauseButton,
      showBookInfo: this.props.showBookInfo,
      bookTitle: this.props.bookTitle,
      bookAuthor: this.props.bookAuthor,
      isCoverPage: this.props.showCover,
      onPauseClicked: this.props.inComp
        ? this.props.onCompPauseClicked
        : this.props.onCompPauseClicked,
      onExitClicked: this.props.onExitClicked,
      inComp: this.props.inComp,
      inSpelling: this.props.inSpelling,
      isWarmup: this.props.isWarmup,
      progressBar:
        this.props.section !== SectionOptions.initializing &&
        this.props.section !== SectionOptions.login &&
        this.props.section !== SectionOptions.video,
      currentSection: this.props.section,
      format: this.getFormat(this.props.book)
    };

    return <NavigationBar {...navProps} />;
  };

  renderVideoChat = () => {
    return (
      <div style={{ height: 0 }}>
        <VideoChat
          identity={this.props.studentName}
          assessmentID={this.props.assessmentID}
          room={`Assessment-${this.props.assessmentID}-Room`}
          logs={false}
          pictureInPicture={false}
          localVideo={!this.props.isDemo}
          studentDash
          lastQuestionAudioFile={
            this.props.book.questions[String(this.props.questionNumber)]
              ? this.props.book.questions[String(this.props.questionNumber)]
                  .audioSrc
              : ""
          }
          readerProps={this.props}
          isWithinGrader={this.props.isWithinGrader}
        />
      </div>
    );
  };

  render() {
    console.log("Rerendering Reader, pageNumber is: " + this.props.pageNumber);

    // const transitionPreset = this.props.location.action === 'POP' ? presets.slideLeft : presets.slideRight;
    const transitionProps = {
      ...presets.pop,
      pathname: this.props.pathname,
      className: styles.routeTransition
    };

    if (this.props.inSpelling && this.props.book.stepLevel > 12) {
      return (
        <div className={styles.fullHeight}>
          {this.renderNavigationBar()}

          <div className={styles.contentContainer}>
            <Drag
              onSkipClicked={this.props.onSkipClicked}
              book={this.props.book}
              onHearQuestionAgainClicked={this.props.onHearQuestionAgainClicked}
              onSpellingAnswerGiven={this.props.onSpellingAnswerGiven}
              spellingQuestionNumber={this.props.spellingQuestionNumber}
              onNextWordClicked={this.props.onNextWordClicked}
              onPreviousWordClicked={this.props.onPreviousWordClicked}
              showSpellingBoxIndicator={
                this.props.readerState ===
                "READER_STATE_TALKING_ABOUT_SPELLING_BOX"
              }
              onEnterPressed={this.props.onNextWordClicked}
              progressNum={
                this.props.spellingQuestionNumber /
                this.props.book.numSpellingQuestions *
                100
              }
              onSpellingInputSet={this.props.onSpellingInputSet}
              spellingInput={this.props.spellingInput}
            />
          </div>
        </div>
      );
    }

    if (!this.props.hasLoggedIn && !this.props.isDemo) {
      return (
        <div className={styles.fullHeight}>
          {this.renderNavigationBar()}

          <div className={styles.contentContainerAvatars}>
            <AvatarContainer
              onStudentNameSet={this.props.onStudentNameSet}
              onBookSet={this.props.onBookSet}
              onAvatarClicked={this.props.onAvatarClicked}
              onSetCurrentOverlay={this.props.onSetCurrentOverlay}
              teacherSignature={this.props.teacherSignature}
              students={this.props.students}
              assessments={this.props.assessments}
              hide={
                this.props.currentShowOverlay === "overlay-spinner" ||
                this.props.section === SectionOptions.initializing
              }
            />
          </div>
        </div>
      );
    }

    return (
      <div className={styles.fullHeight}>
        {this.renderNavigationBar()}

        {this.props.assessmentID &&
          this.props.micPermissionsStatus ===
            "MIC_PERMISSIONS_STATUS_GRANTED" &&
          this.renderVideoChat()}

        <div
          className={
            this.props.inSpelling
              ? styles.spellingContentContainer
              : styles.contentContainer
          }
        >
          <div
            className={
              this.props.inComp && this.props.currentShowModal !== "modal-comp"
                ? styles.leftDoubleButtonContainer
                : this.props.inSpelling
                  ? styles.spellingLeftButtonContainer
                  : styles.leftButtonContainer
            }
          >
            {this.renderUpperLeftButton()}
            {(this.props.inSpelling ||
              this.props.inComp ||
              this.props.inOralReading) &&
              this.renderLeftButton()}
          </div>

          {this.props.inSpelling &&
            this.props.book.stepLevel <= 12 && (
              <SpellingTextField
                book={this.props.book}
                onHearQuestionAgainClicked={
                  this.props.onHearQuestionAgainClicked
                }
                onSpellingAnswerGiven={this.props.onSpellingAnswerGiven}
                spellingQuestionNumber={this.props.spellingQuestionNumber}
                showVolumeIndicator={this.props.showVolumeIndicator}
                showSpellingBoxIndicator={
                  this.props.readerState ===
                  "READER_STATE_TALKING_ABOUT_SPELLING_BOX"
                }
                onEnterPressed={this.props.onNextWordClicked}
                progressNum={
                  this.props.spellingQuestionNumber /
                  this.props.book.numSpellingQuestions *
                  100
                }
                onSpellingInputSet={this.props.onSpellingInputSet}
                spellingInput={this.props.spellingInput}
              />
            )}

          {this.renderCenterDisplay()}

          <div
            className={
              this.props.inSpelling
                ? styles.spellingRightButtonContainer
                : styles.rightButtonContainer
            }
          >
            {this.props.showSkipPrompt && (
              <SkipPrompt
                topOffset={this.getSkipPromptTopOffset()}
                nextSection={this.getNextSection()}
                onSkipClicked={this.props.onSkipClicked}
              />
            )}
            {true &&
              (this.props.inSpelling ||
                this.props.inComp ||
                this.props.inOralReading) &&
              this.renderRightButton()}
          </div>
        </div>
      </div>
    );
  }
}
