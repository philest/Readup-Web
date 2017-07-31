import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import { sampleEvaluationText } from './sampleText'




export default class TranscriberInterface extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    this.state = { name: this.props.name };

    console.log(sampleEvaluationText)
  }

  componentWillMount() {
    document.addEventListener("keydown", this._handleKeyDown);

  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
  }



  updateName = (name) => {
    this.setState({ name });
  };

  mouseEnter = (event) => {
    console.log('enter')
    console.log(event.target)
    console.log(event.currentTarget)
  }

  mouseLeave = (event) => {
    console.log('leave')
  }

  _handleKeyDown = (event) => {

    // audio playback keys
    if (event.code === 'Space') {
      console.log(this.refs)
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
    else if (event.code === 'KeyA') {

    }
    else if (event.code === 'KeyS') {
      
    }
    else if (event.code === 'KeyD') {
      
    }
    else if (event.code === 'KeyE') {
      
    }

    
  }

  render() {

    const FormattedWord = ({wordDict}) => (
      <span>
        <span className={styles.textWord}>{wordDict.word}</span>
        <span className={styles.textWord}>&nbsp;&nbsp;&nbsp;</span>
      </span>
    );


    const FormattedText = ({paragraphs}) => (
      <div className={styles.textContainer}>

        {paragraphs.map(paragraph => (
          <div className={styles.textParagraph} key={paragraph.key}>

            {paragraph.words.map((wordDict, index) => (
              <FormattedWord wordDict={wordDict} key={paragraph.key + index} />
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


          <FormattedText paragraphs={sampleEvaluationText.paragraphs} />



        </div>




      </div>
    );
  }
}
