import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import Avatar from "../Avatar";

let samanthaArr = [
  ["Samantha Kadis", "step4"],
  ["Phil Esterman", "step4"],
  ["Samantha Skory", "step6"],
  ["Bradley Jay", "step9"],
  ["Tracy Esterman", "step5"],
  ["Ninetails Nieman", "step9"],
  ["Abdel Morsy", "step4"],
  ["Fourest Fifty", "step4"],
  ["Sixo Beverly", "step6"]
];

let bridgetArr = [
  ["Bridget Joyce", "step4"],
  ["Phil Esterman", "step4"],
  ["Samantha Skory", "step6"],
  ["Bradley Jay", "step9"],
  ["Tracy Esterman", "step5"],
  ["Ninetails Nieman", "step9"],
  ["Abdel Morsy", "step4"],
  ["Fourest Fifty", "step4"],
  ["Sixo Beverly", "step6"],

  ["Bannon Joyce", "step4"],
  ["Felipe Esterman", "step4"],
  ["Susie Skory", "step6"],
  ["Bonnie Jay", "step9"],
  ["Rusty Esterman", "step5"],
  ["Nina Nieman", "step9"],
  ["Abbie Morsy", "step4"],
  ["Faye Fifty", "step4"],
  ["Sue Beverly", "step6"],

  ["Bill Joyce", "step4"],
  ["Tom Esterman", "step4"],
  ["Jackson Skory", "step6"],
  ["Theo Jay", "step9"],
  ["Jordy Esterman", "step5"],
  ["Lisa Nieman", "step9"],
  ["Laura Morsy", "step4"],
  ["Faith Fifty", "step4"],
  ["Precious Beverly", "step6"]
];

let defaultArr = [
  ["Phil Esterman", "step4"],
  ["Samantha Skory", "step6"],
  ["Bradley Jay", "step9"],
  ["Tracy Esterman", "step5"],
  ["Ninetails Nieman", "step9"],
  ["Abdel Morsy", "step4"],
  ["Fourest Fifty", "step4"],
  ["Sixo Beverly", "step6"]
];

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

function getStepforName(name, nameAndBookArr) {
  for (let i = 0; i < nameAndBookArr.length; i++) {
    if (name === nameAndBookArr[i][0]) {
      return nameAndBookArr[i][1];
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

  renderAvatars = nameAndBookArr => {
    const nameArr = [];

    // create the name array
    for (let i = 0; i < nameAndBookArr.length; i++) {
      nameArr.push(nameAndBookArr[i][0]);
    }

    nameArr.sort();

    const avatarArray = [];

    nameArr.sort();

    // TODO does not actually match books

    for (let i = 0; i < nameArr.length; i++) {
      avatarArray.push(
        <Avatar
          key={i}
          fullName={nameArr[i]}
          bookKey={getStepforName(nameArr[i], nameAndBookArr)}
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
    this.state = {};
  }

  render() {
    return (
      <div>
        <Avatar
          teacher={true}
          teacherSignature={getFemaleSignature(this.props.teacherName)}
        />

        <div className={styles.studentAvatarContainer}>
          {this.renderAvatars(getNameAndBookList(this.props.teacherName))}
        </div>
      </div>
    );
  }
}
