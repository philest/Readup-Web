import PropTypes from "prop-types";
import React from "react";

import styles from "./styles.css";
import commonStyles from "../../modals/commonstyles.css";

import { Button } from "react-bootstrap";

const THIS_OVERLAY_ID = "overlay-disabled-step";

export default class DisabledSTEPOverlay extends React.Component {
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

        <img className={styles.handRaise} src="/images/dashboard/hand-up.png" />

        <div className={styles.micHeader}>
          STEPs 1, 2, and 3 aren't available yet
        </div>

        <div className={commonStyles.micList} style={{ textAlign: "center" }}>
          <div className={styles.micStep} style={{ textAlign: "center" }}>
            For now, these STEPs need to be assessed in-person.<br /> We'll
            notify you when they're ready online!
          </div>
        </div>

        <Button
          onClick={() => {
            window.location.reload();
          }}
          bsStyle="primary"
          bsSize="lg"
        >
          Try as different student
        </Button>
      </div>
    );
  }
}
