import PropTypes from "prop-types";
import React from "react";
import myStyles from "./styles.css";

import styles from "../StudentDashboard/styles.css";

import NavigationBar from "../StudentDashboard/components/NavigationBar";

import AssignBooks from "../sharedComponents/AssignBooks";
import LinkInfo from "../sharedComponents/LinkInfo";
import AddClass from "../sharedComponents/AddClass";

import { getClassLink } from "../ReportsInterface/emailHelpers";

let classLink;

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
    this.state = {
      showModal: false,
      showAddClass: true
    };
  }

  componentDidMount = () => {
    getClassLink(this.props.userID).then(res => {
      console.log("link? ", res.data);
      classLink = res.data;
    });
  };

  hideModal = () => {
    this.setState({ showModal: false });
  };

  hideAddClassModal = () => {
    this.setState({ showAddClass: false });
    this.setState({ showModal: true });
  };

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
          {this.state.showAddClass && <AddClass userID={this.props.userID} />}
          {this.state.showModal && (
            <AssignBooks
              userID={this.props.userID}
              hideModal={this.hideModal}
            />
          )}
          {!this.state.showModal &&
            !this.state.showAddClass && <LinkInfo classLink={classLink} />}
        </div>
      </div>
    );
  }
}
