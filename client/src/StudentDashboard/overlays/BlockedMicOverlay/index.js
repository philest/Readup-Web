import PropTypes from "prop-types";
import React from "react";

import styles from "./styles.css";
import commonStyles from "../../modals/commonstyles.css";

import { Button } from "react-bootstrap";

const THIS_OVERLAY_ID = "overlay-blocked-mic";

export default class BlockedMicOverlay extends React.Component {
  static propTypes = {
    onContinueClicked: PropTypes.func,

    currentShowOverlay: PropTypes.string
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
    if (this.props.currentShowOverlay !== THIS_OVERLAY_ID) {
      return null;
    }

    return (
      <div className={styles.micContainer}>
        <div className={styles.readupLogo}>ReadUp</div>

        <div className={styles.micHeader}>Can't access mic or webcam!</div>

        <div className={styles.micList}>
          <div className={styles.micStep}>
            <span className={styles.number}>1</span>. Click on the camera icon
            in the top right of the URL bar
          </div>
          <div className={styles.micStep}>
            <span className={styles.number}>2</span>. Click “Always allow
            https://readupnow.com to access your microphone"
          </div>
          <div className={styles.micStep}>
            <span className={styles.number}>3</span>. Click “Done”
          </div>
          <div className={styles.micStep}>
            <span className={styles.number}>4</span>. Reload the page
          </div>
        </div>
      </div>
    );
  }
}
