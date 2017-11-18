import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import Avatar from "../Avatar";

export default class AvatarContainer extends React.Component {
  static propTypes = {
    test: PropTypes.string
  };

  static defaultProps = {};

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
        <Avatar fullName={"Philip Esterman"} />
        <Avatar fullName={"Sam Esterman"} color={"purple"} />
      </div>
    );
  }
}
