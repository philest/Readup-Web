import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

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


          <div className={styles.textContainer}>

            <div className={styles.textParagraph}>
              <span className={styles.textWord}>When</span>&nbsp;<span className={styles.textWord}>the</span> <span className={styles.textWord}>moon</span> <span className={styles.textWord}>is</span> <span className={styles.textWord}>high</span> <span className={styles.textWord}>and</span> <span className={styles.textWord}>the</span> <span onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>stars</span> <span className={styles.textWord}>are</span> <span className={styles.textWord}>bright,</span> <span className={styles.textWord}>Daddy</span> <span className={styles.textWord}>tells</span> <span className={styles.textWord}>me,</span> <span className={styles.textWord}>"It's</span> <span className={styles.textWord}>a</span> <span className={styles.textWord}>firefly</span> <span className={styles.textWord}>night!"</span>
            </div>

            <div className={styles.textParagraph}>
              I hop off the porch. I feel the air. It warms my legs and tosses my hair.
            </div>

          </div>



        </div>




      </div>
    );
  }
}
