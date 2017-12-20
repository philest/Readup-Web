import PropTypes from "prop-types";
import React from "react";
import ButtonArray from "../../modals/subcomponents/ButtonArray";

import styles from "./styles.css";
import commonStyles from "../../modals/commonstyles.css";

const THIS_OVERLAY_ID = "overlay-spinner";

export default class SpinnerOverlay extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    showPrompting: PropTypes.bool,
    slowRotate: PropTypes.bool,
    isLoadingUpload: PropTypes.bool,
    isLoadingVideo: PropTypes.bool,
    isLoadingClass: PropTypes.bool
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
  }

  render() {
    let title;

    if (this.props.isLoadingUpload) {
      title = ["Saving answer..."];
    } else {
      title = this.props.showPrompting
        ? ["Thinking of next question..."]
        : ["Prompting disabled for this demo..."];
    }

    if (this.props.isLoadingVideo) {
      title = ["Loading video..."];
    }

    if (this.props.isLoadingClass) {
      title = ["Loading class..."];
    }

    if (this.props.currentShowOverlay !== THIS_OVERLAY_ID) {
      return null;
    }

    return (
      <div className={styles.countdownWrapper}>
        <div className={styles.countdownContentCountainer}>
          <ButtonArray
            titles={title}
            images={[
              `fa-spinner faa-spin animated ${this.props.isLoadingUpload
                ? "faa-slow"
                : ""}`
            ]}
            actions={[null]}
            inline={false}
            fontAwesome={true}
            enlargeFirst={true}
            disabled={false}
            showSpinner={true}
            secondaryAnimation={"faa-float"}
          />
        </div>
      </div>
    );
  }
}
