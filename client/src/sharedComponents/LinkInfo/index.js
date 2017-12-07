import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import { Button } from "react-bootstrap";

export default class LinkInfo extends React.Component {
  static propTypes = {
    classLink: PropTypes.string,
    classURL: PropTypes.string
  };

  static defaultProps = {
    classLink: "ReadUpNow.com/RMP1",
    classURL: "https://www.google.com"
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
      <div className={styles.linkContainer}>
        <h2 className={styles.classLinkHeader}>
          Great, now have students type in your class link!
        </h2>
        <div className={[styles.formLg, styles.formLook].join(" ")}>
          <a target="_blank" href={this.props.classURL}>
            {this.props.classLink}
          </a>
        </div>
        <a target="_blank" href={this.props.classURL}>
          <Button className={styles.goButton} bsSize="lg" bsStyle="primary">
            Go there now
          </Button>
        </a>
      </div>
    );
  }
}
