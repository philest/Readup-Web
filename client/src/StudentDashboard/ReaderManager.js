//@flow



import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux'

import * as actionCreators from './state'
import { bindActionCreators } from 'redux'

import Reader from './Reader'
import Recorder from './recorder'

import { ReaderStateOptions, ReaderState, MicPermissionsStatusOptions, MicPermissionsStatus, PauseType, PauseTypeOptions } from './types'

import styles from './styles.css'

import DoneModal from './modals/DoneModal'
import PausedModal from './modals/PausedModal'
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


// TODO PUT IN OWN FILE


// how many images in advance to load
const PRELOAD_IMAGES_ADVANCE = 3


function mapStateToProps (state) {
  return {
    // micEnabled: state.reader.micEnabled,
    pageNumber: state.reader.pageNumber,
    readerState: state.reader.readerState,
    pauseType: state.reader.pauseType,
    hasRecordedSomething: state.reader.hasRecordedSomething,
    numPages: state.reader.book.numPages,
    book: state.reader.book,
    recorder: state.reader.recorder, // TODO probably shouldn't have access
    recordingURL: state.reader.recordingURL,
    currentShowModal: state.reader.currentModalId,
    currentShowOverlay: state.reader.currentOverlayId,
  }
}

function mapDispatchToProps (dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
}

//todo
class StudentDashboard extends React.Component {
  static propTypes = {
    studentName: PropTypes.string.isRequired, // this is passed from the Rails view
    isDemo: PropTypes.bool,
  };

  constructor(props, _railsContext) {
    super(props);

  }


  componentWillMount() {

    this.props.actions.setIsDemo(this.props.isDemo)

    if (!Recorder.browserSupportsRecording()) {
      alert("Your browser cannot record audio. Please switch to Chrome or Firefox.")
      return
    }

    // This stuff kicks off the process, gets state out of initializing


  }

  componentDidUpdate(nextProps) {
    console.log('ReaderManager updated to pageNumber:  ' + this.props.pageNumber)
  }

 

  onPermisionsArrowClicked = () => {
    this.props.actions.clickedPermissionsArrow()
  }

  exitAndUploadRecording = () => {

  }

  exitAbandonState = () => {

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
      showBookInfo: (this.props.readerState === ReaderStateOptions.countdownToStart || this.props.readerState === ReaderStateOptions.awaitingStart),
      disabled: (this.props.readerState === ReaderStateOptions.countdownToStart || this.props.readerState === ReaderStateOptions.playingBookIntro),
      onExitClicked: this.props.actions.exitClicked,
    }

    let readerProps = basicReaderProps // reader props is augmented then stuck into Reader


    if (this.props.pageNumber == 0) { // cover
      readerProps = {
        ...readerProps,
        showCover: true,
        showPauseButton: false,
        onStartClicked: this.props.actions.startRecordingClicked,
      }
    }
    else { // any other page...

      readerProps = {
        ...readerProps,
        pageNumber: this.props.pageNumber,
        textLines: this.props.book.pages[this.props.pageNumber].lines,
        imageURL: this.props.book.pages[this.props.pageNumber].img,
        showPauseButton: this.props.readerState === ReaderStateOptions.inProgress,
        isFirstPage: (this.props.pageNumber == 1),
        isLastPage: (this.props.pageNumber == this.props.numPages),
        onPreviousPageClicked: this.props.actions.previousPageClicked,
        onPauseClicked: this.props.actions.pauseClicked,
        onNextPageClicked: this.props.actions.nextPageClicked,
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
        />

        <ExitModal
          startedRecording={this.props.hasRecordedSomething}
          onContinueClicked={this.props.actions.resumeClicked}
          onExitAndUploadClicked={this.exitAndUploadRecording}
          onExitNoUploadClicked={this.exitAbandonState}
          currentShowModal={this.props.currentShowModal}
        />

        <PlaybackModal
          audioSrc={this.props.recordingURL}
          onStartOverClicked={this.props.actions.restartRecordingClicked}
          onTurnInClicked={this.props.actions.turnInClicked}
          currentShowModal={this.props.currentShowModal}
        />

        <DoneModal
          onHearRecordingClicked={this.props.actions.hearRecordingClicked}
          onTurnInClicked={this.props.actions.turnInClicked}
          currentShowModal={this.props.currentShowModal}
        />
      </div>
    );

  }

  renderOverlayOrNullBasedOnState = () => {
    return (
      <div>

        <IntroOverlay currentShowOverlay={this.props.currentShowOverlay} onContinueClicked={this.props.actions.introContinueClicked} />
        <BlockedMicOverlay currentShowOverlay={this.props.currentShowOverlay} />
        <SubmittedOverlay currentShowOverlay={this.props.currentShowOverlay} />
        <PermissionsOverlay currentShowOverlay={this.props.currentShowOverlay} onArrowClicked={this.onPermisionsArrowClicked} />
        <DemoSubmittedOverlay currentShowOverlay={this.props.currentShowOverlay} studentName={this.props.studentName} onLogoutClicked={() => {
          window.location.href = "/" // ** TODO **
        }} />

        {
          (this.props.readerState === ReaderStateOptions.countdownToStart) &&
          <CountdownOverlay countdownDuration={3} onCountdownFinished={() => {

            this.props.actions.countdownEnded()
          }} />
        }
      </div>
    );

  }


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
    for (let i = this.props.pageNumber + 1; i <= this.props.numPages && i <= this.props.pageNumber + PRELOAD_IMAGES_ADVANCE; i++) {
      preloadImageURLs.push(this.props.book.pages[i].img)
    }

    return (
      <div style={{'visibility': 'hidden', 'width': 0, 'height': 0, 'overflow': 'hidden'}}>
        {preloadImageURLs.map((preloadImage) => {
          return (
            <img key={preloadImage} src={preloadImage} />
          );
        })}
      </div>
    );
  }


  render()  {

    console.log('Rendering ReaderManager with ReaderState: ' + this.props.readerState)

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



