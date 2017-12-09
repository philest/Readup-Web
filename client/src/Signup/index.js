import PropTypes from "prop-types";
import React from "react";
import myStyles from "./styles.css";

import styles from "../StudentDashboard/styles.css";

import NavigationBar from "../StudentDashboard/components/NavigationBar";

import AssignBooks from "../sharedComponents/AssignBooks";
import LinkInfo from "../sharedComponents/LinkInfo";
import AddClass from "../sharedComponents/AddClass";
import Name from "../sharedComponents/Name";

import { getClassLink } from "../ReportsInterface/emailHelpers";

let classLink;

export default class Signup extends React.Component {
  static propTypes = {
    userID: PropTypes.number,
    teacherName: PropTypes.string,
    isAddClass: PropTypes.bool
  };

  static defaultProps = {};

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      currentShowPageID: "NAME_PAGE"
      // currentShowPageID: this.props.isAddClass
      //   ? "ADD_CLASS_PAGE"
      //   : "ASSIGN_BOOKS_PAGE"
    };
  }

  setCurrentShowPage = ID => {
    this.setState({ currentShowPageID: ID });
  };

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
          {this.state.currentShowPageID === "NAME_PAGE" && (
            <Name hide={() => this.setCurrentShowPage("ADD_CLASS_PAGE")} />
          )}

          {this.state.currentShowPageID === "ADD_CLASS_PAGE" && (
            <AddClass
              userID={this.props.userID}
              hide={() => this.setCurrentShowPage("ASSIGN_BOOKS_PAGE")}
            />
          )}
          {this.state.currentShowPageID === "ASSIGN_BOOKS_PAGE" && (
            <AssignBooks
              userID={this.props.userID}
              hideModal={() => this.setCurrentShowPage("LINK_INFO_PAGE")}
            />
          )}
          {this.state.currentShowPageID === "LINK_INFO_PAGE" && (
            <LinkInfo classLink={classLink} />
          )}
        </div>
      </div>
    );
  }
}
