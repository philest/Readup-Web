import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

import BackArrowButton from "../BackArrowButton";
import VolumeIndicator from "../VolumeIndicator";
import SkipPrompt from "../SkipPrompt";

import { playSoundAsync } from "../../audioPlayer";

export default class SpellingLetterBox extends React.Component {
  static propTypes = {
    onSpellingInputSet: PropTypes.func,
    spellingInput: PropTypes.string,
    onSpellingAnswerGiven: PropTypes.func,
    hasVolume: PropTypes.bool,
    hearAgainClicked: PropTypes.func,
    onSkipClicked: PropTypes.func
  };

  static defaultProps = {
    spellingInput: ""
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      myClass: {}
    };
  }

  componentWillMount() {
    if (process.env.NODE_ENV === "production") {
      // disable right click in prod..
      document.oncontextmenu = new Function("return false;");
      document.onselectstart = new Function("return false;");
    }
  }

  addLetter(letter) {
    playSoundAsync("/audio/keypress.mp3");
    this.props.onSpellingAnswerGiven(true);
    this.props.onSpellingInputSet(this.props.spellingInput + letter);
  }

  backspace() {
    playSoundAsync("/audio/keypress.mp3");

    console.log("spellingInput: ", this.props.spellingInput);

    if (this.props.spellingInput.length > 0) {
      this.props.onSpellingInputSet(this.props.spellingInput.slice(0, -1));
    }
  }

  renderLetter(letter) {
    return (
      <div
        key={letter}
        className={styles.letter}
        onClick={() => {
          this.addLetter(letter);
        }}
      >
        {letter}
      </div>
    );
  }

  renderAlphabet(part) {
    let arr = [];
    let alphabet = "abcdefghijklmnopqrstuvwxyz";

    if (part == 1) {
      for (let i = 0; i < 13; i++) {
        arr.push(this.renderLetter(alphabet[i]));
      }
    } else {
      for (let i = 13; i < 26; i++) {
        arr.push(this.renderLetter(alphabet[i]));
      }
    }

    return <div className={styles.halfAlphabetContainer}>{arr}</div>;
  }

  render() {
    return (
      <div className={styles.containerForBoxAndVolume}>
        <div
          className={styles.spellingLetterBox}
          style={{
            position: "relative",
            left: this.props.hasVolume ? 50 : 0,
            display: "inline-block"
          }}
        >
          <div className={styles.alphabets}>
            {this.renderAlphabet(1)}
            {this.renderAlphabet(2)}
          </div>
          <BackArrowButton
            title="Back"
            inline
            red
            style={{
              width: 95,
              height: 85,
              display: "inline-block",
              position: "relative",
              left: 14,
              top: -25
            }}
            onClick={() => {
              this.backspace();
            }}
          />
        </div>
        {this.props.hasVolume && (
          <VolumeIndicator
            hearAgainClicked={this.props.hearAgainClicked}
            offsetLeft
            hideOnSmallScreen
            onSkipClicked={this.props.onSkipClicked}
          />
        )}
      </div>
    );
  }
}
