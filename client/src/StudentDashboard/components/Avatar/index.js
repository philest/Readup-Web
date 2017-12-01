import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

function getShortenedName(fullName) {
  let res = fullName.split(" ");
  return res[0] + " " + res[1].charAt(0) + ".";
}

function getInitials(fullName) {
  let res = fullName.split(" ");
  return res[0].charAt(0) + res[1].charAt(0);
}

function getColorClass(color) {
  if (color === "blue") {
    return styles.blue;
  } else if (color === "purple") {
    return styles.purple;
  } else if (color === "teal") {
    return styles.teal;
  } else if (color === "green") {
    return styles.green;
  }
}

function getOffsetClass(offset) {
  if (offset === "left") {
    return styles.offsetLeft;
  } else if (offset === "right") {
    return styles.offsetRight;
  } else if (offset === "none") {
    return styles.offsetNone;
  }
}

export default class Avatar extends React.Component {
  static propTypes = {
    fullName: PropTypes.string,
    bookKey: PropTypes.string,
    color: PropTypes.string,
    large: PropTypes.bool,
    offest: PropTypes.string,
    teacher: PropTypes.bool,
    teacherSignature: PropTypes.string,
    onAvatarClicked: PropTypes.func,
    onStudentNameSet: PropTypes.func,
    onBookSet: PropTypes.func
  };

  static defaultProps = {
    large: false,
    color: "blue",
    offset: "none",
    teacher: false,
    teacherSignature: "Your Teacher"
  };

  login = () => {
    if (this.props.teacher) {
      return;
    }

    console.log("just clicked " + this.props.fullName);
    this.props.onStudentNameSet(this.props.fullName);
    this.props.onBookSet(this.props.bookKey);
    this.props.onAvatarClicked();
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
      <div
        className={[
          styles.avatarWhole,
          this.props.teacher ? styles.centered : ""
        ].join(" ")}
        onClick={this.login}
      >
        <div
          className={[
            styles.circle,
            styles.dropShadow,
            this.props.teacher ? styles.largeCircle : ""
          ].join(" ")}
        >
          <div
            className={[
              styles.innerCircle,
              this.props.teacher ? styles.largeInnerCircle : "",
              getOffsetClass(this.props.offset),
              getColorClass(this.props.color)
            ].join(" ")}
          />
          {!this.props.teacher && (
            <span className={styles.initials}>
              {getInitials(this.props.fullName)}
            </span>
          )}
          <br />
        </div>
        {!this.props.teacher && (
          <span className={[styles.name].join(" ")}>
            {getShortenedName(this.props.fullName)}
          </span>
        )}
        {this.props.teacher && (
          <span className={[styles.name, styles.largeName].join(" ")}>
            {this.props.teacherSignature + "'s Class"}
          </span>
        )}
      </div>
    );
  }
}
