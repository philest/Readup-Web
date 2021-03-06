import PropTypes from "prop-types";
import React from "react";

import RectangleButton from "../../components/RectangleButton";

import styles from "../DoneModal/styles.css";
import myStyles from "./styles.css";

import ButtonArray from "../subcomponents/ButtonArray";

import BaseModal from "../BaseModal";

import commonStyles from "../commonstyles.css";
import ModalHeader from "../subcomponents/ModalHeader";

import { playSound, playSoundAsync } from "../../audioPlayer.js";

import {
  updateAssessment,
  getAssessmentData
} from "../../../ReportsInterface/emailHelpers";
import { getLastAssessmentID } from "../../sagas/networkingHelpers";

import ForwardArrowButton from "../../components/ForwardArrowButton";
import BackArrowButton from "../../components/BackArrowButton";

import {
  ReaderStateOptions,
  PromptOptions,
  PromptTextOptions
} from "../../types";

import { Modal, Panel, ProgressBar } from "react-bootstrap";

const THIS_MODAL_ID = "modal-comp";

export default class CompModal extends React.Component {
  static propTypes = {
    onSeeBookClicked: PropTypes.func,
    onTurnInClicked: PropTypes.func,

    currentShowModal: PropTypes.string,
    onStartClicked: PropTypes.func,
    onStopClicked: PropTypes.func,
    close: PropTypes.func,
    disabled: PropTypes.bool,
    readerState: PropTypes.string,
    showSpinner: PropTypes.bool,
    question: PropTypes.object,
    includeDelay: PropTypes.bool,
    prompt: PropTypes.string,
    onExitLastQuestion: PropTypes.func,
    showPrompting: PropTypes.bool,

    written: PropTypes.bool,
    numWrittenQuestions: PropTypes.number,
    onNextQuestionClicked: PropTypes.func,
    onPreviousQuestionClicked: PropTypes.func,
    questionNumber: PropTypes.number,
    writtenQuestionNumber: PropTypes.number,
    onFinalWrittenCompQuestionAnswered: PropTypes.func,
    writtenCompInput: PropTypes.string,
    onWrittenCompInputSet: PropTypes.func,
    nextDisabled: PropTypes.bool,
    isWarmup: PropTypes.bool

    // writtenCompInput: PropTypes.string
  };

