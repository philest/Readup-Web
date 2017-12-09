import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import AssignBooks from "../sharedComponents/AssignBooks";
import LinkInfo from "../sharedComponents/LinkInfo";

export default class Signup extends React.Component {
  static propTypes = {
    userID: PropTypes.number,
    teacherName: PropTypes.string
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
    return <AssignBooks userID={this.props.userID} />;
  }
}
