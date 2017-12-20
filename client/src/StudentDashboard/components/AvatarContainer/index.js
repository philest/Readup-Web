import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import Avatar from "../Avatar";

import {
  getAllStudents,
  getAllAssessments,
  getTeacher
} from "../../../ReportsInterface/emailHelpers";

import { library } from "../../../sharedComponents/bookObjects.js";

let colorArr = ["teal", "purple", "green", "blue"];
let offsetArr = ["left", "right"];

let teacherSignature = "Your Class";

function getStepforName(name, myClass) {
  for (let i = 1; i <= myClass.numStudents; i++) {
    if (name === myClass[i].name) {
      return myClass[i].bookKey;
    }
  }
}

export default class AvatarContainer extends React.Component {
  static propTypes = {
    onStudentNameSet: PropTypes.func.isRequired,
    onBookSet: PropTypes.func.isRequired,
    onAvatarClicked: PropTypes.func.isRequired,
    onSetCurrentOverlay: PropTypes.func,
    students: PropTypes.array,
    assessments: PropTypes.array,
    teacherSignature: PropTypes.string
  };

  static defaultProps = {
    students: [],
    assessments: [],
    teacherSignature: "Loading"
  };

  renderAvatars = myClass => {
    const nameArr = [];

    // create the name array
    for (let i = 1; i <= myClass.numStudents; i++) {
      nameArr.push(myClass[i].name);
    }

    nameArr.sort();

    const avatarArray = [];

    // TODO does not actually match books

    for (let i = 0; i < myClass.numStudents; i++) {
      let bookKey = getStepforName(nameArr[i], myClass);

      avatarArray.push(
        <Avatar
          key={i}
          fullName={nameArr[i]}
          bookKey={bookKey}
          color={colorArr[i % 4]}
          disabled={bookKey[bookKey.length - 1] <= 3}
          offset={offsetArr[i % 2]}
          onSetCurrentOverlay={this.props.onSetCurrentOverlay}
          onStudentNameSet={this.props.onStudentNameSet}
          onBookSet={this.props.onBookSet}
          onAvatarClicked={this.props.onAvatarClicked}
        />
      );
    }

    return avatarArray;
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

  componentDidUpdate(prevProps, prevState) {
    console.log("did update!!");

    if (prevProps.assessments !== this.props.assessments) {
      console.log("setting 1");
      this.setMyClass();
    }

    if (prevProps.students !== this.props.students) {
      console.log("setting 2");

      this.setMyClass();
    }
  }

  setMyClass = () => {
    let students = this.props.students;
    let assessments = this.props.assessments;

    let newClass = {};

    newClass.numStudents = students.length;
    for (let i = 0; i < students.length; i++) {
      newClass[i + 1] = {
        name: students[i].first_name + " " + students[i].last_name,
        level: assessments[i] ? library[assessments[i].book_key].stepLevel : 5,
        bookKey: assessments[i] ? assessments[i].book_key : "step5",
        assessmentID: assessments[i]
          ? assessments[i].id
          : "NO_ASSESSMENT_CREATED"
      };
    }

    console.log("myClass: ", newClass);
    this.setState({ myClass: newClass });
  };

  render() {
    return (
      <div>
        <div className={styles.teacherContainer}>
          <Avatar
            className={styles.teacherAvatar}
            teacher
            teacherSignature={this.props.teacherSignature}
            key={"teacher"}
            fullName={this.props.teacherSignature}
            bookKey={"step4"}
            onStudentNameSet={this.props.onStudentNameSet}
            onBookSet={this.props.onBookSet}
            onAvatarClicked={this.props.onAvatarClicked}
          />
        </div>

        <div className={styles.studentAvatarContainer}>
          {this.renderAvatars(this.state.myClass)}
        </div>
      </div>
    );
  }
}
