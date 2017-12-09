import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import Avatar from "../Avatar";

import {
  getAllStudents,
  getAllAssessments
} from "../../../ReportsInterface/emailHelpers";

import { library } from "../../../sharedComponents/bookObjects.js";

let colorArr = ["teal", "purple", "green", "blue"];
let offsetArr = ["left", "right"];

function getNameAndBookList(teacherName) {
  if (teacherName === "Samantha Kadis") {
    return samanthaArr;
  } else if (teacherName === "Bridget Joyce") {
    return bridgetArr;
  } else {
    return defaultArr;
  }
}

function getFemaleSignature(teacherName) {
  let res = teacherName.split(" ");
  return `Ms. ${res[1]}`;
}

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
    teacherName: PropTypes.string
  };

  static defaultProps = {};

  componentWillMount() {}

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
      avatarArray.push(
        <Avatar
          key={i}
          fullName={nameArr[i]}
          bookKey={getStepforName(nameArr[i], myClass)}
          color={colorArr[i % 4]}
          offset={offsetArr[i % 2]}
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

  componentWillMount = () => {
    let newClass = {};
    let userID = 3408;

    getAllStudents(userID)
      .then(res => {
        console.log("resolved: ");
        console.log(res);
        const studentDataArr = res.data;

        getAllAssessments(userID).then(res => {
          const assessmentDataArr = res.data;

          newClass.numStudents = studentDataArr.length;
          for (let i = 0; i < studentDataArr.length; i++) {
            newClass[i + 1] = {
              name:
                studentDataArr[i].first_name +
                " " +
                studentDataArr[i].last_name,
              level: assessmentDataArr[i]
                ? library[assessmentDataArr[i].book_key].stepLevel
                : 5,
              bookKey: assessmentDataArr[i]
                ? assessmentDataArr[i].book_key
                : "step5",
              assessmentID: assessmentDataArr[i]
                ? assessmentDataArr[i].id
                : "NO_ASSESSMENT_CREATED"
            };
          }
          console.log("myClass: ", newClass);

          this.setState({ myClass: newClass });
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <Avatar
          teacher
          teacherSignature={getFemaleSignature(this.props.teacherName)}
        />

        <div className={styles.studentAvatarContainer}>
          {this.renderAvatars(this.state.myClass)}
          {/*          {this.renderAvatars(getNameAndBookList(this.props.teacherName))}
*/}{" "}
        </div>
      </div>
    );
  }
}
