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
    color: PropTypes.string,
    large: PropTypes.bool,
    offest: PropTypes.string
  };

  static defaultProps = {
    large: false,
    color: "blue",
    offset: "none"
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
      <div className={styles.avatarWhole}>
        <div className={[styles.circle, styles.dropShadow].join(" ")}>
          <div
            className={[
              styles.innerCircle,
              getOffsetClass(this.props.offset),
              getColorClass(this.props.color)
            ].join(" ")}
          />
          <span className={styles.initials}>
            {getInitials(this.props.fullName)}
          </span>
          <br />
        </div>
        <span className={styles.name}>
          {getShortenedName(this.props.fullName)}
        </span>
      </div>
    );
  }
}
