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

const THIS_MODAL_ID = "modal-comp-paused";

export default class CompPausedModal extends React.Component {
  static propTypes = {
    onContinueClicked: PropTypes.func.isRequired,
    onStartOverClicked: PropTypes.func, // TODO required?
    onDoneClicked: PropTypes.func,

    currentShowModal: PropTypes.string,
    modalType: PropTypes.string,
    showSpinner: PropTypes.bool,
    onExitLastQuestion: PropTypes.func
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      seenBefore: false
    };
  }

  componentWillMount() {
    document.addEventListener("keydown", this._handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    console.log("here i am...");
    console.log("show modal?", this.props.currentShowModal);
    console.log("seen before?", this.state.seenBefore);
    if (
      nextProps.currentShowModal === THIS_MODAL_ID &&
      !this.state.seenBefore
    ) {
      console.log("WOW here!!! ");
      this.setState({ seenBefore: true });

      playSoundAsync("/audio/warmup/w-5.mp3");
    }
  }

  onStop = () => {
    console.log("here i am... onSTOP");
    this.props.onDoneClicked();

    setTimeout(this.props.onExitLastQuestion, 1500);
  };

  _handleKeyDown = event => {
    if (event.which == 13 || event.keyCode == 13 || event.code == "Enter") {
      this.onStop();
    }
  };

  render() {
    let firstIcons;

    if (this.props.showSpinner) {
      firstIcons = "fa-spinner fa-pulse";
    } else {
      firstIcons = "fa-check";
    }

    return (
      <div>
        <style type="text/css">
          {".modal-dialog { margin-top: 20vh; margin: 20vh auto 0px; } "}
        </style>
        <BaseModal
          title="Done with answer?"
          show={this.props.currentShowModal === THIS_MODAL_ID}
          modalType="info"
        >
          <div className={commonStyles.modalButtonArrayWrapper}>
            <ButtonArray
              titles={["Done", "Go back"]}
              images={[firstIcons, "fa-arrow-left"]}
              actions={[this.onStop, this.props.onContinueClicked]}
              enlargeFirst={true}
              fontAwesome={true}
              modalType={"info"}
              showSpinner={this.props.showSpinner}
            />
          </div>
        </BaseModal>
      </div>
    );
  }
}