  static defaultProps = {
    written: true
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      showModal: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.currentShowModal === THIS_MODAL_ID &&
      this.props.writtenQuestionNumber !== nextProps.writtenQuestionNumber // incremented by
    ) {
      this.saveWrittenResponse(
        this.form.value,
        this.props.writtenQuestionNumber
      );

      this.form.value = "";
      // this.props.onSpellingInputSet(""); // reset to empty
      this.form.focus();

      // Exit?
      if (
        nextProps.writtenQuestionNumber > this.props.numWrittenQuestions ||
        this.props.isWarmup
      ) {
        this.props.onFinalWrittenCompQuestionAnswered();
      }
    }
  }

  saveWrittenResponse = (value, qNum) => {
    const assessmentID = getLastAssessmentID();
    assessmentID.then(id => {
      console.log("id: ", id);

      const assessment = getAssessmentData(id);

      assessment
        .then(assessment => {
          console.log("assessment: ", assessment);

          let studentWrittenResponsesHolder =
            assessment.student_written_responses;

          if (!studentWrittenResponsesHolder) {
            studentWrittenResponsesHolder = { 1: "", 2: "", 3: "" };
          }

          studentWrittenResponsesHolder[qNum] = value;

          updateAssessment(
            {
              student_written_responses: studentWrittenResponsesHolder
            },
            id
          );
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  };

  onHearQuestionAgainClicked = () => {
    if (!this.props.disabled) {
      playSoundAsync(this.props.question.audioSrc);
    }
  };

  onStop = () => {
    console.log("here i am... onSTOP");
    this.props.onStopClicked();

    setTimeout(this.props.onExitLastQuestion, 2000);
  };

  handleWrittenCompChange = () => {
    this.props.onWrittenCompInputSet(this.form.value); // set to value
  };

  renderFooter = () => {
    return (
      <Modal.Footer style={{ backgroundColor: "whitesmoke" }}>
        <div className={myStyles.footerButtonContainer}>
          <BackArrowButton
            title="Back"
            subtitle={null}
            style={{
              width: 95,
              height: 75,
              visibility:
                this.props.writtenQuestionNumber <= 1 ? "hidden" : "visible",
              position: "relative",
              top: 13
            }}
            onClick={() => {
              this.props.onPreviousQuestionClicked();
              this.form.focus();
            }}
          />
          <ForwardArrowButton
            title={
              this.props.numWrittenQuestions ===
              this.props.writtenQuestionNumber
                ? "Finish"
                : "Next"
            }
            subtitle={null}
            style={{ width: 110, height: 100 }}
            disabled={this.props.nextDisabled} // shortcut hack
            onClick={() => {
              this.props.onNextQuestionClicked();
              this.form.focus();
            }}
            wiggle={false}
          />
        </div>
      </Modal.Footer>
    );
  };

  renderOralCompBody = (
    inProgress,
    done,
    talkingAboutStartButton,
    talkingAboutStopButton,
    talkingAboutSeeBook
  ) => {
    {
      !inProgress &&
        !done &&
        !talkingAboutStopButton && (
          <RectangleButton
            title="Start"
            subtitle="record answer"
            style={{
              width: 200,
              height: 70,
              backgroundColor: "#5cb85c",
              borderColor: "#4cae4c"
            }}
            className={myStyles.compRecordButton}
            pulsatingArrow={true}
            disabled={this.props.disabled && !talkingAboutStartButton}
            partiallyDisabled={talkingAboutStartButton}
            onClick={this.props.onStartClicked}
            showSpinner={this.props.showSpinner}
            showPrompting={this.props.showPrompting}
          />
        );
    }

    {
      (inProgress || done || talkingAboutStopButton) && (
        <RectangleButton
          title="Stop"
          subtitle="recording"
          style={{ width: 200, height: 70, backgroundColor: "#982E2B" }}
          pulsatingArrow={true}
          partiallyDisabled={talkingAboutStopButton}
          disabled={this.props.disabled && !talkingAboutStopButton}
          onClick={this.onStop}
          showSpinner={this.props.showSpinner}
          showPrompting={this.props.showPrompting}
        />
      );
    }

    <ButtonArray
      titles={["See book", "Hear again"]}
      images={["fa-book", "fa-volume-up obscure"]}
      actions={[this.props.onSeeBookClicked, this.onHearQuestionAgainClicked]}
      inline={true}
      fontAwesome={true}
      enlargeFirst={true}
      disabled={this.props.disabled}
      talkingAboutFirst={talkingAboutSeeBook}
    />;
  };

  render() {
    const talkingAboutStartButton =
      this.props.readerState === ReaderStateOptions.talkingAboutStartButton;
    const talkingAboutStopButton =
      this.props.readerState === ReaderStateOptions.talkingAboutStopButton;
    const talkingAboutSeeBook =
      this.props.readerState === ReaderStateOptions.talkingAboutSeeBook;

    const done = this.props.readerState === ReaderStateOptions.done;
    const inProgress = this.props.readerState === ReaderStateOptions.inProgress;

    let title;
    let subtitle;

    // this is a hack for ensuring that it doesn't break when compModal renders w/o a question.
    if (this.props.question) {
      if (this.props.prompt === PromptOptions.awaitingPrompt) {
        title = this.props.question.title;
        subtitle = this.props.question.subtitle;

        if (this.props.isWarmup) {
          title = "Does your book's cover have a picture?";
        }

        if (this.props.written) {
          title = `${this.props.writtenQuestionNumber}. ${title}`;
        }
      } else {
        title = this.props.question.title;
        subtitle = PromptTextOptions[this.props.prompt];
      }
    }

    return (
      <Modal
        onEntering={this.playQuestion}
        show={this.props.currentShowModal === THIS_MODAL_ID}
        onHide={this.props.close}
        className={myStyles.compModal}
      >
        {this.props.currentShowModal === THIS_MODAL_ID && (
          <style>
            {
              " .modal-dialog { margin-top: 30px; } .progress { height: 11px; } .modal-backdrop.in { opacity: 0.6; }"
            }
          </style>
        )}

        <Modal.Header className={myStyles.compModalHeader}>
          {!this.props.isWarmup && (
            <div className={myStyles.progress}>
              <ProgressBar
                now={
                  this.props.writtenQuestionNumber /
                    this.props.numWrittenQuestions *
                    100 -
                  10
                }
              />
            </div>
          )}
          <Modal.Title>{title}</Modal.Title>

          {subtitle && (
            <Modal.Title className={myStyles.compSubTitle}>
              {subtitle}
            </Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body
          className={
            this.props.written
              ? myStyles.writtenCompModalBody
              : myStyles.compModalBody
          }
        >
          {!this.props.written &&
            this.renderOralCompBody(
              inProgress,
              done,
              talkingAboutStartButton,
              talkingAboutStopButton,
              talkingAboutSeeBook
            )}
          {this.props.written && (
            <textarea
              className={myStyles.notes}
              spellCheck="false"
              autoFocus
              ref={ref => {
                this.form = ref;
              }}
              onChange={this.handleWrittenCompChange}
              value={this.props.writtenCompInput}
            />
          )}
        </Modal.Body>
        {this.props.written && this.renderFooter()}
      </Modal>
    );
  }
}
