// @flow
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux'

import * as actionCreators from './state'
import { bindActionCreators } from 'redux'

import Reader from './Reader'
import Recorder from './recorder'

import {
  ReaderStateOptions,
} from './types'

import styles from './styles.css'

import CompModal from './modals/CompModal'
import DoneModal from './modals/DoneModal'
import PausedModal from './modals/PausedModal'
import CompPausedModal from './modals/CompPausedModal'
import ExitModal from './modals/ExitModal'
import MicModal from './modals/MicModal'
import PlaybackModal from './modals/PlaybackModal'

import IntroOverlay from './overlays/IntroOverlay'
import BlockedMicOverlay from './overlays/BlockedMicOverlay'
import SubmittedOverlay from './overlays/SubmittedOverlay'
import DemoSubmittedOverlay from './overlays/DemoSubmittedOverlay'
import PermissionsOverlay from './overlays/PermissionsOverlay'
import CountdownOverlay from './overlays/CountdownOverlay'

import { Modal } from 'react-bootstrap'

import {
  HashRouter,
  Route,
  Redirect
} from 'react-router-dom'

import { fpBook, fireflyBook } from './state'

// TODO PUT IN OWN FILE


// how many images in advance to load
const PRELOAD_IMAGES_ADVANCE = 3


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
    showVolumeIndicator: state.reader.showVolumeIndicator,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch),
    exitAndUploadRecording() {
      dispatch(actionCreators.turnInClicked())
    },
    quitAssessment() {
      dispatch({ type: 'QUIT_ASSESSMENT_AND_DESTROY' })
    },
  }
}

// todo
class StudentDashboard extends React.Component {
  static propTypes = {
    studentName: PropTypes.string.isRequired, // this is passed from the Rails view
    isDemo: PropTypes.bool,
    storyID: PropTypes.string,
  };

  constructor(props, _railsContext) {
    super(props);
  }


  componentWillMount() {
    this.props.actions.setIsDemo(this.props.isDemo)
    this.props.actions.setBookKey(this.props.storyID)
    this.props.actions.setBook(this.props.storyID)

    if (!Recorder.browserSupportsRecording()) {
      alert("Your browser cannot record audio. Please switch to Chrome or Firefox.")
      return
    }

    // This stuff kicks off the process, gets state out of initializing
  }


  componentDidUpdate(nextProps) {
    console.log('ReaderManager updated to pageNumber:  ' + this.props.pageNumber)
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
      showBookInfo: ((this.props.readerState === ReaderStateOptions.countdownToStart || this.props.readerState === ReaderStateOptions.awaitingStart) && !this.props.inComp),
      disabled: (this.props.readerState === ReaderStateOptions.countdownToStart || this.props.readerState === ReaderStateOptions.playingBookIntro),
      onExitClicked: this.props.actions.exitClicked,
      onNextPageClicked: this.props.actions.nextPageClicked,
      onSeeCompClicked: this.props.actions.seeCompClicked,
      inComp: this.props.inComp,
      onStartClicked: this.props.actions.startRecordingClicked, // maybe save for cover page  -PHIL 
      currentShowModal: this.props.currentShowModal,


    }

    let readerProps = basicReaderProps // reader props is augmented then stuck into Reader


    if (this.props.pageNumber === 0  && !this.props.inComp) { // cover
      readerProps = {
        ...readerProps,
        showCover: true,
        showPauseButton: false,
        introAudioSrc: this.props.book.introAudioSrc,
        readerState: this.props.readerState,
        showVolumeIndicator: this.props.showVolumeIndicator,
      }
    }
    else if (this.props.pageNumber === 0 && this.props.inComp) { // cover
        readerProps = {
          ...readerProps,
          showCover: true,
          showPauseButton: (this.props.readerState === ReaderStateOptions.inProgress),
          onCompPauseClicked: this.props.actions.compPauseClicked,
      }
    }
    else { // any other page...

      readerProps = {
        ...readerProps,
        pageNumber: this.props.pageNumber,
        textLines: this.props.book.pages[this.props.pageNumber].lines,
        imageURL: this.props.book.pages[this.props.pageNumber].img,
        showPauseButton: (this.props.readerState === ReaderStateOptions.inProgress),
        isFirstPage: (this.props.pageNumber == 1),
        isLastPage: (this.props.pageNumber == this.props.book.numPages),
        onPreviousPageClicked: this.props.actions.previousPageClicked,
        onPauseClicked: this.props.actions.pauseClicked,
        onCompPauseClicked: this.props.actions.compPauseClicked,
        onStopClicked: this.props.actions.stopRecordingClicked,
      }
    }

