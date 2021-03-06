import PropTypes from "prop-types";
import React from "react";

import {
  Button,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel,
  Alert
} from "react-bootstrap";

import ShowMore from "react-show-more";

import styles from "./styles.css";

import InfoBar from "./components/InfoBar";
import LevelResult from "./components/LevelResult";
import Metric from "./components/Metric";
import SpellingReport from "../sharedComponents/SpellingReport";
import CompQuestion from "../sharedComponents/CompQuestion";
import CompReport from "../sharedComponents/CompReport";

import { sampleSpellingObj } from "../sharedComponents/sampleSpellingObj";

import studentDashboardIndexStyles from "../StudentDashboard/styles.css";

import sharedStyles from "../sharedComponents/styles.css";

import FormattedMarkupText from "../sharedComponents/FormattedMarkupText";

import { sampleWithMSV } from "../sharedComponents/sampleWithMSV";
import {
  sampleStudentResponses,
  sampleGraderComments,
  sampleCompScores
} from "../sharedComponents/sampleBookGrading";

import {
  updateAssessment,
  sendEmail,
  didEndEarly,
  getScoredText,
  getAssessmentUpdateTimestamp,
  updateUserEmail,
  getTotalWordsInText,
  getTotalWordsReadCorrectly,
  getAccuracy,
  getWCPM
} from "./emailHelpers";
import { stopAudio, playSoundAsync } from "../StudentDashboard/audioPlayer";

import {
  fpBook,
  fireflyBook,
  library,
  sampleReportBookFP,
  sampleReportBookSTEP
} from "../sharedComponents/bookObjects.js";

import { wasMSVgraded } from "../sharedComponents/FormattedMarkupText";

const ADMIN_EMAIL = "philesterman@gmail.com";

let book;
let numQuestions;
let firstName;

const initShowCompAudioPlayback = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false
};

const initShowCompVideoPlayback = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false
};

export function getFullTitle(question) {
  let title = question.title;
  let subtitle = question.subtitle;

  if (subtitle) {
    return `${title} ${subtitle}`;
  } else {
    return title;
  }
}

