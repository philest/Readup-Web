import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

import ModalHeader from "../subcomponents/ModalHeader";
import ButtonArray from "../subcomponents/ButtonArray";

import BaseModal from "../BaseModal";

const THIS_MODAL_ID = "modal-done";

export default class DoneModal extends React.Component {
  static propTypes = {
    onHearRecordingClicked: PropTypes.func,
    onTurnInClicked: PropTypes.func,

    currentShowModal: PropTypes.string,
    showSpinner: PropTypes.bool,
    showCheck: PropTypes.bool
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
    let firstIcons;

    if (this.props.showSpinner) {
      firstIcons = "fa-spinner fa-pulse";
    } else if (this.props.showCheck) {
      firstIcons = "fa-check";
    } else {
      firstIcons = "fa-paper-plane";
    }

    return (
      <BaseModal
        title="You're Done!"
        show={this.props.currentShowModal === THIS_MODAL_ID}
        modalType="success"
      >
        {this.props.currentShowModal === THIS_MODAL_ID && (
          <style>{".modal-backdrop.in { opacity: 0.7; }"}</style>
        )}

        <div className={styles.doneModalButtonWrapper}>
          <ButtonArray
            titles={["Turn it in", "Hear it"]}
            images={[firstIcons, "fa-headphones"]}
            actions={[
              this.props.onTurnInClicked,
              this.props.onHearRecordingClicked
            ]}
            fontAwesome={true}
            enlargeFirst={true}
            modalType={"success"}
            showSpinner={this.props.showSpinner}
          />
        </div>
      </BaseModal>
    );
  }
}
