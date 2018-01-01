import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import { Button } from "react-bootstrap";

import { getClassLink } from "../../ReportsInterface/emailHelpers";

let classLink = "ReadUpNow.com/RMP1";
let preLink = "https://";

export default class LinkInfo extends React.Component {
  static propTypes = {
    userID: PropTypes.number,
    back: PropTypes.func
  };

  componentWillMount = () => {
    let devLink = "localhost:3000/";
    let prodLink = "ReadUpNow.com/";

    let link = process.env.NODE_ENV === "development" ? devLink : prodLink;
    preLink = process.env.NODE_ENV === "development" ? "http://" : "https://";

    classLink = `${link}${this.props.userID}`;
    this.setState({ classLink: classLink });

    // getClassLink(this.props.userID).then(res => {
    //   console.log("link? ", res.data);
    //   this.setState({ classLink: res.data });
    // });
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
          Now just give students their STEP books and <br />have them type in
          your class link!
        </h2>
        <div className={[styles.formLg, styles.formLook].join(" ")}>
          <a target="_blank" href={`${preLink}www.${this.state.classLink}`}>
            {this.state.classLink}
          </a>
        </div>
        <span onClick={this.props.back} className={styles.whiteBack}>
          <i
            className={"fa fa-arrow-left"}
            aria-hidden="true"
            style={{
              marginRight: 7,
              fontSize: 15
            }}
          />
          Back
        </span>
        <div className={styles.flexContainer}>
          <a target="_blank" href={`${preLink}www.${this.state.classLink}`}>
            <Button className={styles.goButton} bsSize="lg" bsStyle="primary">
              Try it yourself
            </Button>
          </a>
        </div>
      </div>
    );
  }
}
