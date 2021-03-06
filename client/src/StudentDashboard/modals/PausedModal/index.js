import PropTypes from "prop-types";
import React from "react";

import styles from "./styles.css";
import commonStyles from "../commonstyles.css";

import ModalHeader from "../subcomponents/ModalHeader";
import RectangleButton from "StudentDashboard/components/RectangleButton";
import ButtonArray from "../subcomponents/ButtonArray";

import BaseModal from "../BaseModal";

const THIS_MODAL_ID = "modal-paused";

export default class PausedModal extends React.Component {
  static propTypes = {
    onContinueClicked: PropTypes.func.isRequired,
    onStartOverClicked: PropTypes.func, // TODO required?
    onTurnInClicked: PropTypes.func,

    currentShowModal: PropTypes.string,
    modalType: PropTypes.string,
    showSpinner: PropTypes.bool,
    onExitClicked: PropTypes.func
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    let firstIcons;

    if (this.props.showSpinner) {
      firstIcons = "fa-spinner fa-pulse";
    } else {
      firstIcons = "fa-check";
    }

    return (
      <BaseModal
        title="Paused"
        show={this.props.currentShowModal === THIS_MODAL_ID}
        modalType="info"
      >
        {this.props.currentShowModal === THIS_MODAL_ID && (
          <style type="text/css">
            {".modal-backdrop.in { opacity: 0.65; } "}
          </style>
        )}

        <div className={commonStyles.modalButtonArrayWrapper}>
          <ButtonArray
            titles={["Go on", "Turn in early"]}
            images={["fa-arrow-left", firstIcons]}
            actions={[this.props.onContinueClicked, this.props.onExitClicked]}
            enlargeFirst={true}
            fontAwesome={true}
            modalType={"info"}
            showSpinner={this.props.showSpinner}
          />
        </div>
      </BaseModal>
    );
  }
}
