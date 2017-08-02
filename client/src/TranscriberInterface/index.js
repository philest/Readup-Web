import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import { Button } from 'react-bootstrap'

import FormattedMarkupText from '../sharedComponents/FormattedMarkupText'
import { sampleEvaluationText } from '../sharedComponents/sampleMarkup'





export default class TranscriberInterface extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired, // this is passed from the Rails view
  };


  constructor(props, _railsContext) {
    super(props);
    this.state = {
      evaluationTextData: sampleEvaluationText,
      highlightedParagraphIndex: null,
      highlightedWordIndex: null,
      highlightedIsSpace: null,
    }
  }

  componentWillMount() {
    document.addEventListener("keydown", this._handleKeyDown);

  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  _handleKeyDown = (event) => {

    // audio playback keys
    if (event.code === 'Space') {
      if (this.audioPlayer.paused) {
        this.audioPlayer.play()
      }      else {
        this.audioPlayer.pause()
      }

      event.preventDefault();

    } else if (event.code === 'ArrowLeft') {
      if (this.audioPlayer.currentTime < 2) {
        this.audioPlayer.currentTime = 0;
      }      else {
        this.audioPlayer.currentTime -= 2;
      }

    } else if (event.code === 'ArrowRight') {
      if (this.audioPlayer.currentTime > this.audioPlayer.duration - 2) {
        this.audioPlayer.currentTime = this.audioPlayer.duration
      }      else {
        this.audioPlayer.currentTime += 2;
      }
    }

    // grading keys
    // first ensure we have selected indices
    if (this.state.highlightedParagraphIndex == null || this.state.highlightedWordIndex == null) {
      return
    }

    const evaluationTextData = this.state.evaluationTextData


    if (event.code === 'KeyA' && this.state.highlightedIsSpace) {

      const addText = window.prompt('Enter the added word')

      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].addAfterWord = addText


      this.setState({ evaluationTextData })

    } else if (event.code === 'KeyS' && !this.state.highlightedIsSpace) {

      const subText = window.prompt('Enter the substituted word')

      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].substituteWord = subText
      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].wordDeleted = (subText != '')

      this.setState({ evaluationTextData })

    } else if (event.code === 'KeyD' && !this.state.highlightedIsSpace) {
      // toggle
      // TODO: convert to idx
      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].wordDeleted = !evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].wordDeleted
      this.setState({ evaluationTextData })
    }
     else if (event.code === 'KeyE') {
      // toggle
      evaluationTextData.readingEndIndex.paragraphIndex = this.state.highlightedParagraphIndex
      evaluationTextData.readingEndIndex.wordIndex = this.state.highlightedWordIndex

      this.setState({ evaluationTextData })
    }


  }


  _onMouseEnterWord = (paragraphIndex, wordIndex, isSpace) => {

    this.setState({
      highlightedParagraphIndex: paragraphIndex,
      highlightedWordIndex: wordIndex,
      highlightedIsSpace: isSpace,
    })

  }

  _onMouseLeaveWord = (paragraphIndex, wordIndex, isSpace) => {
    // TODO
    // is it possible for there to be a race condition where onMouseEnter of the target element is called before onMouseLeave of the previous element?
    // In that case, we'd accidentally null out the just selected here
    // Haven't observed that, but could eliminate below just to be safe
    this.setState({
      highlightedParagraphIndex: null,
      highlightedWordIndex: null,
      highlightedIsSpace: null,
    })
  }

  onSubmitClicked = () => {

  }

  setAudioPlayerRef = (ref) => {
    this.audioPlayer = ref
  }

  render() {

    return (
      <div className={styles.transcriberContainer}>

        <div className={styles.nameHeading}>
          {this.props.name}'s Demo
        </div>
        <div className={styles.emailHeading}>
          {this.props.email}
        </div>

        <audio
          ref={this.setAudioPlayerRef}
          className={styles.audioElement}
          controls
        >
          <source src={this.props.recordingURL} />
          <p>Playback not supported</p>
        </audio>




        <div className={styles.markupContainer}>
          <div className={styles.bookInfo}>
            <span className={styles.bookTitleHeading}>
              {this.props.bookTitle}
            </span>
            <span className={styles.bookLevelHeading}>
              {this.props.bookLevel}
            </span>
          </div>


          <FormattedMarkupText
            paragraphs={this.state.evaluationTextData.paragraphs}
            endParagraphIndex={this.state.evaluationTextData.readingEndIndex.paragraphIndex}
            endWordIndex={this.state.evaluationTextData.readingEndIndex.wordIndex}
            isInteractive
            onMouseEnterWord={this._onMouseEnterWord}
            onMouseLeaveWord={this._onMouseLeaveWord}
          />



        </div>


        <Button
          className={styles.submitButton}
          bsStyle={'primary'}
          bsSize={'large'}
          onClick={this.props.onSubmitClicked}
        >
          Submit
        </Button>



      </div>
    );
  }
}
