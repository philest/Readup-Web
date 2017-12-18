import PropTypes from "prop-types";
import React from "react";

import styles from "./styles.css";

const THIS_OVERLAY_ID = "overlay-warmup";

export default class WarmupOverlay extends React.Component {
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
      <div className={styles.introContainer}>
        <div className={styles.introTitle}>Practice</div>
      </div>
    );
  }
}
