import PropTypes from "prop-types";
import React from "react";

import styles from "../GraderInterface/styles.css";

import { Button, ButtonGroup } from "react-bootstrap";

import { updateStudent } from "../ReportsInterface/emailHelpers";
import { PromptOptions } from "../StudentDashboard/types";

export default class PromptButtons extends React.Component {
  static propTypes = {
    immediate: PropTypes.bool.isRequired, // this is passed from the Rails view
    showPromptAlert: PropTypes.func,
    studentID: PropTypes.number,
    sendPromptDataMessage: PropTypes.func
  };

  static defaultProps = {
    immediate: false
  };

  constructor(props, _railsContext) {
    super(props);
  }

  onPromptClicked = promptNumber => {
    let promptStatus = PromptOptions[Object.keys(PromptOptions)[promptNumber]];

    const params = { prompt_status: promptStatus };

    console.log(params);

    if (!this.props.immediate) {
      updateStudent(params, this.props.studentID);
      this.props.showPromptAlert();
    } else {
      this.props.sendPromptDataMessage(promptNumber);
    }
  };

  render() {
    return (
      <div className={[styles.compPromptContainer, styles.block]}>
        <style>{`.btn-group .btn {z-index: 0;}`}</style>
        <h4>
          {this.props.immediate
            ? "Immediate -- Live Prompts"
            : "Post-Question -- Prompts"}
        </h4>
        <ButtonGroup
          className={[styles.fluencyButtonGroup, styles.promptButtonGroup].join(
            " "
          )}
        >
          <Button href="#" onClick={() => this.onPromptClicked(1)}>
            Tell some more
          </Button>
          <Button href="#" onClick={() => this.onPromptClicked(2)}>
            What in the story makes you think that?
          </Button>
          <Button href="#" onClick={() => this.onPromptClicked(3)}>
            Why is that important?
          </Button>
          <Button href="#" onClick={() => this.onPromptClicked(4)}>
            Why do you think that?
          </Button>
          <Button href="#" onClick={() => this.onPromptClicked(5)}>
            Repeat the question
          </Button>
          <Button href="#" onClick={() => this.onPromptClicked(6)}>
            <strong>No prompt needed</strong>
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}
