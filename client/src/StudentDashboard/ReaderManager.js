//@flow



import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux'

import Reader from './Reader'

import Recorder from './recorder'

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


const ReaderStateTypes = {
  awaitingPermissions: 'READER_STATE_AWAITING_PERMISSIONS',
  awaitingStart: 'READER_STATE_AWAITING_START',
  inProgress: 'READER_STATE_IN_PROGRESS',
  paused: 'READER_STATE_PAUSED',
  done: 'READER_STATE_DONE',
  doneDisplayingPlayback: 'READER_STATE_PLAYBACK',
  submitted: 'READER_STATE_SUBMITTED',
}

// how many images in advance to load
const PRELOAD_IMAGES_ADVANCE = 3

// export type ReaderState = "teacher" | "parent" | "admin" | '';
// export type SignupFormKeys = $Keys<ReaderStateTypes>;


const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia);


const sampleBook = {
  title: "Cezar Chavez",
  author: "Ginger Wordsworth",
  s3Key: 'rocket',
  description: "Mom gets to come along on a space adventure",
  numPages: 2,
  coverImage: 'https://marketplace.canva.com/MAB___U-clw/1/0/thumbnail_large/canva-yellow-lemon-children-book-cover-MAB___U-clw.jpg',
  pages: {
    1: {
      lines: [
          "This is the first line of the first page.",
          "This is the second line of the first page."
      ],
      img: 'http://cdn.wonderfulengineering.com/wp-content/uploads/2014/03/high-resolution-wallpapers-1-610x381.jpg',
    },
    2: {
      lines: [
        "This is the first line of the second page.",
        "This is the second line of the second page."
      ],
      img: 'http://mediad.publicbroadcasting.net/p/shared/npr/201405/306846592.jpg',
    },
    // 3: {
    //   lines: [
    //     "This is the first line of the third page.",
    //     "This is the second line of the third page."
    //   ],
    //   img: 'http://cdn.wonderfulengineering.com/wp-content/uploads/2014/03/high-resolution-wallpapers-3-610x457.jpg',
    // },
    // 4: {
    //   lines: [
    //     "This is the first line of the fourth page.",
    //     "This is the second line of the fourth page."
    //   ],
    //   img: 'http://cdn.wonderfulengineering.com/wp-content/uploads/2014/03/high-resolution-wallpapers-5-610x343.jpg',
    // },
    // 5: {
    //   lines: [
    //     "This is the first line of the fifth page.",
    //     "The end."
    //   ],
    //   img: 'http://cdn.wonderfulengineering.com/wp-content/uploads/2014/03/high-resolution-wallpapers-6-610x381.jpg',
    // },
  },
};

function mapStateToProps (state) {
  console.log(state)
  return {
    micEnabled: state.reader.micEnabled
  }
}



