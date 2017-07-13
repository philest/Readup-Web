import PropTypes from 'prop-types';
import React from 'react';

import Reader from './Reader'

import styles from './styles.css'

import PausedModal from './components/modals/PausedModal'

import {
  HashRouter,
  Route,
  Redirect
} from 'react-router-dom'



const sampleBook = {
  title: "Mom's Rocket",
  s3Key: 'rocket',
  description: "Mom gets to come along on a space adventure",
  pages: {
      1: {
        lines: [
            "This is the first line of the first page.",
            "This is the second line of the first page."
        ]
      },
      2: {
        lines: [
          "This is the first line of the second page.",
          "This is the second line of the second page."
        ]
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
      redirectForward: false,
      redirectBack: false,
      redirectInvalid: false,
      paused: false,
    };

    console.log("!!!!!! CONSTRUCTOR!!!!!!!")

  }

  componentDidUpdate(nextProps) {
    console.log('DIDUPDATE; path pagenumber =' + this.props.match.params.page_number)

    const newPageNumber = parseInt(this.props.match.params.page_number)

    if (newPageNumber < 1 || newPageNumber > Object.keys(sampleBook.pages).length) {
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
    if (newPageNumber < 1 || newPageNumber > Object.keys(sampleBook.pages).length) {
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

  onPauseRecordingClicked = () => {

  };

  onStopRecordingClicked = () => {

  };

  onNextPageClicked = () => {
    this.setState({ redirectForward: true })
  };

  onPreviousPageClicked = () => {
    this.setState({ redirectBack: true })
  };

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
      // Todo how to handle?
      return <Redirect key='invalid' push to={'/story/STORY_ID/page/1'} />
    }

    const readerProps = {
      studentName: this.props.studentName,
      pageNumber: this.state.pageNumber,
      textLines: sampleBook.pages[this.state.pageNumber].lines,
      imageURL: 'http://mediad.publicbroadcasting.net/p/shared/npr/201405/306846592.jpg', //TODO
      onNextPageClicked: this.onNextPageClicked,
      onPreviousPageClicked: this.onPreviousPageClicked,
      pathname: this.props.location.pathname
    }

    return <Reader {...readerProps} />
  }
}