export default class ReportsInterface extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired // this is passed from the Rails view
  };

  constructor(props, _railsContext) {
    super(props);
    this.state = {
      showAudioPlayback: false,
      showVideoPlayback: false,
      showCompAudioPlayback: initShowCompAudioPlayback,
      showCompVideoPlayback: initShowCompVideoPlayback,
      showPricingModal: false,
      showBookModal: false,
      showEmailModal: true,
      showPlaybook: false,
      playbackFidgets: false,
      showSampleInfoModal: false,
      levelFound: false,
      email: "",
      name: "",
      schoolName: "",
      phoneNumber: "",
      gradedText: sampleWithMSV,
      lastUpdated: this.props.whenCreated,
      givenScoredReport: false,
      showReportReadyModal: false,
      footerButtonText: "",
      footerLabelText: "",
      footerLink: "",
      noNoteStarted: this.props.teacherNote === null,
      draftingNote: false,
      noteExists: this.props.teacherNote !== null,
      teacherNote: this.props.teacherNote,
      showAssignSuccessAlert: false,
      showNote: false,
      showExportLoading: false,
      showExportSuccess: false
    };
    this.tick = this.tick.bind(this);
  }

  componentWillMount() {
    console.log("sampleSpellingObj: ", sampleSpellingObj);

    stopAudio();

    document.addEventListener("keydown", this._handleKeyDown);

    if (!this.props.isSample) {
      // Hide the email modal and render graded text
      this.setState({ showEmailModal: false });
      console.log("graded text is this:");
      console.log(this.state.gradedText);
      this.setState({ gradedText: JSON.parse(this.props.scoredText) });
    }

    if (!this.props.fullPage) {
      this.setState({ showEmailModal: false });
    }

    if (this.props.bookKey && this.props.userID > 150) {
      book = library[this.props.bookKey];
    } else {
      book = fireflyBook;
    }

    if (this.props.isSample && this.props.assessmentBrand === "FP") {
      book = sampleReportBookFP;
    }

    if (this.props.isSample && this.props.assessmentBrand === "STEP") {
      book = sampleReportBookSTEP;
    }

    numQuestions = book.numQuestions;

    firstName = this.props.name.split(" ")[0];
    if (firstName === "Demo") {
      firstName = "Student";
    }

    // Set the footer label and button
    let footerButtonText;
    let footerLabelText;
    let footerLink;

    // if (!this.props.isSample || this.props.isDirectSample) {

    if (this.props.isDirectSample) {
      footerLabelText = "Try out a student demo of ReadUp";
      footerButtonText = "See demo";
      footerLink = this.props.assessmentBrand === "FP" ? "/fp" : "/step";
    } else {
      footerLabelText = "See our progress monitoring texts";
      footerButtonText = "See F&P leveled texts";
      footerLink = "/library";
    }

    // } else {
    //   footerLabelText = "Save thousands of instructional hours"
    //   footerButtonText = "Get Pricing"
    //   footerLink = ''
    // }

    this.setState({ footerButtonText: footerButtonText });
    this.setState({ footerLabelText: footerLabelText });
    this.setState({ footerLink: footerLink });

    this.timeoutId = setTimeout(
      function() {
        this.setState({ playbackFidgets: true });
      }.bind(this),
      9000
    );
  }

  componentDidMount() {
    if (this.props.fullPage) {
      this.interval = setInterval(this.tick, 2000);
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
    clearInterval(this.interval);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  tick() {
    let updated = this.assessmentUpdated(this.props.assessmentID);
    let givenScoredReport = this.state.givenScoredReport;

    if (updated && !givenScoredReport) {
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

    let loc = `/reports/${this.props.userID}`;
    console.log(loc);

    playSoundAsync("/audio/complete.mp3");

    setTimeout(function() {
      window.location.href = loc;
    }, 800);

    // getScoredText().then(res => {
    //   this.setState({ gradedText: res })
    // })
  }

  getDifficulty(acc, comp, compDenom) {
    const accOnlyScores = ["Frustrational", "Instructional", "Independent"];

    // Scores with comp
    const fullScores = [
      ["Frustrational", "Frustrational", "Frustrational", "Frustrational"],
      ["Frustrational", "Frustrational", "Instructional", "Instructional"],
      ["Frustrational", "Instructional", "Independent", "Independent"]
    ];
    // Indexed [acc] by [comp] so, [0][1] is an accIndex of 0 and compScore (index) of 1
    // based on Fountas and Pinnell: https://www.dropbox.com/s/gid9673g38cne07/Screenshot%202017-09-19%2011.13.32.png?dl=0

    // first, convert accuracy to an index
    let accIndex;

    if (acc >= 95) {
      accIndex = 2;
    } else if (acc >= 90) {
      accIndex = 1;
    } else {
      accIndex = 0;
    }

    let compIndex;

    if (compDenom === 3 && comp) {
      compIndex = comp;
    } else if (compDenom === 6 && comp) {
      if (comp >= 5) {
        compIndex = 3;
      } else if (comp >= 4) {
        compIndex = 2;
      } else if (comp >= 3) {
        compIndex = 1;
      } else {
        compIndex = 0;
      }
    }

    // Decide whether to use just acc, or the comp as well

    if (comp == null) {
      return accOnlyScores[accIndex];
    } else {
      return fullScores[accIndex][compIndex];
    }
  }

  getCompTotal() {
    if (this.props.isSample) {
      return 5;
    } else if (this.props.compScores["0"] === null) {
      return null;
    } else if (this.props.compScores["1"] === null) {
      //backwards compat
      return Number(this.props.compScores["0"]);
    }

    let total = 0;

    for (let i = 0; i < numQuestions; i++) {
      if (this.isQuestionGraded(i + 1)) {
        total += Number(this.props.compScores[String(i)]);
      }
    }

    return total;
  }

  getCompDenom() {
    if (this.props.isSample) {
      return 9;
    }

    let total = 0;

    for (let i = 0; i < numQuestions; i++) {
      total += book.questions[String(i + 1)].points;
    }

    return total;
  }

  hideReportReadyModal() {
    this.setState({ showReportReadyModal: false });
  }

  onExportClicked = () => {
    if (!this.state.showExportSuccess) {
      this.setState({ showExportLoading: true });
      setTimeout(
        () =>
          this.setState({
            showExportSuccess: true,
            showExportLoading: false
          }),
        2000
      );
    }
  };

  onLogoutClicked = () => {};

  onPlayRecordingClicked = () => {
    if (this.props.video) {
      this.setState({ showVideoPlayback: true });
    } else {
      this.setState({ showAudioPlayback: true });
    }
  };

  onHideVideoClicked = () => {
    this.setState({ showVideoPlayback: false });
  };

  onCompPlayRecordingClicked = qNum => {
    let showCompAudioNew = this.state.showCompAudioPlayback;
    showCompAudioNew[String(qNum)] = true;

    this.setState({ showCompAudioPlayback: showCompAudioNew });
  };

  onCompPlayVideoToggled = qNum => {
    console.log(
      "attempting to toggle q, to,: ",
      qNum,
      !this.state.showCompVideoPlayback[String(qNum)]
    );

    let showCompVideoNew = this.state.showCompVideoPlayback;
    showCompVideoNew[String(qNum)] = !showCompVideoNew[String(qNum)];

    this.setState({ showCompVideoPlayback: showCompVideoNew });
  };

  onPricingClicked = () => {
    this.setState({ showPricingModal: true });
  };

  onFooterClicked = () => {
    if (this.props.isDirectSample) {
      window.location.href =
        this.props.assessmentBrand === "FP" ? "/fp" : "/step";
    } else {
      this.setState({ showBookModal: true });
    }
  };

  onEmailFormSubmit = () => {
    this.setState({ showEmailModal: false });
    this.setState({ showSampleInfoModal: true });
    const email = this.state.email;
    const id = this.props.userID;

    const subject = ["Demo submitted: ", email].join(" ");
    const message = ["The user's email is ", email].join(" ");

    sendEmail(subject, message, ADMIN_EMAIL);
    updateUserEmail(email, id);

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

  closeBookModal = () => {
    this.setState({ showBookModal: false });
  };

  onAddNoteClicked = () => {
    this.setState({
      noNoteStarted: false,
      draftingNote: true
    });
  };

  toggleShowNote = () => {
    console.log("toggggling");
    this.setState({ showNote: !this.state.showNote });
  };

  onSaveNoteClicked = () => {
    updateAssessment(
      { teacher_note: this.noteInput.value },
      this.props.assessmentID
    );

    if (this.noteInput.value) {
      this.setState({
        noteExists: true,
        draftingNote: false,
        teacherNote: this.noteInput.value
      });
    } else {
      this.setState({
        noNoteStarted: true,
        draftingNote: false
      });
    }
  };

  onEditClicked = () => {
    updateAssessment({ teacher_note: this.noteInput }, this.props.assessmentID);

    this.setState({
      noteExists: false,
      draftingNote: true
    });
  };

  onPlaybookClicked = () => {
    this.setState({ showPlaybook: true });
  };

  onPlaybookClose = () => {
    this.setState({ showPlaybook: false });
  };

  onAssignClicked = () => {
    this.setState({ showAssignSuccessAlert: true });

    setTimeout(() => {
      this.setState({ showAssignSuccessAlert: false });
    }, 5500);
  };

  handleAlertDismiss = () => {
    this.setState({ showAssignSuccessAlert: false });
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

  renderCompAudio = questionNum => {
    if (this.props.video) {
      return (
        <div>
          <img
            src="/images/remove.svg"
            className={styles.videoExit}
            onClick={() => {
              this.onCompPlayVideoToggled(questionNum);
            }}
          />

          <video controls autoPlay preload="auto" className={styles.compVideo}>
            <source src={"/sample-video.mp4"} />
            <p>Playback not supported</p>
          </video>
        </div>
      );
    }

    if (this.props.isSample) {
      return (
        <audio
          controls
          autoPlay
          preload="auto"
          className={[
            styles.compAudioElement,
            !this.existTranscription(questionNum - 1)
              ? styles.noTranscriptionMiniPlayButton
              : ""
          ].join(" ")}
        >
          <source src={`/audio/sample/${questionNum}.mp3`} />
          <p>Playback not supported</p>
        </audio>
      );
    }

    let compURL;

    if (this.props.userID < 156) {
      compURL = `https://s3-us-west-2.amazonaws.com/readup-now/fake-assessments/${this
        .props.env}/${this.props.userID}/comp/recording.webm`;
    } else {
      compURL = `https://s3-us-west-2.amazonaws.com/readup-now/fake-assessments/${this
        .props.env}/${this.props.userID}/comp/question${questionNum}.webm`;
    }

    return (
      <audio
        controls
        autoPlay
        preload="auto"
        className={[
          styles.compAudioElement,
          !this.existTranscription(questionNum - 1)
            ? styles.noTranscriptionMiniPlayButton
            : ""
        ].join(" ")}
      >
        <source src={compURL} />
        <p>Playback not supported</p>
      </audio>
    );
  };

  existTranscription(questionNum) {
    return this.props.studentResponses[String(questionNum)];
  }

  // It's graded if there's a score and comment
  isQuestionGraded(qNum) {
    return (
      this.props.graderComments[String(qNum - 1)] &&
      this.props.compScores[String(qNum - 1)] != null
    );
  }

  areAllQuestionsGraded() {
    for (let i = 1; i < book.numQuestions; i++) {
      if (!isQuestionGraded(i - 1)) {
        return false;
      }
    }
    return true;
  }

  getCompSectionTotal(sectionNum) {
    let total = 0;

    for (let i = 0; i < book.numQuestions; i++) {
      if (
        this.isQuestionGraded(i + 1) &&
        book.questions[String(i + 1)].section === sectionNum
      ) {
        total += Number(this.props.compScores[String(i)]);
      }
    }

    return total;
  }

  getCompSectionDenom(sectionNum) {
    let total = 0;

    for (let i = 0; i < book.numQuestions; i++) {
      if (book.questions[String(i + 1)].section === sectionNum) {
        total += book.questions[String(i + 1)].points;
      }
    }

    return total;
  }

  getNumErrors() {
    let totalErrors = 0;
    let paragraphs = this.state.gradedText.paragraphs;

    for (let i = 0; i < paragraphs.length; i++) {
      let words = paragraphs[i].words;
      for (let k = 0; k < words.length; k++) {
        if (
          words[k].wordDeleted ||
          words[k].substituteWord ||
          words[k].addAfterWord
        ) {
          totalErrors += 1;
        }
      }
    }

    return totalErrors;
  }

  getTotalMiscueType(type) {
    let totalErrors = 0;
    let paragraphs = this.state.gradedText.paragraphs;

    for (let i = 0; i < paragraphs.length; i++) {
      let words = paragraphs[i].words;
      for (let k = 0; k < words.length; k++) {
        if (type.toLowerCase() === "m" && words[k].mTypeError) {
          totalErrors += 1;
        }

        if (type.toLowerCase() === "s" && words[k].sTypeError) {
          totalErrors += 1;
        }

        if (type.toLowerCase() === "v" && words[k].vTypeError) {
          totalErrors += 1;
        }
      }
    }

    return totalErrors;
  }

  getSubtotals() {
    let numSections = book.numSections;
    let arr = [];

    for (let i = 1; i <= numSections; i++) {
      const label = book.sections[String(i)];
      const str =
        String(this.getCompSectionTotal(i)) +
        "/" +
        String(this.getCompSectionDenom(i));
      const num = this.getCompSectionTotal(i) / this.getCompSectionDenom(i);
      arr.push([label, str, num]);
    }

    return arr;
  }

  getNextLevelString(delta, assessmentBrand, bookLevel) {
    if (assessmentBrand === "FP") {
      return "Level " + String.fromCharCode(bookLevel.charCodeAt(0) + delta);
    } else {
      return "STEP " + String(Number(bookLevel) + delta);
    }
  }

  getDelta(difficulty, didEndEarly) {
    if (this.props.isSample) {
      return -1;
    }

    if (this.props.isUnscorable || didEndEarly) {
      return 0;
    } else if (difficulty === "Frustrational") {
      return -1;
    } else {
      return 1;
    }
  }

  // renderFirstCharacters = () => {
  //   return
  // }

  render() {
    let subtotals = this.getSubtotals();

    let msvArr = [];

    let msv = ["Meaning", "Structure", "Visual"];

    for (let i = 0; i < 3; i++) {
      let label = msv[i];
      let str = String(
        Math.round(
          this.getTotalMiscueType(msv[i][0]) / this.getNumErrors() * 100
        )
      );
      let ratioStr =
        String(this.getTotalMiscueType(msv[i][0])) +
        "/" +
        String(this.getNumErrors());

      if (ratioStr === "0/0") {
        ratioStr = "-";
      }

      let num = this.getTotalMiscueType(msv[i][0]) / this.getNumErrors();

      msvArr.push([label, str, num, ratioStr]);
    }

    const acc = getAccuracy(this.state.gradedText);
    const WCPM = getWCPM(
      this.state.gradedText,
      this.props.totalTimeReading,
      this.props.isSample
    );
    const comp = 7;

    let itDidEndEarly = didEndEarly(this.state.gradedText);

    // let firstQuestionGraded = (this.props.studentResponses["0"] && this.props.graderComments["0"] && (this.props.compScores["0"] != null))
    // let secondQuestionGraded = (this.props.studentResponses["1"] && this.props.graderComments["1"] && (this.props.compScores["1"] != null))
    // let thirdQuestionGraded = (this.props.studentResponses["2"] && this.props.graderComments["2"] && (this.props.compScores["2"] != null))
    // let fourthQuestionGraded = (this.props.studentResponses["3"] && this.props.graderComments["3"] && (this.props.compScores["3"] != null))

    // let firstQuestionGraded = (this.props.graderComments["0"] && (this.props.compScores["0"] != null))
    // let secondQuestionGraded = (this.props.graderComments["1"] && (this.props.compScores["1"] != null))
    // let thirdQuestionGraded = (this.props.graderComments["2"] && (this.props.compScores["2"] != null))
    // let fourthQuestionGraded = (this.props.graderComments["3"] && (this.props.compScores["3"] != null))
    // let fifthQuestionGraded = (this.props.graderComments["4"] && (this.props.compScores["4"] != null))
    // let sixthQuestionGraded = (this.props.graderComments["5"] && (this.props.compScores["5"] != null))

    // let allQuestionsGraded = (firstQuestionGraded && secondQuestionGraded && thirdQuestionGraded && fourthQuestionGraded)

    const difficulty = this.getDifficulty(
      acc,
      this.getCompTotal(),
      this.getCompDenom()
    );

    let bookLevel;

    if (this.props.assessmentBrand === "FP") {
      bookLevel = book.fpLevel;
    } else {
      bookLevel = book.stepLevel;
    }

    let nextStepMsg = this.getNextLevelString(
      this.getDelta(difficulty, itDidEndEarly),
      this.props.assessmentBrand,
      bookLevel
    );

    return (
      <div className={styles.reportsContainer}>
        {this.props.isSample && (
          <div>
            <h4
              className={[styles.blueSubHeading, styles.dataManager].join(" ")}
              onClick={this.onExportClicked}
            >
              {this.props.assessmentBrand === "FP"
                ? "Export to Data Manager"
                : "Export to STEP Tool"}
            </h4>

            {this.state.showExportLoading && (
              <i
                style={{ marginLeft: 7, marginRight: 8.5 }}
                className={[
                  "fa",
                  "fa-refresh",
                  "animated",
                  "faa-spin",
                  "faa-slow",
                  styles.blueIcon
                ].join(" ")}
                aria-hidden={"true"}
              />
            )}

            {this.state.showExportSuccess && (
              <i
                style={{ marginLeft: 7, marginRight: 8.5 }}
                className={["fa", "fa-check", styles.blueIcon].join(" ")}
                aria-hidden={"true"}
              />
            )}
          </div>
        )}

        {this.props.isSample &&
          this.props.isDirectSample && (
            <h4
              onClick={() => {
                window.location.href =
                  "/reports/direct-sample?brand=" +
                  (this.props.assessmentBrand === "FP" ? "STEP" : "FP");
              }}
              className={[styles.blueSubHeading, styles.switchSTEPheading].join(
                " "
              )}
            >
              {`Using ${this.props.assessmentBrand === "FP"
                ? "STEP"
                : "F&P"}? Click here`}
            </h4>
          )}

        <div
          className={styles.contentWrapper}
          style={{
            paddingTop: this.props.fullPage ? 130 + "px" : 110 + "px",
            paddingLeft: this.props.fullPage ? 110 + "px" : 60 + "px"
          }}
        >
          <div className={styles.evaluationInfoHeader}>
            <div className={styles.mainHeadingContainer}>
              <div className={styles.studentNameHeading}>{this.props.name}</div>

              {this.props.isSample && (
                <LevelResult
                  difficulty="Frustrational"
                  currentLevel={bookLevel}
                  reassess={this.props.isUnscorable}
                  didEndEarly={false}
                  yellowColorOverride={true}
                  assessmentBrand={this.props.assessmentBrand}
                  nextStepMsg={nextStepMsg}
                  onAssignClicked={this.onAssignClicked}
                  onPlaybookClicked={this.onPlaybookClicked}
                />
              )}

              {!this.props.isSample && (
                <LevelResult
                  difficulty={difficulty}
                  currentLevel={bookLevel}
                  reassess={this.props.isUnscorable}
                  didEndEarly={itDidEndEarly}
                  assessmentBrand={this.props.assessmentBrand}
                  nextStepMsg={nextStepMsg}
                  userID={this.props.userID}
                  onAssignClicked={this.onAssignClicked}
                  onPlaybookClicked={this.onPlaybookClicked}
                />
              )}
            </div>

            {this.props.isUnscorable && (
              <div className={styles.metricsHeadingContainer}>
                <div className={styles.metricWrapper}>
                  <div
                    className={[
                      styles.metricFigureLabel,
                      styles.fairMetric
                    ].join(" ")}
                  >
                    {"—"}
                  </div>
                  <div className={styles.metricDescriptionLabel}>Accuracy</div>
                </div>

                <div className={styles.metricWrapper}>
                  <div
                    className={[
                      styles.metricFigureLabel,
                      styles.fairMetric
                    ].join(" ")}
                  >
                    {"—"}
                  </div>
                  <div className={styles.metricDescriptionLabel}>Words/Min</div>
                </div>

                <div className={styles.metricWrapper}>
                  <div
                    className={[
                      styles.metricFigureLabel,
                      styles.fairMetric
                    ].join(" ")}
                  >
                    {"—"}
                  </div>
                  <div className={styles.metricDescriptionLabel}>Comp.</div>
                </div>
              </div>
            )}

            {!this.props.isUnscorable && (
              <div className={styles.metricsHeadingContainer}>
                <Metric
                  label="Accuracy"
                  number={acc}
                  showDetails={
                    this.props.userID > 155 &&
                    (wasMSVgraded(this.state.gradedText.paragraphs) ||
                      acc === 100)
                  }
                  isSample={this.props.isSample}
                  msvSubtotals={msvArr}
                  showPlaybook={this.state.showPlaybook}
                  onPlaybookClose={this.onPlaybookClose}
                />

                {this.props.fluencyScore != null && (
                  <Metric
                    label="Fluency"
                    number={this.props.fluencyScore}
                    denominator={3}
                    showDetails={this.props.userID > 155}
                    isSample={this.props.isSample}
                  />
                )}

                {!this.props.isSample && (
                  <Metric
                    label="Words/Min"
                    number={WCPM}
                    showDetails={this.props.isSample}
                    isSample={this.props.isSample}
                  />
                )}

                {this.props.isSample && (
                  <Metric
                    label="Words/Min"
                    number={161}
                    showDetails={this.props.isSample}
                    isSample={this.props.isSample}
                  />
                )}

                {this.props.isSample && ( // No comp if it's not a sample
                  <Metric
                    label="Comp."
                    number={5}
                    denominator={9}
                    showDetails={this.props.isSample}
                    compSubtotals={subtotals}
                    isSample={this.props.isSample}
                    brand={this.props.assessmentBrand}
                  />
                )}

                {this.props.isSample &&
                  this.props.assessmentBrand === "STEP" && (
                    <Metric
                      label="Spelling"
                      number={17}
                      denominator={20}
                      showDetails={this.props.isSample}
                      compSubtotals={subtotals}
                      isSample={this.props.isSample}
                      brand={this.props.assessmentBrand}
                    />
                  )}

                {!this.props.isSample &&
                  this.props.compScores["0"] != null && (
                    <Metric
                      label="Comp."
                      number={this.getCompTotal()}
                      denominator={this.getCompDenom()}
                      showDetails={this.props.userID > 155}
                      compSubtotals={subtotals}
                      isSample={this.props.isSample}
                      brand={this.props.assessmentBrand}
                    />
                  )}

                {!this.props.isSample &&
                  this.props.compScores["0"] === null && (
                    <Metric
                      label="Comp."
                      number={this.getCompTotal()}
                      denominator={this.getCompDenom()}
                      showDetails={this.props.userID > 155}
                      compSubtotals={subtotals}
                      isSample={this.props.isSample}
                      brand={this.props.assessmentBrand}
                    />
                  )}
              </div>
            )}
          </div>

          {this.state.showAssignSuccessAlert && (
            <div className={styles.alertSuccess}>
              <Alert bsStyle="info" onDismiss={this.handleAlertDismiss}>
                <strong>Great!</strong> They'll get their next assessment when
                they log in.
              </Alert>
            </div>
          )}

          {this.state.noNoteStarted && (
            <Button
              className={styles.addNoteButton}
              bsStyle={"primary"}
              onClick={this.onAddNoteClicked}
            >
              Add your notes{" "}
              <i
                className={"fa fa-pencil"}
                style={{ marginLeft: 4 }}
                aria-hidden="true"
              />
            </Button>
          )}

          {this.state.draftingNote && (
            <div>
              <FormGroup controlId="teacherNote">
                <ControlLabel className={styles.noteControlLabel}>
                  {this.props.isSample
                    ? "Classroom Teacher Notes"
                    : "Your Notes"}
                </ControlLabel>
                <FormControl
                  className={styles.noteTextArea}
                  componentClass="textarea"
                  defaultValue={this.state.teacherNote}
                  inputRef={ref => {
                    this.noteInput = ref;
                  }}
                  placeholder="Your note"
                />
              </FormGroup>

              <Button
                className={styles.addNoteButton}
                bsStyle={"primary"}
                onClick={this.onSaveNoteClicked}
              >
                Save note{" "}
                <i
                  className={"fa fa-bookmark"}
                  style={{ marginLeft: 4 }}
                  aria-hidden="true"
                />
              </Button>
            </div>
          )}

          {this.state.noteExists && (
            <div>
              <ControlLabel className={styles.noteControlLabel}>
                {this.props.isSample ? "Classroom Teacher Notes" : "Your Notes"}
              </ControlLabel>

              <ShowMore
                lines={1}
                more="See More"
                less="See Less"
                anchorClass={styles.block}
              >
                {<p className={styles.grey}>{this.state.teacherNote}</p>}
              </ShowMore>

              <span className={styles.editSpan} onClick={this.onEditClicked}>
                {" "}
                Edit{" "}
                <i
                  className={"fa fa-pencil " + styles.caret}
                  aria-hidden="true"
                />
              </span>
            </div>
          )}

          <hr className={styles.metricsDivider} />

          <h5 className={styles.sectionHeader}>1. ORAL READING</h5>

          <div className={styles.bookInfoHeader}>
            <div className={styles.bookInfoWrapper}>
              <div className={styles.bookInfoTitle}>{book.title}</div>
              <div className={styles.bookInfoLevel}>Level {book.fpLevel}</div>
            </div>

            <div className={styles.audioWrapper}>
              {!this.state.showAudioPlayback &&
                !this.state.showVideoPlayback &&
                !this.state.playbackFidgets && (
                  <Button
                    className={styles.submitButton}
                    bsStyle={"primary"}
                    bsSize={"large"}
                    onClick={this.onPlayRecordingClicked}
                  >
                    {`${this.props.video ? "See" : "Hear"} ${firstName} Read`}
                    &nbsp;&nbsp;<i
                      className={[
                        "fa",
                        "fa-play",
                        "animated",
                        "faa-pulse"
                      ].join(" ")}
                      aria-hidden={"true"}
                    />
                  </Button>
                )}

              {!this.state.showAudioPlayback &&
                !this.state.showVideoPlayback &&
                this.state.playbackFidgets && (
                  <Button
                    className={[styles.wiggler, styles.submitButton].join(" ")}
                    bsStyle={"primary"}
                    bsSize={"large"}
                    onClick={this.onPlayRecordingClicked}
                  >
                    {`${this.props.video ? "See" : "Hear"} ${firstName} Read`}
                    &nbsp;&nbsp;<i
                      className={[
                        "fa",
                        "fa-play",
                        "animated",
                        "faa-pulse"
                      ].join(" ")}
                      aria-hidden={"true"}
                    />
                  </Button>
                )}

              {this.state.showAudioPlayback && (
                <audio
                  controls
                  autoPlay
                  preload="auto"
                  className={styles.audioElement}
                >
                  <source src={this.props.recordingURL} />
                  <p>Playback not supported</p>
                </audio>
              )}

              {this.state.showVideoPlayback && (
                <div>
                  <img
                    src="/images/remove.svg"
                    className={styles.videoExit}
                    onClick={this.onHideVideoClicked}
                  />

                  <video
                    controls
                    autoPlay
                    preload="auto"
                    style={{ width: 280 }}
                  >
                    <source
                      src={
                        "https://s3-us-west-2.amazonaws.com/readup-now/website/first-run.mp4"
                      }
                    />
                    <p>Playback not supported</p>
                  </video>
                </div>
              )}
            </div>
          </div>

          <FormattedMarkupText
            paragraphs={this.state.gradedText.paragraphs}
            isInteractive={false}
            endParagraphIndex={
              this.state.gradedText.readingEndIndex.paragraphIndex
            }
            endWordIndex={this.state.gradedText.readingEndIndex.wordIndex}
            bookLevel={bookLevel}
            isSample={this.props.isSample}
            showSeeMore={
              this.state.gradedText.readingEndIndex.paragraphIndex <
              this.state.gradedText.paragraphs.length - 1
            }
            showMSV={this.props.isSample || this.props.userID > 156} // backwards compatibility
            bookKey={this.props.bookKey}
          />

          {this.props.isSample && (
            <CompReport
              video={this.props.video}
              studentResponses={sampleStudentResponses}
              graderComments={sampleGraderComments}
              compScores={sampleCompScores}
              book={book}
              numQuestions={book.numQuestions}
              numSections={book.numSections}
              questions={book.questions}
              sections={book.sections}
              showCompAudioPlaybackHash={
                this.props.video
                  ? this.state.showCompVideoPlayback
                  : this.state.showCompAudioPlayback
              }
              // showCompAudioPlaybackHash={this.state.showCompAudioPlayback}
              onCompPlayRecordingClicked={
                this.props.video
                  ? this.onCompPlayVideoToggled
                  : this.onCompPlayRecordingClicked
              }
              // onCompPlayRecordingClicked={this.onCompPlayRecordingClicked}
              renderCompAudio={this.renderCompAudio}
              studentFirstName={firstName}
              isInteractive={false}
            />
          )}

          {!this.props.isSample && (
            <CompReport
              video={this.props.video}
              studentResponses={this.props.studentResponses}
              graderComments={this.props.graderComments}
              compScores={this.props.compScores}
              book={book}
              numQuestions={book.numQuestions}
              numSections={book.numSections}
              questions={book.questions}
              sections={book.sections}
              showCompAudioPlaybackHash={
                this.props.video
                  ? this.state.showCompVideoPlayback
                  : this.state.showCompAudioPlayback
              }
              onCompPlayRecordingClicked={
                this.props.video
                  ? this.onCompPlayVideoToggled
                  : this.onCompPlayRecordingClicked
              }
              renderCompAudio={this.renderCompAudio}
              studentFirstName={firstName}
              assessmentID={this.props.assessmentID}
              isInteractive={false}
            />
          )}

          {this.props.isSample &&
            this.props.assessmentBrand === "STEP" && (
              <div className={styles.spellingWrapper}>
                <hr className={styles.metricsDivider} />

                <h5 className={styles.sectionHeader}>3. SPELLING</h5>

                <div className={styles.sectionLargeTitle}>
                  <div className={styles.bookInfoWrapper}>
                    <div className={styles.bookInfoTitle}>
                      Developmental Spelling
                    </div>
                    {this.props.assessmentBrand === "FP" && (
                      <span className={styles.optional}>(Optional)</span>
                    )}
                  </div>
                </div>

                <SpellingReport spellingObj={sampleSpellingObj} />
              </div>
            )}

          {!this.props.isSample &&
            this.props.assessmentBrand === "STEP" &&
            this.props.scoredSpelling && (
              <div className={styles.spellingWrapper}>
                <hr className={styles.metricsDivider} />

                <h5 className={styles.sectionHeader}>3. SPELLING</h5>

                <div className={styles.sectionLargeTitle}>
                  <div className={styles.bookInfoWrapper}>
                    <div className={styles.bookInfoTitle}>
                      Developmental Spelling
                    </div>
                    {this.props.assessmentBrand === "FP" && (
                      <span className={styles.optional}>(Optional)</span>
                    )}
                  </div>
                </div>

                <SpellingReport spellingObj={this.props.scoredSpelling} />
              </div>
            )}

          <hr className={styles.metricsDivider} />

          <div className={styles.pricingFooter}>
            <div className={styles.pricingFooterLabel}>
              {this.state.footerLabelText}
            </div>
            <div className={[styles.footerButtonContainer]}>
              <Button
                className={[styles.pricingFooterButton].join(" ")}
                bsStyle={"primary"}
                bsSize={"large"}
                onClick={this.onFooterClicked}
              >
                {this.state.footerButtonText}
              </Button>
            </div>
          </div>
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
              Get your scored assessment soon
            </Modal.Title>
            <h4 className={styles.modalSubtitle}>
              Your scored assessment will come within 15 minutes
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
              <img
                alt=""
                className={[
                  styles.paperImage,
                  styles.readyModalPaperImage
                ].join(" ")}
                src="/images/checkmark-on-paper.jpg"
              />
            </div>
          </Modal.Body>
        </Modal>

        <style type="text/css">{".modal-backdrop.in { opacity: 0.7; } "}</style>
        <Modal
          show={this.state.showSampleInfoModal}
          onHide={this.closeSampleInfoModal}
          dialogClassName={styles.modalMedium}
        >
          <Modal.Header closeButton>
            <Modal.Title bsClass={styles.pricingModalTitle}>
              Great, here's an example of one first
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.pricingFormWrapper}>
              <Button
                className={styles.pricingFormButton}
                bsStyle={"primary"}
                onClick={this.onSampleButtonClick}
              >
                See sample
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

        <style type="text/css">{".modal-backdrop.in { opacity: 0.7; } "}</style>
        <Modal
          show={this.state.showBookModal}
          bsSize={"large"}
          onHide={this.closeBookModal}
        >
          <Modal.Body>
            <embed
              className={styles.pdf}
              src="/ReadUp-Leveled-Books-Library.pdf"
              type="application/pdf"
            />
          </Modal.Body>
        </Modal>

        <style type="text/css">
          {
            ".btn-primary:hover {  background-color: #337ab7; border-color: #2e6da4; }"
          }
        </style>
      </div>
    );
  }
}
