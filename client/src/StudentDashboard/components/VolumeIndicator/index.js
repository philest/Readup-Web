import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

export default class VolumeIndicator extends React.Component {
  static propTypes = {
    hearAgainClicked: PropTypes.func,
    visible: PropTypes.bool
  };

  static defaultProps = {
    visible: true
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
        onClick={this.props.hearAgainClicked}
        className={[styles.volumeContainer, styles.clickable].join(" ")}
        style={{ visibility: this.props.visible ? "visible" : "hidden" }}
      >
        <i
          className="fa fa-volume-up fa-3x"
          style={{ color: "white", fontSize: 5 + "em" }}
          aria-hidden="true"
        />
        <br />
        <span className={styles.volumeHeadingHearAgain}> Hear again </span>
      </div>
    );
  }
}
