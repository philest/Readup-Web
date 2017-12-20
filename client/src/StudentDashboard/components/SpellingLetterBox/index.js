import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

import BackArrowButton from "../BackArrowButton";

export default class SpellingLetterBox extends React.Component {
  static propTypes = {
    onSpellingInputSet: PropTypes.func,
    spellingInput: PropTypes.string
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

  addLetter(letter) {
    this.props.onSpellingInputSet(this.props.spellingInput + letter);
  }

  backspace() {
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
      <div className={styles.spellingLetterBox}>
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
    );
  }
}
