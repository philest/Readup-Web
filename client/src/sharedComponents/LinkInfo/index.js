import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import { Button } from "react-bootstrap";

import { getClassLink } from "../../ReportsInterface/emailHelpers";

let classLink = "ReadUpNow.com/RMP1";

export default class LinkInfo extends React.Component {
  static propTypes = {
    userID: PropTypes.number
  };

  componentWillMount = () => {
    getClassLink(this.props.userID).then(res => {
      console.log("link? ", res.data);
      this.setState({ classLink: res.data });
    });
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      classLink: classLink
    };
  }

  render() {
    return (
      <div className={styles.linkContainer}>
        <h2 className={styles.classLinkHeader}>
          Great, now have students type in your class link!
        </h2>
        <div className={[styles.formLg, styles.formLook].join(" ")}>
          <a target="_blank" href={`https://www.${this.state.classLink}`}>
            {this.state.classLink}
          </a>
        </div>
        <a target="_blank" href={`https://www.${this.state.classLink}`}>
          <Button className={styles.goButton} bsSize="lg" bsStyle="primary">
            Go there now
          </Button>
        </a>
      </div>
    );
  }
}