class StudentDashboard extends React.Component {
  static propTypes = {
    studentName: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  constructor(props, _railsContext) {
    super(props);
    console.log(props)

    if (!Recorder.browserSupportsRecording()) {
      alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.")
      return
    }

    this.state = {
      pageNumber: parseInt(this.props.match.params.page_number),
      storyId: this.props.match.params.story_id,
      numPages: Object.keys(sampleBook.pages).length,
      redirectForward: false,
      redirectBack: false,
      redirectInvalid: false,
      redirectCover: false,
      readerState:  ReaderStateTypes.awaitingPermissions,
      lastImageIndexLoaded: 0,
      recorder: new Recorder(),
    };

    Recorder.hasRecordingPermissions((hasPermissions) => {
      console.log("We have permissions? " + hasPermissions)
      if (hasPermissions) {
        this.setState({ readerState: ReaderStateTypes.awaitingStart })
        this.state.recorder.initialize()
      }
      else {
        this.state.recorder.initialize((error) => {
          console.log('okay now we got it')
          if (error) {
            console.log('ReaderManager encountered recorder error!!')
            alert('Did you block microphone access?')
          }
          else {
            this.setState({ readerState: ReaderStateTypes.awaitingStart })
          }

        })
      }
    });





  }

  componentDidUpdate(nextProps) {
    console.log('DIDUPDATE; path pagenumber =' + this.props.match.params.page_number)

    const newPageNumber = parseInt(this.props.match.params.page_number)

    if (newPageNumber < 0 || newPageNumber > Object.keys(sampleBook.pages).length) {
      console.log('redirecting due to invalid page number')
      this.setState({
        redirectInvalid: true,
        redirectForward: false,
        redirectBack: false,
        redirectCover: false,
        pageNumber: newPageNumber,
      })

    }
    else if (newPageNumber != this.state.pageNumber) {
      this.setState({
        pageNumber: newPageNumber,
        redirectForward: false,
        redirectBack: false,
        redirectInvalid: false,
        redirectCover: false,
        showDoneModal: false,
      });
    }


  }

  componentWillMount() {
    // Need to check for invalid page number here too, because didUpdate isn't called on first time
    const newPageNumber = parseInt(this.props.match.params.page_number)
    if (newPageNumber < 0 || newPageNumber > Object.keys(sampleBook.pages).length) {
      this.setState({
        redirectInvalid: true,
        redirectForward: false,
        redirectBack: false,
        redirectCover: false,
      })
    }

  }


  ////

  // shouldComponentUpdate() {
  //   return true;
  // }

  /* Callbacks */

  onPauseClicked = () => {
    this.setState({ readerState: ReaderStateTypes.paused })
    this.state.recorder.pauseRecording()
  }

  onUnpauseClicked = () => {
    console.log('!!!!!!')
    this.setState({ readerState: ReaderStateTypes.inProgress })
    this.state.recorder.resumeRecording()
  }

  onStopClicked = () => {
    console.log("ON STOP!")
    this.state.recorder.stopRecording()
    this.setState({ readerState: ReaderStateTypes.done })
  }

  onTurnInClicked = () => {
    console.log('TURN IN')
    // submit to server, then...
    this.setState({ readerState: ReaderStateTypes.submitted })

    // redirect home
    setTimeout(() => {
      window.location.href = "/" // TODO where to redirect?
    }, 5000)
  }

  onStartClicked = () => {
    console.log('ON START')
    this.state.recorder.startRecording()
    this.setState({ redirectForward: true })
  }

  onStartOverClicked = () => {
    console.log('START OVER')
    this.state.recorder.reset()
    this.setState({
      redirectCover: true,
      readerState: ReaderStateTypes.inProgress,
    })
  }

  onHearRecordingClicked = () => {
    console.log('HEAR RECORDING')
    this.setState({ readerState: ReaderStateTypes.doneDisplayingPlayback })
  }

  onNextPageClicked = () => {
    console.log('asdfasfsff!!!')
    this.setState({ redirectForward: true })
  }

  onPreviousPageClicked = () => {
    this.setState({ redirectBack: true })
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


    if (this.state.pageNumber == 0) { // cover
      readerProps = {
        ...readerProps,
        showCover: true,
        coverImageURL: sampleBook.coverImage,
        bookTitle: sampleBook.title,
        bookAuthor: sampleBook.author,
        onStartClicked: this.onStartClicked,
      }
    }
    else { // any other page... need to check ReaderState? I don't think so....
      readerProps = {
        ...readerProps,
        pageNumber: this.state.pageNumber,
        textLines: sampleBook.pages[this.state.pageNumber].lines,
        imageURL: sampleBook.pages[this.state.pageNumber].img,
        isFirstPage: (this.state.pageNumber == 1),
        isLastPage: (this.state.pageNumber == this.state.numPages),
        onPreviousPageClicked: this.onPreviousPageClicked,
        onPauseClicked: this.onPauseClicked,
        onNextPageClicked: (this.state.pageNumber == this.state.numPages) ? null : this.onNextPageClicked,
        onStopClicked: (this.state.pageNumber == this.state.numPages) ? this.onStopClicked : null,
      }
    }

    return <Reader {...readerProps} />
  }


  renderModalComponentOrNullBasedOnState = () => {
    if (this.state.readerState === ReaderStateTypes.inProgress || this.state.readerState === ReaderStateTypes.awaitingStart || this.state.readerState === ReaderStateTypes.awaitingPermissions || this.state.readerState === ReaderStateTypes.submitted) {
      // no modal
      return null;
    }

    let ModalContentComponent = null;
    if (this.state.readerState === ReaderStateTypes.paused) {
      ModalContentComponent =
        <PausedModal
          onContinueClicked={this.onUnpauseClicked}
          onStartOverClicked={this.onStartOverClicked}
          onTurnInClicked={this.onTurnInClicked}
        />
    }
    else if (this.state.readerState === ReaderStateTypes.doneDisplayingPlayback) {
      ModalContentComponent =
        <PlaybackModal
          audioSrc={this.state.recorder.getBlobURL()}
          onStartOverClicked={this.onStartOverClicked}
          onTurnInClicked={this.onTurnInClicked}
        />
    }
    else if (this.state.readerState === ReaderStateTypes.done) {
      ModalContentComponent =
        <DoneModal
          onHearRecordingClicked={this.onHearRecordingClicked}
          onTurnInClicked={this.onTurnInClicked}
        />
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
    if (this.state.readerState === ReaderStateTypes.submitted) {
      return <SubmittedModal />
    }
    else if (this.state.readerState === ReaderStateTypes.awaitingPermissions) {
      return <PermissionsModal />
    }
    return null
  }


  // The best way to preload images is just to render hidden img components, with src set to the url we want to load
  // That way they'll be cached by the browser for when we actually want to display them
  renderHiddenPreloadImages = () => {

    // the image loading blocks chrome from checking if microphone access exists,
    // so don't do any preloading if we're awaiting permissions
    if (!PRELOAD_IMAGES_ADVANCE || this.state.readerState == ReaderStateTypes.awaitingPermissions) {
      console.log('DONT NEED TO PRELOAD')
      return null
    }

    let preloadImageURLs = []
    for (let i = this.state.pageNumber + 1; i <= this.state.numPages && i <= this.state.pageNumber + PRELOAD_IMAGES_ADVANCE; i++) {
      preloadImageURLs.push(sampleBook.pages[i].img)
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

    // Catch redirection
    // Setting the keys is !important, see: https://github.com/ReactTraining/react-router/issues/5273
    if (this.state.redirectForward) {
      return <Redirect key='forward' push to={'/story/STORY_ID/page/'+(this.state.pageNumber+1)} />
    }
    if (this.state.redirectBack) {
      return <Redirect key='back' push to={'/story/STORY_ID/page/'+(this.state.pageNumber-1)} />
    }
    if (this.state.redirectCover) {
      return <Redirect key='back' push to={'/story/STORY_ID/page/0'} />
    }
    if (this.state.redirectInvalid) {
      return <Redirect key='invalid' push to={'/story/STORY_ID/page/1'} /> // Todo how to handle?
    }



    console.log('state::: ' + this.state.readerState)


    const ReaderComponent = this.renderReaderComponentWithProps()
    const ModalComponentOrNull = this.renderModalComponentOrNullBasedOnState()
    const OverlayOrNull = this.renderOverlayOrNullBasedOnState()


    console.log(OverlayOrNull)

    return (
      <div className={styles.fill}>
        { ReaderComponent }
        { ModalComponentOrNull }
        { this.renderOverlayOrNullBasedOnState() }
        { this.renderHiddenPreloadImages() }
      </div>


    );

  }
}




export default connect(mapStateToProps)(StudentDashboard)



