import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

import BackArrowButton from "../BackArrowButton";

export default class SpellingLetterBox extends React.Component {
  static propTypes = {};

  static defaultProps = {};

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

  renderLetter(letter) {
    return (
      <div key={letter} className={styles.letter}>
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
      <div>
        <div className={styles.fakeContainer} />
        <div className={styles.spellingLetterBox}>
          <div className={styles.alphabets}>
            {this.renderAlphabet(1)}
            {this.renderAlphabet(2)}
          </div>
          <BackArrowButton
            title="Back"
            inline
            style={{
              width: 95,
              height: 75,
              display: "inline-block",
              position: "relative",
              left: 25,
              top: -10
            }}
          />
        </div>
      </div>
    );
  }
}
