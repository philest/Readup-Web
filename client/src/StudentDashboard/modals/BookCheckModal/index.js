import PropTypes from "prop-types";
import React from "react";

import styles from "../PausedModal/styles.css";
import commonStyles from "../commonstyles.css";
import compPausedStyles from "./styles.css";

import ModalHeader from "../subcomponents/ModalHeader";
import RectangleButton from "StudentDashboard/components/RectangleButton";
import ButtonArray from "../subcomponents/ButtonArray";

import BaseModal from "../BaseModal";

import { playSoundAsync, playSound } from "../../audioPlayer.js";

const THIS_MODAL_ID = "modal-book-check";

export default class BookCheckModal extends React.Component {
  static propTypes = {
    bookTitle: PropTypes.string,
    onYesClicked: PropTypes.func,
    onNoClicked: PropTypes.func,
    currentShowModal: PropTypes.string,
    modalType: PropTypes.string
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
      <div>
        <style type="text/css">
          {
            // ".modal-dialog { margin-top: 20vh; margin: 20vh auto 0px;}  .modal-backdrop.in {opacity: 0.9;} "
          }
        </style>
        <BaseModal
          title={"Do you have your book?"}
          subtitle={this.props.bookTitle}
          show={this.props.currentShowModal === THIS_MODAL_ID}
          modalType="info"
        >
          <div className={commonStyles.modalButtonArrayWrapper}>
            <ButtonArray
              titles={["Yes", "No"]}
              images={["fa-check", "fa-times"]}
              actions={[this.props.onYesClicked, this.props.onNoClicked]}
              enlargeFirst={false}
              fontAwesome={true}
              modalType={"info"}
              showSpinner={false}
              greyOutSecondary={false}
            />
          </div>
        </BaseModal>
      </div>
    );
  }
}
