import PropTypes from "prop-types";
import React from "react";

import styles from "./styles.css";
import commonStyles from "../../modals/commonstyles.css";

import { Button } from "react-bootstrap";

const THIS_OVERLAY_ID = "overlay-no-sound";

export default class NoSoundOverlay extends React.Component {
  static propTypes = {
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

        <img
          className={styles.handRaise}
          src="/images/dashboard/boy-raising-hand.svg"
        />

        <div className={styles.micHeader}>Sound is not working!</div>

        <div className={styles.micList}>
          <div className={styles.micStep}>
            <span className={styles.number}>1</span>. Make sure volume is on
          </div>
          <div className={styles.micStep}>
            <span className={styles.number}>2</span>. Make sure volume is turned
            up high enough
          </div>
          <div className={styles.micStep}>
            <span className={styles.number}>3</span>. Then, refresh this page
          </div>
        </div>
      </div>
    );
  }
}
