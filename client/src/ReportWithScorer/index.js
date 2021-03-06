import PropTypes from "prop-types";
import React from "react";
import { Button, Modal } from "react-bootstrap";

import styles from "../ReportsInterface/styles.css";
import ReportWithScorerStyles from "./styles.css";

import InfoBar from "../ReportsInterface/components/InfoBar";
import ReportsInterface from "../ReportsInterface";

import NavigationBar from "../StudentDashboard/components/NavigationBar";
import studentDashboardIndexStyles from "../StudentDashboard/styles.css";

import sharedStyles from "../sharedComponents/styles.css";

import FormattedMarkupText from "../sharedComponents/FormattedMarkupText";

import { newSampleEvaluationText } from "../sharedComponents/newSampleMarkup";

import { isMobileDevice } from "../StudentDashboard/sagas/helpers";

import {
  sendEmail,
  validateEmail,
  isScored,
  getScoredText,
  getAssessmentUpdateTimestamp,
  updateUserEmail,
  getTotalWordsInText,
  getTotalWordsReadCorrectly,
  getAccuracy,
  getWCPM
} from "../ReportsInterface/emailHelpers";
import { playSoundAsync } from "../StudentDashboard/audioPlayer";

const ADMIN_EMAIL = "philesterman@gmail.com";

