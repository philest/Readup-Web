import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import { sampleEvaluationText } from './sampleText'


class TextWord extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    isSpace: PropTypes.bool,
    strikethrough: PropTypes.bool,
    wordAbove: PropTypes.string,
    paragraphIndex: PropTypes.number,
    wordIndex: PropTypes.number,
    isEndWord: PropTypes.bool,
    grayedOut: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
  };
  static defaultProps = {
    isSpace: false,
    isEndWord: false,
    strikethrough: false,
    grayedOut: false,
    wordAbove: null,
  };

  constructor(props) {
    super(props)
    this.state = { highlighted: false }
    // console.log('CONSTRUCT')
  }

  _onMouseEnter = () => {
    // this.setState({ highlighted: true })
    // console.log('highlighted: ' + this.props.paragraphIndex + ' - ' + this.props.wordIndex)
    this.props.onMouseEnter(this.props.paragraphIndex, this.props.wordIndex, this.props.isSpace)
  }

  _onMouseLeave = () => {
    // this.setState({ highlighted: false })
    // console.log('unhighlighted: ' + this.props.paragraphIndex + ' - ' + this.props.wordIndex)
    this.props.onMouseLeave(this.props.paragraphIndex, this.props.wordIndex, this.props.isSpace)
  }

  render() {

    let wordClassNameString = this.props.strikethrough ? [styles.textWord, styles.strikethrough].join(' ') : styles.textWord
    if (this.props.grayedOut) {
      wordClassNameString += (' ' + styles.grayedOut)
    }

    return (
      <span className={styles.wordWrapper}>
        
        <span className={wordClassNameString} onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
          {this.props.isSpace && '\u00A0\u00A0\u00A0'}
          {!this.props.isSpace && this.props.text}
        </span>

        {this.props.wordAbove && this.props.wordAbove !== '' &&
          <span className={this.props.isSpace ? styles.wordAboveSpace : styles.wordAbove}>
            {this.props.wordAbove}
            {this.props.isSpace &&
              <i className={["fa fa-chevron-up", styles.addChevron].join(' ')} aria-hidden={"true"}></i>
            }
          </span>
        }

        {this.props.isEndWord &&
          <span className={styles.endingSlashes}>
            //
          </span>
        }

      </span>
    );
  }
}


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
      if (this.refs.audioPlayer.paused) {
        this.refs.audioPlayer.play()
      }
      else {
        this.refs.audioPlayer.pause()
      }
      
      event.preventDefault();
    }
    else if (event.code === 'ArrowLeft') {
      if (this.refs.audioPlayer.currentTime < 2) {
        this.refs.audioPlayer.currentTime = 0;
      }
      else {
        this.refs.audioPlayer.currentTime -= 2;
      }
    }
    else if (event.code === 'ArrowRight') {
      if (this.refs.audioPlayer.currentTime > this.refs.audioPlayer.duration - 2) {
        this.refs.audioPlayer.currentTime = this.refs.audioPlayer.duration
      }
      else {
        this.refs.audioPlayer.currentTime += 2;
      }
    }

    // grading keys
    // first ensure we have selected indices
    if (this.state.highlightedParagraphIndex == null || this.state.highlightedWordIndex == null) {
      return
    }

    var evaluationTextData = this.state.evaluationTextData


    if (event.code === 'KeyA' && this.state.highlightedIsSpace) {

      const addText = window.prompt('Enter the added word')

      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].addAfterWord = addText


      this.setState({evaluationTextData: evaluationTextData})
    }
    else if (event.code === 'KeyS' && !this.state.highlightedIsSpace) {

      const subText = window.prompt('Enter the substituted word')

      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].substituteWord = subText
      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].wordDeleted = (subText != '')

      this.setState({evaluationTextData: evaluationTextData})
    }
    else if (event.code === 'KeyD' && !this.state.highlightedIsSpace) {
      // toggle
      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].wordDeleted = !evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].wordDeleted

      
      this.setState({evaluationTextData: evaluationTextData})
    }
    else if (event.code === 'KeyE') {
      // toggle
      evaluationTextData.readingEndIndex.paragraphIndex = this.state.highlightedParagraphIndex
      evaluationTextData.readingEndIndex.wordIndex = this.state.highlightedWordIndex
     
     this.setState({evaluationTextData: evaluationTextData})
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

  render() {

    const FormattedWord = ({wordDict}) => (
      <span>
        <span className={styles.textWord}>{wordDict.word}</span>
        <span className={styles.textWord}>&nbsp;&nbsp;&nbsp;</span>
      </span>
    );


    const endPindex = this.state.evaluationTextData.readingEndIndex.paragraphIndex
    const endWindex = this.state.evaluationTextData.readingEndIndex.wordIndex


    const FormattedText = ({paragraphs}) => (

      <div className={styles.textContainer}>

        {paragraphs.map((paragraph, pIndex) => (
          <div className={styles.textParagraph} key={paragraph.key}>

            {paragraph.words.map((wordDict, wIndex) => (

              <span key={paragraph.key + wIndex}>
                <TextWord 
                  text={wordDict.word}
                  isSpace={false}
                  isEndWord={(pIndex == endPindex && wIndex == endWindex)}
                  grayedOut={(pIndex > endPindex || (pIndex == endPindex && wIndex > endWindex))}
                  strikethrough={wordDict.wordDeleted}
                  wordAbove={wordDict.substituteWord}
                  paragraphIndex={pIndex}
                  wordIndex={wIndex}
                  onMouseEnter={this._onMouseEnterWord}
                  onMouseLeave={this._onMouseLeaveWord}
                  key={paragraph.key + '_' + pIndex + '_' + wIndex}
                />

                <TextWord text={'SPACE'} isSpace={true} wordAbove={wordDict.addAfterWord} paragraphIndex={pIndex} wordIndex={wIndex} onMouseEnter={this._onMouseEnterWord} onMouseLeave={this._onMouseLeaveWord} key={paragraph.key + '_' + pIndex + '_' + wIndex + '_space'} />
              </span>
            ))}
            
          </div>
        ))}
      </div>

    );



    return (
      <div className={styles.transcriberContainer}>

        <div className={styles.nameHeading}>
          {this.props.name}'s Demo
        </div>
        <div className={styles.emailHeading}>
          {this.props.email}
        </div>

        <audio controls ref={"audioPlayer"} className={styles.audioElement}>
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


          <FormattedText paragraphs={this.state.evaluationTextData.paragraphs} />



        </div>




      </div>
    );
  }
}
