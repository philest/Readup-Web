import PropTypes from "prop-types";
import React from "react";

import styles from "./styles.css";
// import ReportStyles from "../../../ReportsInterface/styles.css";

export default class FinishedImage extends React.Component {
  static propTypes = {};

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.submittedContainer}>
        <h4 className={styles.title}>The End!</h4>
        <img
          src="/images/dashboard/Little-girl-jumping.png"
          className={[
            styles.submittedImage,
            "fa",
            "animated",
            "faa-slow",
            "faa-tada"
          ].join(" ")}
        />
        <p className={styles.subtitle}>You are done!</p>
      </div>
    );
  }
}
