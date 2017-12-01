import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import Avatar from "../Avatar";

let names1 =
  "Alishia Slaton, Annis Miceli, Joetta Cardwell, Willena Braz, Viola Paneto, Shasta Bluhm, Efrain Lukasik, Silva Billings, Woodrow Mcclean, Gertrud Duffer, Denna Gerardi, Rosetta Tondreau, Royce Storie, Juliette Orsi, Davina Johnstone, Truman Benefield, Thora Draper, Dorie Ringgold, Nelda Voisine, Delphia Rudnick";
let samanthaNameArr = names1.split(", ");

let samanthaBookArr = [
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9"
];

let colorArr = ["teal", "purple", "green", "blue"];
let offsetArr = ["left", "right"];

let names2 =
  "Alexandra Aaron, Abe Alexi, Joetta Cardwell, Willena Braz, Abdel Alonzo, Efrain Lukasik, Silva Billings, Woodrow Mcclean, Gertrud Duffer, Denna Gerardi, Rosetta Tondreau, Royce Storie, Juliette Orsi, Davina Johnstone, Truman Benefield, Thora Draper, Dorie Ringgold, Nelda Voisine, Delphia Rudnick";
let bridgetNameArr = names2.split(", ");

let bridgetBookArr = [
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9",
  "step4",
  "step6",
  "step9"
];

let defaultNameArr = ["Alexandra Aaron", "Abe Alexi", "Joetta Cardwell"];

let defaultBookArr = ["step4", "step6", "step9"];

function getStudentList(teacherName) {
  if (teacherName === "Samantha Kadis") {
    return samanthaNameArr;
  } else if (teacherName === "Bridget Joyce") {
    return bridgetNameArr;
  } else {
    return defaultNameArr;
  }
}

function getBookList(teacherName) {
  if (teacherName === "Samantha Kadis") {
    return samanthaBookArr;
  } else if (teacherName === "Bridget Joyce") {
    return bridgetBookArr;
  } else {
    return defaultBookArr;
  }
}

function getFemaleSignature(teacherName) {
  let res = teacherName.split(" ");
  return `Ms. ${res[1]}`;
}

export default class AvatarContainer extends React.Component {
  static propTypes = {
    onStudentNameSet: PropTypes.func.isRequired,
    onBookSet: PropTypes.func.isRequired,
    onAvatarClicked: PropTypes.func.isRequired,
    teacherName: PropTypes.string
  };

  static defaultProps = {};

  componentWillMount() {
    console.log("bookList: ", getBookList(this.props.teacherName));
  }

  renderAvatars = (nameArr, bookArr) => {
    let avatarArray = [];

    nameArr.sort();

    console.log("bookArr: ", bookArr);

    // TODO does not actually match books

    for (let i = 0; i < nameArr.length; i++) {
      avatarArray.push(
        <Avatar
          key={i}
          fullName={nameArr[i]}
          bookKey={bookArr[i]}
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
          {this.renderAvatars(
            getStudentList(this.props.teacherName),
            getBookList(this.props.teacherName)
          )}
        </div>
      </div>
    );
  }
}
