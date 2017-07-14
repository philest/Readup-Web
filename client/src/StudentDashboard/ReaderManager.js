//@flow



import PropTypes from 'prop-types';
import React from 'react';

import Reader from './Reader'

import styles from './styles.css'

import DoneModal from './components/modals/DoneModal'
import PausedModal from './components/modals/PausedModal'
import MicModal from './components/modals/MicModal'

import { Modal } from 'react-bootstrap'

import {
  HashRouter,
  Route,
  Redirect
} from 'react-router-dom'


const ReaderStateTypes = {
  unstarted: 'READER_STATE_UNSTARTED',
  inProgress: 'READER_STATE_IN_PROGRESS',
  paused: 'READER_STATE_PAUSED',
  done: 'READER_STATE_DONE',
}

// how many images in advance to load
const PRELOAD_IMAGES_ADVANCE = 3

// export type ReaderState = "teacher" | "parent" | "admin" | '';
// export type SignupFormKeys = $Keys<ReaderStateTypes>;



const sampleBook = {
  title: "Cezar Chavez",
  author: "Ginger Wordsworth",
  s3Key: 'rocket',
  description: "Mom gets to come along on a space adventure",
  numPages: 5,
  coverImage: '',
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
    3: {
      lines: [
        "This is the first line of the third page.",
        "This is the second line of the third page."
      ],
      img: 'http://cdn.wonderfulengineering.com/wp-content/uploads/2014/03/high-resolution-wallpapers-3-610x457.jpg',
    },
    4: {
      lines: [
        "This is the first line of the fourth page.",
        "This is the second line of the fourth page."
      ],
      img: 'http://cdn.wonderfulengineering.com/wp-content/uploads/2014/03/high-resolution-wallpapers-5-610x343.jpg',
    },
    5: {
      lines: [
        "This is the first line of the fifth page.",
        "The end."
      ],
      img: 'http://cdn.wonderfulengineering.com/wp-content/uploads/2014/03/high-resolution-wallpapers-6-610x381.jpg',
    },
  },  
}



export default class StudentDashboard extends React.Component {
  static propTypes = {
    studentName: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  constructor(props, _railsContext) {
    super(props);

    this.state = {  
      pageNumber: parseInt(this.props.match.params.page_number),
      storyId: this.props.match.params.story_id,
      numPages: Object.keys(sampleBook.pages).length,
      redirectForward: false,
      redirectBack: false,
      redirectInvalid: false,
      readerState: ReaderStateTypes.inProgress,
      lastImageIndexLoaded: 0,
    };

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
        pageNumber: newPageNumber,
      })

    }
    else if (newPageNumber != this.state.pageNumber) {
      this.setState({  
        pageNumber: newPageNumber,
        redirectForward: false,
        redirectBack: false,
        redirectInvalid: false,
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
      })
    }

  }

  // shouldComponentUpdate() {
  //   return true;
  // }

  /* Callbacks */

  onPauseClicked = () => {
    this.setState({ readerState: ReaderStateTypes.paused })
  }

  onUnpauseClicked = () => {
    console.log('!!!!!!')
    this.setState({ readerState: ReaderStateTypes.inProgress })
  }

  onStopClicked = () => {
    console.log("ON STOP!")
    this.setState({ readerState: ReaderStateTypes.done })
  }

  onTurnInClicked = () => {
    console.log('TURN IN')
  }

  onStartClicked = () => {
    console.log('ON START')
    this.setState({ redirectForward: true })
  }

  onStartOverClicked = () => {
    console.log('START OVER')
  }

  onHearRecordingClicked = () => {
    console.log('HEAR RECORDING')
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
    if (this.state.readerState === ReaderStateTypes.inProgress) {
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


  // The best way to preload images is just to render hidden img components, with src set to the url we want to load
  // That way they'll be cached by the browser for when we actually want to display them
  renderHiddenPreloadImages = () => {
    if (!PRELOAD_IMAGES_ADVANCE || this.state.lastImageIndexLoaded == this.state.numPages) {
      console.log('DONT NEED TO PRELOAD')
      return null
    } 

    let preloadImageURLs = []
    for (let i = this.state.pageNumber + 1; i <= this.state.numPages && i <= this.state.pageNumber + PRELOAD_IMAGES_ADVANCE; i++) {
      console.log(i)
      preloadImageURLs.push(sampleBook.pages[i].img)
    }

    console.log(preloadImageURLs)

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
    if (this.state.redirectInvalid) {
      return <Redirect key='invalid' push to={'/story/STORY_ID/page/1'} /> // Todo how to handle?
    }


    console.log('state::: ' + this.state.readerState)


    const ReaderComponent = this.renderReaderComponentWithProps()
    const ModalComponentOrNull = this.renderModalComponentOrNullBasedOnState()

    return (
      <div className={styles.fill}>
        { ReaderComponent }     
        { ModalComponentOrNull }
        { this.renderHiddenPreloadImages() }     
      </div>

       
    );
    
  }
}