export default class ReportWithScorer extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired // this is passed from the Rails view
  };

  constructor(props, _railsContext) {
    super(props);
    this.state = {
      showAudioPlayback: false,
      showPricingModal: false,
      showEmailModal: true,
      showLiveDemoModal: false,
      showSampleInfoModal: false,
      levelFound: false,
      email: "",
      name: "",
      schoolName: "",
      phoneNumber: "",
      gradedText: newSampleEvaluationText,
      lastUpdated: this.props.whenCreated,
      givenScoredReport: false,
      showReportReadyModal: false,
      isScored: this.props.isScoredPrior
    };
    this.tick = this.tick.bind(this);
  }

  componentWillMount() {
    // if isMobileDevice, halt
    if (isMobileDevice()) {
      window.location.href = "/mobile_halt";
    }

    document.addEventListener("keydown", this._handleKeyDown);

    if (!this.props.isSample) {
      // Hide the email modal and render graded text
      this.setState({ showEmailModal: false });
      this.setState({ gradedText: JSON.parse(this.props.scoredText) });
    }

    if (this.props.isSample && this.props.isDirectSample) {
      this.setState({ showEmailModal: false });
      this.setState({ showLiveDemoModal: false });
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 2000);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
    clearInterval(this.interval);
  }

  tick() {
    isScored(this.props.assessmentID).then(res => {
      this.setState({ isScored: res });
    });

    let isNewlyScored = this.state.isScored && !this.props.isScoredPrior;
    let givenScoredReport = this.state.givenScoredReport;

    if (isNewlyScored && !givenScoredReport) {
      console.log("SHOW modal");
      this.setState({ givenScoredReport: true });
      this.deliverScoredReport();
    } else {
      console.log("don't show modal");
      // this.hideReportReadyModal()
    }
  }

  assessmentUpdated(id) {
    let res = getAssessmentUpdateTimestamp(id);
    res.then(res => {
      this.setState({ lastUpdated: res });
    });

    let whenCreated = this.props.whenCreated;
    let lastUpdated = this.state.lastUpdated;

    if (whenCreated !== lastUpdated) {
      // their timestamps are different
      return true;
    } else {
      return false;
    }
  }

  deliverScoredReport() {
    this.setState({ showReportReadyModal: true });

    playSoundAsync("/audio/complete.mp3");

    // Only automatically update when it's scored prior
    if (this.props.isScoredPrior) {
      const loc = `/reports/${this.props.userID}`;
      setTimeout(function() {
        window.location.href = loc;
      }, 2000);
    }
  }

  hideReportReadyModal() {
    this.setState({ showReportReadyModal: false });
  }

  onLogoutClicked = () => {};

  onPlayRecordingClicked = () => {
    this.setState({ showAudioPlayback: true });
  };

  onPricingClicked = () => {
    this.setState({ showPricingModal: true });

    console.log(getTotalWordsReadCorrectly(this.state.gradedText));
  };

  onLiveDemoClick = () => {
    this.setState({ showLiveDemoModal: false });
  };

  onEmailFormSubmit = () => {
    this.setState({ showEmailModal: false });
    this.setState({ showSampleInfoModal: true });
    const email = this.state.email;
    const id = this.props.userID;

    const subject = ["Demo submitted: ", email].join(" ");
    const message = ["The user's email is ", email].join(" ");

    sendEmail(subject, message, ADMIN_EMAIL);

    if (validateEmail(email)) {
      updateUserEmail(email, id);
      console.log("It's a valid email, so we are updating it.");
    } else {
      console.log("Not a valid email, so not updating it.");
    }

    // TODO do something with the data
  };

  onSampleButtonClick = () => {
    this.setState({ showSampleInfoModal: false });
  };

  closePricingModal = () => {
    this.setState({ showPricingModal: false });
  };

  closeSampleInfoModal = () => {
    this.setState({ showSampleInfoModal: false });
  };

  _handleKeyDown = event => {
    if (this.state.showPricingModal && event.code === "Enter") {
      this.onPricingFormSubmit();
    }
    if (this.state.showEmailModal && event.code === "Enter") {
      this.onEmailFormSubmit();
    }
  };

  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  };

  handleNameChange = event => {
    this.setState({ name: event.target.value });
  };

  handleSchoolNameChange = event => {
    this.setState({ schoolName: event.target.value });
  };

  handlePhoneNumberChange = event => {
    this.setState({ phoneNumber: event.target.value });
  };

  onPricingFormSubmit = () => {
    const name = this.state.name;
    const schoolName = this.state.schoolName;
    const phoneNumber = this.state.phoneNumber;
    const email = this.state.email;

    const subject = ["Pricing request: ", schoolName].join(" ");

    this.setState({ showPricingModal: false });

    const message = [
      "Pricing just requested.\n\nEmail: ",
      email,
      "\nName: ",
      name,
      "\nSchool: ",
      schoolName,
      "\nPhone: ",
      phoneNumber
    ].join(" ");

    sendEmail(subject, message, ADMIN_EMAIL);

    // TODO do something with the data
  };

  onExitClicked = () => {
    window.location.href = "/";
  };

  onReplayClicked = () => {
    window.location.href = "/demo";
  };

  renderNavigationBar = () => {
    const navProps = {
      showPauseButton: false,
      onReport: true,
      onExitClicked: this.onExitClicked,
      onReplayClicked: this.onReplayClicked,
      onReader: false,
      white: false,
      beforeStudentDemo: this.props.isDirectSample,
      brand: this.props.assessmentBrand
    };

    return <NavigationBar {...navProps} />;
  };

  render() {
    return (
      <div className={styles.reportsContainer}>
        {this.renderNavigationBar()}

        <div className={ReportWithScorerStyles.profileContainer}>
          <h3>Scored by</h3>
          <img src={this.props.scorerProfilePicURL} />
          <h4>
            {this.props.scorerSignature}
            <span style={{ marginLeft: 10 + "px" }}>
              <a href={this.props.scorerResumeURL} target="_blank">
                <i
                  className={[
                    "fa",
                    "fa-linkedin-square",
                    ReportWithScorerStyles.linkedin
                  ].join(" ")}
                />
              </a>
            </span>
          </h4>
          <h5>{this.props.scorerJobTitle}</h5>
          <h5>{this.props.scorerEducation}</h5>
          <h5>{this.props.scorerExperience}</h5>

          <a
            href={
              "mailto:" +
              this.props.scorerEmail +
              "?subject=Question%20about%20assessment"
            }
            target="_blank"
          >
            <Button
              className={[
                styles.pricingFormButton,
                ReportWithScorerStyles.scorerQuestionButton
              ].join(" ")}
              bsStyle={"primary"}
              onClick={this.onAskQuestion}
            >
              Ask {this.props.scorerFirstName} a question
            </Button>
          </a>

          <hr style={{ opacity: 0.75 }} />

          <div className={ReportWithScorerStyles.reviewerContainer}>
            <div className={ReportWithScorerStyles.reviewerInfo}>
              <h4>Scoring reviewed by</h4>
              <h5>{this.props.reviewerSignature}</h5>
            </div>
            <img
              className={ReportWithScorerStyles.reviewerPic}
              src={this.props.reviewerProfilePicURL}
            />
          </div>
        </div>

        <div className={ReportWithScorerStyles.container}>
          <ReportsInterface
            video={false}
            fullPage={false}
            name={this.props.name}
            email={this.props.email}
            bookTitle={this.props.bookTitle}
            bookLevel={this.props.bookLevel}
            stepLevel={this.props.stepLevel}
            recordingURL={this.props.recordingURL}
            compRecordingURL={this.props.compRecordingURL}
            scoredText={this.props.scoredText}
            userID={this.props.userID}
            assessmentID={this.props.assessmentID}
            whenCreated={this.props.whenCreated}
            whenCreatedDate={this.props.whenCreatedDate}
            isSample={this.props.isSample}
            isDirectSample={this.props.isDirectSample}
            isUnscorable={this.props.isUnscorable}
            fluencyScore={this.props.fluencyScore}
            compScores={this.props.compScores}
            graderComments={this.props.graderComments}
            studentResponses={this.props.studentResponses}
            assessmentBrand={this.props.assessmentBrand}
            bookKey={this.props.bookKey}
            env={this.props.env}
            teacherNote={this.props.teacherNote}
            totalTimeReading={this.props.totalTimeReading}
            scoredSpelling={this.props.scoredSpelling}
          />
        </div>

        <style type="text/css">{".modal-backdrop.in { opacity: 0.9; } "}</style>
        <Modal
          show={this.state.showEmailModal}
          dialogClassName={styles.modalMedium}
        >
          <Modal.Header>
            <img
              alt=""
              className={styles.paperImage}
              src="https://s3-us-west-2.amazonaws.com/readup-now/website/demo/paper-pen.png"
            />
            <img
              alt=""
              className={styles.paperImageOverlay}
              src="https://s3-us-west-2.amazonaws.com/readup-now/website/demo/rolling-small.gif"
            />
            <Modal.Title bsClass={styles.pricingModalTitle}>
              Get your scored demo soon
            </Modal.Title>
            <h4 className={styles.modalSubtitle}>
              Your scored demo assessment will come within 15 minutes
            </h4>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.pricingFormWrapper}>
              <div className={styles.pricingFormField}>
                <div className={styles.pricingFormFieldLabel}>Email</div>
                <input
                  className={styles.pricingFormFieldInput}
                  placeholder={"Email"}
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                />
              </div>

              <Button
                className={styles.pricingFormButton}
                bsStyle={"primary"}
                onClick={this.onEmailFormSubmit}
              >
                Get it
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        <style type="text/css">{".modal-backdrop.in { opacity: 0.7; } "}</style>
        <Modal
          show={this.state.showReportReadyModal}
          dialogClassName={styles.modalSmall}
        >
          <Modal.Header>
            <Modal.Title
              bsClass={[styles.pricingModalTitle, styles.readyModalTitle].join(
                " "
              )}
            >
              Yours is ready!
            </Modal.Title>
          </Modal.Header>
          <Modal.Body bsClass={styles.readyModalBody}>
            <div className={styles.pricingFormWrapper}>
              <i
                className={[
                  "fa",
                  "fa-check",
                  styles.readyCheck,
                  styles.pulse
                ].join(" ")}
                aria-hidden={"true"}
              />
            </div>

            {!this.props.isScoredPrior && (
              <a href={`/reports/${this.props.userID}`}>
                <Button
                  className={[
                    styles.pricingFormButton,
                    styles.seeYourReportButton
                  ].join(" ")}
                  bsStyle={"success"}
                >
                  See it
                </Button>
              </a>
            )}
          </Modal.Body>
        </Modal>

        <style type="text/css">{".modal-backdrop.in { opacity: 0.9; } "}</style>
        <Modal
          show={this.state.showLiveDemoModal}
          dialogClassName={styles.modalMedium}
        >
          <Modal.Header>
            <img
              alt=""
              className={styles.paperImage}
              src="https://s3-us-west-2.amazonaws.com/readup-now/website/demo/paper-pen.png"
            />
            <img
              alt=""
              className={styles.paperImageOverlay}
              src="https://s3-us-west-2.amazonaws.com/readup-now/website/demo/rolling-small.gif"
            />
            <Modal.Title bsClass={styles.pricingModalTitle}>
              We'll finish scoring in 5 minutes
            </Modal.Title>
            <h4 className={styles.modalSubtitle}>
              While you wait, you can look over the example prior assessment
              again
            </h4>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.pricingFormWrapper}>
              <Button
                className={styles.pricingFormButton}
                bsStyle={"primary"}
                onClick={this.onLiveDemoClick}
              >
                See prior assessment
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        <style type="text/css">{".modal-backdrop.in { opacity: 0.7; } "}</style>
        <Modal
          show={this.state.showSampleInfoModal}
          onHide={this.closeSampleInfoModal}
          dialogClassName={styles.modalMediumPlus}
        >
          <Modal.Header closeButton>
            <Modal.Title bsClass={styles.pricingModalTitle}>
              Great, here's the example again while you wait
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.pricingFormWrapper}>
              <Button
                className={styles.pricingFormButton}
                bsStyle={"primary"}
                onClick={this.onSampleButtonClick}
              >
                See example
              </Button>
            </div>
          </Modal.Body>
        </Modal>

        <style type="text/css">{".modal-backdrop.in { opacity: 0.9; } "}</style>
        <Modal
          show={this.state.showPricingModal}
          restoreFocus={false}
          onHide={this.closePricingModal}
          dialogClassName={styles.modalMedium}
        >
          <Modal.Header closeButton>
            <Modal.Title bsClass={styles.pricingModalTitle}>
              Get ReadUp at your School
            </Modal.Title>
            <h4
              className={[styles.modalSubtitle, styles.modalSubtitleLong].join(
                " "
              )}
            >
              Save thousands of hours of intstructional time so you can focus on
              student learning
            </h4>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.pricingFormWrapper}>
              <div className={styles.pricingFormField}>
                <div className={styles.pricingFormFieldLabel}>Name</div>
                <input
                  className={styles.pricingFormFieldInput}
                  placeholder={"Name"}
                  value={this.state.name}
                  onChange={this.handleNameChange}
                />
              </div>

              <div className={styles.pricingFormField}>
                <div className={styles.pricingFormFieldLabel}>School name</div>
                <input
                  className={styles.pricingFormFieldInput}
                  placeholder={"School name"}
                  value={this.state.schoolName}
                  onChange={this.handleSchoolNameChange}
                />
              </div>

              <div className={styles.pricingFormField}>
                <div className={styles.pricingFormFieldLabel}>
                  Your phone number
                </div>
                <input
                  className={styles.pricingFormFieldInput}
                  placeholder={"Phone number"}
                  value={this.state.phoneNumber}
                  onChange={this.handlePhoneNumberChange}
                />
              </div>

              <Button
                className={styles.pricingFormButton}
                bsStyle={"primary"}
                onClick={this.onPricingFormSubmit}
              >
                Request Pricing
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
