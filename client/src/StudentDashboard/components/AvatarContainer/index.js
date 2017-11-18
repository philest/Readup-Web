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
    test: PropTypes.string
  };

  static defaultProps = {};

  renderAvatars = () => {
    let avatarArray = [];

    for (let i = 0; i < nameArr.length; i++) {
      avatarArray.push(
        <Avatar
          key={i}
          fullName={nameArr[i]}
          color={colorArr[i % 4]}
          offset={offsetArr[i % 2]}
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
      <div className={styles.studentAvatarContainer}>
        {this.renderAvatars()}
      </div>
    );
  }
}
