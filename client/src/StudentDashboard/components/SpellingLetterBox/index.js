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

  render() {
    return <div className={styles.spellingLetterBox} />;
  }
}
