import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

export default class VolumeIndicator extends React.Component {
  static propTypes = {
    hearAgainClicked: PropTypes.func,
    visible: PropTypes.bool,
    centered: PropTypes.bool,
    offsetLeft: PropTypes.bool,
    hideOnSmallScreen: PropTypes.bool
  };

  static defaultProps = {
    visible: true,
    centered: false,
    offsetLeft: false
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
        onClick={this.props.visible ? this.props.hearAgainClicked : ""}
        className={[
          styles.volumeContainer,
          this.props.visible ? styles.clickable : "",
          this.props.offsetLeft ? styles.offsetLeft : "",
          this.props.hideOnSmallScreen ? styles.hideOnSmallScreen : ""
        ].join(" ")}
        style={{
          opacity: this.props.visible ? 1 : 0.3,
          textAlign: this.props.centered ? "center" : ""
        }}
      >
        <i
          className="fa fa-volume-up fa-3x"
          style={{ color: "white", fontSize: 5 + "em" }}
          aria-hidden="true"
        />
        <br />
        <span
          className={[
            styles.volumeHeadingHearAgain,
            this.props.centered ? styles.centered : ""
          ].join(" ")}
        >
          {" "}
          Hear again{" "}
        </span>
      </div>
    );
  }
}
