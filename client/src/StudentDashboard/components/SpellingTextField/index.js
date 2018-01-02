import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

import { FormControl, ProgressBar } from "react-bootstrap";

import { saveSpellingResponse } from "../../sagas/networkingHelpers";
import { playSound, playSoundAsync } from "../../audioPlayer";

import VolumeIndicator from "../VolumeIndicator";

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
    onHearQuestionAgainClicked: PropTypes.func,
    hasVolume: PropTypes.bool,
    hasRightVolume: PropTypes.bool
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

    this.tick = this.tick.bind(this);
  }

  componentWillMount() {
    document.addEventListener("keydown", this._handleKeyDown);
  }

  componentDidMount() {
    this.form.focus();
    this.interval = setInterval(this.tick, 3000);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
    clearInterval(this.interval);
  }

  tick() {
    this.form.focus();
  }

  componentWillReceiveProps(nextProps) {
    this.form.focus();

    if (
      this.props.spellingQuestionNumber !== nextProps.spellingQuestionNumber // incremented by
    ) {
      const spellingGroupLibraryIdx = this.props.book.spellingObj.libraryIndex;

      saveSpellingResponse(
        this.form.value,
        this.props.spellingQuestionNumber,
        spellingGroupLibraryIdx
      );

      this.form.value = "";
      if (this.props.onSpellingInputSet) {
        // allow screencast to work without this
        this.props.onSpellingInputSet(""); // reset to empty
      }
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

    if (this.props.onSpellingInputSet) {
      // allow screencast to work without this
      this.props.onSpellingInputSet(this.form.value); // set to value
    }
  };

  render() {
    return (
      <div className={[styles.spellingContainer].join(" ")}>
        {this.props.hasVolume && (
          <VolumeIndicator
            hearAgainClicked={this.props.onHearQuestionAgainClicked}
            visible
            centered
            onClick={() => {
              this.form.focus();
            }}
          />
        )}

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

        {this.props.hasRightVolume && (
          <VolumeIndicator
            hearAgainClicked={this.props.onHearQuestionAgainClicked}
            offsetLeft
            visible
            centered
            onClick={() => {
              this.form.focus();
            }}
          />
        )}
      </div>
    );
  }
}
