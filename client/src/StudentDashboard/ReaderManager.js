//@flow



import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux'

import * as actionCreators from './state'
import { bindActionCreators } from 'redux'

import Reader from './Reader'
import Recorder from './recorder' 

import { ReaderStateOptions, ReaderState, MicPermissionsStatusOptions, MicPermissionsStatus } from './types'

import styles from './styles.css'

import DoneModal from './modals/DoneModal'
import PausedModal from './modals/PausedModal'
import MicModal from './modals/MicModal'
import PlaybackModal from './modals/PlaybackModal'

import SubmittedModal from './modals/SubmittedModal'
import PermissionsModal from './modals/PermissionsModal'

import { Modal } from 'react-bootstrap'

import {
  HashRouter,
  Route,
  Redirect
} from 'react-router-dom'


// TODO PUT IN OWN FILE


// how many images in advance to load
const PRELOAD_IMAGES_ADVANCE = 3



const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia);




function mapStateToProps (state) {
  console.log(state)
  return {
    // micEnabled: state.reader.micEnabled,
    pageNumber: state.reader.pageNumber,
    readerState: state.reader.readerState,
    numPages: state.reader.book.numPages,
    book: state.reader.book,
    recorder: state.reader.recorder, // TODO probably shouldn't have access
  }
}

function mapDispatchToProps (dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
}


class StudentDashboard extends React.Component {
  static propTypes = {
    studentName: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  constructor(props, _railsContext) {
    super(props);
    console.log(props)

    

  }


  componentWillMount() {

    if (!Recorder.browserSupportsRecording()) {
      alert("Your browser cannot record audio. Please switch to Chrome or Firefox.")
      return
    }

    Recorder.hasRecordingPermissions((hasPermissions) => {
      console.log("We have permissions? " + hasPermissions)
      if (hasPermissions) {
        this.props.actions.setMicPermissions(MicPermissionsStatusOptions.granted)
      }
      else {
        this.props.actions.setMicPermissions(MicPermissionsStatusOptions.awaiting)
        this.props.recorder.initialize((error) => {
          // User responded to permissions request
          if (error) {
            this.props.actions.setMicPermissions(MicPermissionsStatusOptions.blocked)
          }
          else {
            this.props.actions.setMicPermissions(MicPermissionsStatusOptions.granted)
          }

        })
      }
    });

  }

  componentDidUpdate(nextProps) {
    console.log('ReaderManager updated to pageNumber:  ' + this.props.pageNumber)
  }


  /* Callbacks */

  onPauseClicked = () => {
    console.log('PAUSE CLICKED')
    this.props.actions.pauseRecording()
  }

  onUnpauseClicked = () => {
    console.log('UNPAUSE CLICKED')
    this.props.actions.resumeRecording()
  }

  onStopClicked = () => {
    console.log("STOP CLICKED")
    this.props.actions.stopRecording()
  }

  onTurnInClicked = () => {
    console.log('TURN IN CLICKED')
    this.props.actions.submitRecording()
  }

  onStartClicked = () => {
    console.log('START CLICKED')
    this.props.actions.startRecording()
  }

  onStartOverClicked = () => {
    console.log('START OVER CLICKED')
    this.props.actions.restartRecording()
  }

  onHearRecordingClicked = () => {
    console.log('HEAR RECORDING CLICKED')
    this.props.actions.playbackRecording()
  }

  onNextPageClicked = () => {
    console.log('NEXT PAGE CLICKED')
    this.props.actions.incrementPage()
  }

  onPreviousPageClicked = () => {
    console.log('PREVIOUS PAGE CLICKED')
    this.props.actions.decrementPage()
  }



  /* Rendering */

  // Returns a Reader component with /prop/er props based on page number
  renderReaderComponentWithProps = () => {
    const basicReaderProps = {
      // stuff that doesn't change with page number
      studentName: this.props.studentName,
      pathname: this.props.location.pathname,
    }

    let readerProps = basicReaderProps // reader props is augmented then stuck into Reader


    if (this.props.pageNumber == 0) { // cover
      readerProps = {
        ...readerProps,
        showCover: true,
        coverImageURL: this.props.book.coverImage,
        bookTitle: this.props.book.title,
        bookAuthor: this.props.book.author,
        onStartClicked: this.onStartClicked,
      }
    }
    else { // any other page... need to check ReaderState? I don't think so....
      readerProps = {
        ...readerProps,
        pageNumber: this.props.pageNumber,
        textLines: this.props.book.pages[this.props.pageNumber].lines,
        imageURL: this.props.book.pages[this.props.pageNumber].img,
        isFirstPage: (this.props.pageNumber == 1),
        isLastPage: (this.props.pageNumber == this.props.numPages),
        onPreviousPageClicked: this.onPreviousPageClicked,
        onPauseClicked: this.onPauseClicked,
        onNextPageClicked: (this.props.pageNumber == this.props.numPages) ? null : this.onNextPageClicked,
        onStopClicked: (this.props.pageNumber == this.props.numPages) ? this.onStopClicked : null,
      }
    }

    return <Reader {...readerProps} />
  }


  renderModalComponentOrNullBasedOnState = () => {

    let ModalContentComponent = null;
    if (this.props.readerState === ReaderStateOptions.paused) {
      ModalContentComponent =
        <PausedModal
          onContinueClicked={this.onUnpauseClicked}
          onStartOverClicked={this.onStartOverClicked}
          onTurnInClicked={this.onTurnInClicked}
        />
    }
    else if (this.props.readerState === ReaderStateOptions.doneDisplayingPlayback) {
      ModalContentComponent =
        <PlaybackModal
          audioSrc={this.props.recorder.getBlobURL()}
          onStartOverClicked={this.onStartOverClicked}
          onTurnInClicked={this.onTurnInClicked}
        />
    }
    else if (this.props.readerState === ReaderStateOptions.done) {
      ModalContentComponent =
        <DoneModal
          onHearRecordingClicked={this.onHearRecordingClicked}
          onTurnInClicked={this.onTurnInClicked}
        />
    }
    else {
      return null
    }


    return (
      <Modal
        dialogClassName={styles.doneModalDialog}
        className={styles.doneModal}
        show={true}
        onHide={this.close}
        animation={true}
      >
        { ModalContentComponent }
      </Modal>
    );
  }

  renderOverlayOrNullBasedOnState = () => {
    if (this.props.readerState === ReaderStateOptions.submitted) {
      return <SubmittedModal />
    }
    else if (this.props.readerState === ReaderStateOptions.awaitingPermissions) {
      return <PermissionsModal />
    }
    return null
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

    console.log('Rendering with reader State: ' + this.props.readerState)


    if (this.props.readerState === ReaderStateOptions.initializing) {
      return <div className={styles.fill} style={{ backgroundColor: 'black' }} />
    }

    if (this.props.readerState === ReaderStateOptions.permissionsBlocked) {
      return (
        <div>You blocked us!</div>
      );
    }


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



