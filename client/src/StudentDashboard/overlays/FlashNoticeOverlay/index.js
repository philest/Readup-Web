import PropTypes from "prop-types";
import React from "react";

import styles from "./styles.css";

const THIS_OVERLAY_ID = "overlay-flash-notice";

export default class FlashNoticeOverlay extends React.Component {
  static propTypes = {
    currentShowOverlay: PropTypes.string,
    showOveride: PropTypes.bool,
    text: PropTypes.string,
    prompt: PropTypes.bool,
    graderLiveHelping: PropTypes.bool,
    isReadingInstructions: PropTypes.bool
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {};
  }

  renderText() {
    if (this.props.graderLiveHelping) {
      return;
    } else if (this.props.prompt) {
      return;
    } else if (this.props.isReadingInstructions) {
      return;
    } else {
      return this.props.text;
    }
  }

  render() {
    if (
      this.props.currentShowOverlay !== THIS_OVERLAY_ID &&
      !this.props.showOveride
    ) {
      return null;
    }

    return (
      <div
        className={[
          styles.introContainer,
          this.props.isReadingInstructions ? styles.countdownWrapper : ""
        ].join(" ")}
      >
        <div
          className={[
            styles.introTitle,
            styles.flashIt,
            this.props.prompt ? styles.large : ""
          ].join(" ")}
        >
          {this.renderText()}
        </div>
      </div>
    );
  }
}
