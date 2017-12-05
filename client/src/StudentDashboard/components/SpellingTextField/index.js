import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

import { FormControl, ProgressBar } from "react-bootstrap";

import {
  updateAssessment,
  getAssessmentData
} from "../../../ReportsInterface/emailHelpers";
import { getLastAssessmentID } from "../../sagas/networkingHelpers";
import { spellingLibrary } from "../../state";
import { playSound, playSoundAsync } from "../../audioPlayer";

import { getSpellingGroupNumber } from "../../sagas/index";

export default class SpellingTextField extends React.Component {
  static propTypes = {
    spellingQuestionNumber: PropTypes.number,
    onSpellingAnswerGiven: PropTypes.func,
    showVolumeIndicator: PropTypes.bool,
    showSpellingBoxIndicator: PropTypes.bool,
    spellingQuestionNumber: PropTypes.number,
    onEnterPressed: PropTypes.func,
    onSpellingInputSet: PropTypes.func,
    spellingInput: PropTypes.string,
    book: PropTypes.object,
    onHearQuestionAgainClicked: PropTypes.func
  };
  static defaultProps = {};

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      showHelper: true
    };
  }

  saveSpellingResponse = (value, qNum) => {
    // get spelling object
    // save it temporarily
    // push in a new response
    // get assessment ID
    // update assessment

    const assessmentID = getLastAssessmentID();
    assessmentID.then(id => {
      console.log("id: ", id);

      const assessment = getAssessmentData(id);

      assessment
        .then(assessment => {
          console.log("assessment: ", assessment);

          let scoredSpellingHolder = assessment.scored_spelling;

          if (!scoredSpellingHolder) {
            scoredSpellingHolder =
              spellingLibrary[getSpellingGroupNumber(this.props.book)];
          }

          scoredSpellingHolder.responses[qNum - 1] = value;

          // scoredSpellingHolder.responses.push(value);

          // An alternate approach:
          // let arr = stateHolder.sections[String(sectionNum)].statusArr
          // arr[wordIdx] = !arr[wordIdx]

          updateAssessment(
            {
              scored_spelling: scoredSpellingHolder
            },
            id
          );
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  };

  componentWillMount() {
    document.addEventListener("keydown", this._handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.spellingQuestionNumber !== nextProps.spellingQuestionNumber // incremented by
    ) {
      if (
        nextProps.spellingQuestionNumber > this.props.spellingQuestionNumber ||
        nextProps.spellingQuestionNumber < this.props.spellingQuestionNumber
      ) {
        this.saveSpellingResponse(
          this.form.value,
          this.props.spellingQuestionNumber
        );
      }

      this.form.value = "";
      this.props.onSpellingInputSet(""); // reset to empty
      this.form.focus();
    }
  }

  _handleKeyDown = event => {
    if (event.which == 13 || event.keyCode == 13 || event.code == "Enter") {
      this.props.onEnterPressed();
    }
  };

  onInputClicked = () => {
    this.setState({ showHelper: false });
    this.props.onSpellingAnswerGiven(true);
  };

  handleSpellingChange = () => {
    this.setState({ showHelper: false });
    this.props.onSpellingAnswerGiven(true);

    this.props.onSpellingInputSet(this.form.value); // set to value
  };

  render() {
    return (
      <div className={[styles.spellingContainer].join(" ")}>
        <div
          onClick={() => {
            this.form.focus();

            this.props.onHearQuestionAgainClicked();
          }}
          className={[styles.introVolume, styles.clickable].join(" ")}
        >
          <br />
          <i
            className={[
              "fa fa-volume-up fa-3x",
              styles.volumeIcon,
              this.props.showVolumeIndicator
                ? "faa-pulse animated faa-fast"
                : ""
            ].join(" ")}
            style={{ color: "white" }}
            aria-hidden="true"
          />
          <h4 className={styles.volumeLabel}>Hear again</h4>
        </div>

        <style type="text/css">
          {`
            .form-control:focus {
              -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0px 26px rgba(102,175,233,.6);
              transition: all .3s;
            }

            .form-control {
              transition: all .3s;
            }

          `}
        </style>

        <FormControl
          className={styles.spellingField}
          type="text"
          bsSize="lg"
          spellCheck="false"
          onClick={this.onInputClicked}
          inputRef={ref => {
            this.form = ref;
          }}
          value={this.props.spellingInput}
          onChange={this.handleSpellingChange}
          autoFocus
        />

        <i
          className={[
            "fa fa-caret-right faa-passing animated",
            styles.helper
          ].join(" ")}
          style={{
            visibility: this.props.showSpellingBoxIndicator
              ? "visible"
              : "hidden"
          }}
        />

        <div className={styles.progress}>
          <ProgressBar now={this.props.progressNum} />
        </div>
      </div>
    );
  }
}
