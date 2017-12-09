import PropTypes from "prop-types";
import React from "react";
import myStyles from "./styles.css";

import styles from "../StudentDashboard/styles.css";

import NavigationBar from "../StudentDashboard/components/NavigationBar";

import AssignBooks from "../sharedComponents/AssignBooks";
import LinkInfo from "../sharedComponents/LinkInfo";

export default class Signup extends React.Component {
  static propTypes = {
    userID: PropTypes.number,
    teacherName: PropTypes.string
  };

  static defaultProps = {};

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {};
  }

  renderNavigationBar = () => {
    let navProps = {
      className: styles.navBar,
      studentName: "Ms. Jones",
      showPauseButton: false,
      showBookInfo: false,
      isCoverPage: false,
      onExitClicked: () => {
        window.location.href = "/";
      },
      inComp: false,
      inSpelling: false
    };

    return <NavigationBar {...navProps} />;
  };

  render() {
    return (
      <div className={[styles.fullHeight, styles.fill].join(" ")}>
        {this.renderNavigationBar()}
        <style type="text/css">
          {".modal-dialog { margin: 16vh auto 0px; } "}
        </style>

        <div className={styles.contentContainer}>
          <AssignBooks userID={this.props.userID} />;
        </div>
      </div>
    );
  }
}
