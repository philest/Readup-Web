import PropTypes from "prop-types";
import React from "react";
import myStyles from "./styles.css";

import styles from "../StudentDashboard/styles.css";

import NavigationBar from "../StudentDashboard/components/NavigationBar";

import AssignBooks from "../sharedComponents/AssignBooks";
import LinkInfo from "../sharedComponents/LinkInfo";
import AddClass from "../sharedComponents/AddClass";
import Name from "../sharedComponents/Name";
import ImportClass from "../sharedComponents/ImportClass";

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
      currentShowPageID: "ADD_CLASS_PAGE",
      currentShowModalID: "IMPORT_CLASS_MODAL",
      // currentShowPageID: this.props.userID ? "ASSIGN_BOOKS_PAGE" : "NAME_PAGE",
      userID: this.props.userID,
      importedStudents: []
      // currentShowPageID: this.props.isAddClass
      //   ? "ADD_CLASS_PAGE"
      //   : "ASSIGN_BOOKS_PAGE"
    };
  }

  importStudents = newStudentsArr => {
    let validNames = [];
    for (let i = 0; i < newStudentsArr.length; i++) {
      if (newStudentsArr[i].split(" ").length > 1) {
        validNames.push(newStudentsArr[i]);
      }
    }

    console.log("new student arr: ", validNames);

    this.setState({ importedStudents: validNames });

    console.log("new import arr: ", this.state.importedStudents);
  };

  updateUserID = userID => {
    this.setState({ userID: userID });
  };

  setCurrentShowPage = ID => {
    this.setState({ currentShowPageID: ID });
  };

  setCurrentShowModal = ID => {
    this.setState({ currentShowModalID: ID });
  };

  componentDidMount = () => {};

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
          {this.state.currentShowModalID === "IMPORT_CLASS_MODAL" && (
            <ImportClass
              hide={() => this.setCurrentShowModal("NO_MODAL")}
              importStudents={this.importStudents}
            />
          )}

          {this.state.currentShowPageID === "NAME_PAGE" && (
            <Name
              hide={() => this.setCurrentShowPage("ADD_CLASS_PAGE")}
              updateUserID={this.updateUserID}
            />
          )}

          {this.state.currentShowPageID === "ADD_CLASS_PAGE" && (
            <AddClass
              userID={this.props.userID || this.state.userID}
              hide={() => this.setCurrentShowPage("ASSIGN_BOOKS_PAGE")}
              showImport={() => this.setCurrentShowModal("IMPORT_CLASS_MODAL")}
              importedStudents={this.state.importedStudents}
            />
          )}
          {this.state.currentShowPageID === "ASSIGN_BOOKS_PAGE" && (
            <AssignBooks
              userID={this.props.userID || this.state.userID}
              hideModal={() => this.setCurrentShowPage("LINK_INFO_PAGE")}
            />
          )}
          {this.state.currentShowPageID === "LINK_INFO_PAGE" && (
            <LinkInfo userID={this.props.userID || this.state.userID} />
          )}
        </div>
      </div>
    );
  }
}
