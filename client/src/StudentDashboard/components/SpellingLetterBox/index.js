import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import Avatar from "../Avatar";

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
    return <div className={styles.letter}>{letter}</div>;
  }

  renderAlphabet() {
    let arr = [];
    let alphabet = "abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < 26; i++) {
      arr.push(this.renderLetter(alphabet[i]));
    }

    return <div className={styles.alphabetContainer}>{arr}</div>;
  }

  render() {
    return (
      <div className={styles.spellingLetterBox}>{this.renderAlphabet()}</div>
    );
  }
}