    return <Reader {...readerProps} />
  }


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

        <CompPausedModal
          onContinueClicked={this.props.actions.resumeClicked}
          onStartOverClicked={this.props.actions.restartRecordingClicked}
          currentShowModal={this.props.currentShowModal}
          showSpinner={this.props.showSpinner}    
          onDoneClicked={this.props.actions.stopRecordingClicked}
          onExitLastQuestion={(this.props.questionNumber === this.props.numQuestions) ? this.props.actions.exitLastQuestion : (function(){}) }
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
        />

        <CompModal
          onSeeBookClicked={this.props.actions.seeBookClicked}
          onTurnInClicked={this.props.actions.turnInClicked}
          currentShowModal={this.props.currentShowModal}
          onStartClicked={this.props.actions.startRecordingClicked}
          onStopClicked={this.props.actions.stopRecordingClicked}
          readerState={this.props.readerState}
          close={this.props.actions.seeBookClicked}
          disabled={(this.props.readerState === ReaderStateOptions.playingBookIntro) || (this.props.readerState === ReaderStateOptions.talkingAboutStartButton) || (this.props.readerState === ReaderStateOptions.talkingAboutStopButton) }
          showSpinner={this.props.showSpinner}
          question={this.props.book.questions[this.props.questionNumber]}
          includeDelay={this.props.questionNumber === 1}
          prompt={this.props.prompt}
          onExitLastQuestion={(this.props.questionNumber === this.props.numQuestions) ? this.props.actions.exitLastQuestion : (function(){}) }
        />

      </div>
    );

  }

  renderOverlayOrNullBasedOnState = () => {
    return (
      <div>

        <BlockedMicOverlay
          currentShowOverlay={this.props.currentShowOverlay}
        />

        <SubmittedOverlay
          currentShowOverlay={this.props.currentShowOverlay}
        />

        <PermissionsOverlay
          currentShowOverlay={this.props.currentShowOverlay}
          onArrowClicked={this.props.onPermisionsArrowClicked}
        />

        <DemoSubmittedOverlay
          currentShowOverlay={this.props.currentShowOverlay}
          studentName={this.props.studentName}
          onLogoutClicked={this.props.actions.demoSubmittedLogoutClicked}
        />

        {
          (this.props.readerState === ReaderStateOptions.countdownToStart) &&
          <CountdownOverlay countdownValue={this.props.countdownValue} />
        }

      </div>
    );
  } // END renderOverlayOrNullBasedOnState = () => {


  // The best way to preload images is just to render hidden img components, with src set to the url we want to load
  // That way they'll be cached by the browser for when we actually want to display them
  renderHiddenPreloadImages = () => {

    // the image loading blocks chrome from checking if microphone access exists,
    // so don't do any preloading if we're awaiting permissions
    if (!PRELOAD_IMAGES_ADVANCE || this.props.readerState == ReaderStateOptions.initializing || this.props.readerState == ReaderStateOptions.awaitingPermissions) {
      console.log('DONT NEED TO PRELOAD')
      return null
    }

    let preloadImageURLs = []
    for (let i = this.props.pageNumber + 1; i <= this.props.book.numPages && i <= this.props.pageNumber + PRELOAD_IMAGES_ADVANCE; i++) {
      preloadImageURLs.push(this.props.book.pages[i].img)
    }

    return (
      <div style={{ 'visibility': 'hidden', 'width': 0, 'height': 0, 'overflow': 'hidden' }}>
        {preloadImageURLs.map((preloadImage) => (
          <img key={preloadImage} src={preloadImage} />
        ))}
      </div>
    );
  }


  render()  {

    console.log('Rendering ReaderManager with ReaderState: ' + this.props.readerState)

    // if (this.props.readerState === ReaderStateOptions.initializing) {
    //   return <div className={styles.fill} style={{ backgroundColor: 'black' }} />
    // }

    const ReaderComponent = this.renderReaderComponentWithProps()
    const ModalComponentOrNull = this.renderModalComponentOrNullBasedOnState()
    const OverlayOrNull = this.renderOverlayOrNullBasedOnState()

    return (
      <div className={styles.fill}>

        { ReaderComponent }
        { ModalComponentOrNull }
        { OverlayOrNull }
        { this.renderHiddenPreloadImages() }

      </div>
    );
  }
}




export default connect(mapStateToProps, mapDispatchToProps)(StudentDashboard)



