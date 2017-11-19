import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import Avatar from "../Avatar";

let names =
  "Alishia Slaton, Annis Miceli, Joetta Cardwell, Willena Braz, Viola Paneto, Shasta Bluhm, Efrain Lukasik, Silva Billings, Woodrow Mcclean, Gertrud Duffer, Denna Gerardi, Rosetta Tondreau, Royce Storie, Juliette Orsi, Davina Johnstone, Truman Benefield, Thora Draper, Dorie Ringgold, Nelda Voisine, Delphia Rudnick";
let nameArr = names.split(", ");

let colorArr = ["teal", "purple", "green", "blue"];
let offsetArr = ["left", "right"];

export default class AvatarContainer extends React.Component {
  static propTypes = {
    onStudentNameSet: PropTypes.func.isRequired,
    onAvatarClicked: PropTypes.func.isRequired
  };

  static defaultProps = {};

  renderAvatars = nameArr => {
    let avatarArray = [];

    nameArr.sort();

    for (let i = 0; i < nameArr.length; i++) {
      avatarArray.push(
        <Avatar
          key={i}
          fullName={nameArr[i]}
          color={colorArr[i % 4]}
          offset={offsetArr[i % 2]}
          onStudentNameSet={this.props.onStudentNameSet}
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
        <Avatar teacher={true} teacherSignature={"Ms. Joyce"} />

        <div className={styles.studentAvatarContainer}>
          {this.renderAvatars(nameArr)}
        </div>
      </div>
    );
  }
}
