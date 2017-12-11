import PropTypes from "prop-types";
import React from "react";
import styles from "../AssignBooks/styles.css";
import myStyles from "./styles.css";

import { Button, Modal, FormControl, ControlLabel } from "react-bootstrap";

import {
  createStudentsForUser,
  setupClass
} from "../../ReportsInterface/emailHelpers";

let students = [
  "Phil Esterman",
  "Bradley Jay",
  "Jordy Zeldin",
  "Linny Jane",
  "Sammy Price",
  "Bradley Jay",
  "Jordy Zeldin",
  "Linny Jane",
  "Sammy Price"
];

export default class AddClass extends React.Component {
  static propTypes = {
    userID: PropTypes.number,
    hide: PropTypes.func
  };

  static defaultProps = {};

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {};
  }

  createStudents = userID => {
    let studentsArr = this.form.value.split("\n");

    if (studentsArr.length === 0) {
      return;
    }

    setupClass(studentsArr)
      .then(res => {
        console.log("results here!: ", res);
        this.props.hide();
      })
      .catch(err => {
        console.log(err);
      });
  };

  renderRow = (fullName, key, isCounter) => {
    return (
      <div
        key={key}
        className={[myStyles.addRow, isCounter ? myStyles.counter : ""].join(
          " "
        )}
      >
        <span>{fullName}</span>
        {!isCounter && (
          <i
            className={`fa fa-times ${myStyles.deleteIcon}`}
            aria-hidden="true"
          />
        )}
      </div>
    );
  };

  renderRoster = studentArr => {
    let rowArr = [];

    rowArr.push(
      <div>
        {this.renderRow("2 students", -1, true)}

        <hr
          style={{
            opacity: 0.35,
            marginTop: 0 + "em",
            marginBottom: 0 + "em"
          }}
        />
      </div>
    );

    for (let i = 0; i < studentArr.length; i++) {
      rowArr.push(
        <div>
          {this.renderRow(studentArr[i], i)}

          {(i + 1 !== studentArr.length || i <= 5) && (
            <hr
              style={{
                opacity: 0.35,
                marginTop: 0 + "em",
                marginBottom: 0 + "em"
              }}
            />
          )}
        </div>
      );
    }

    return <div>{rowArr}</div>;
  };

  render() {
    return (
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title className={styles.title}>Add Class</Modal.Title>
          </Modal.Header>

          <Modal.Header className={myStyles.minorHeader}>
            <span className={myStyles.myLabel}>
              <ControlLabel>Start typing to add students</ControlLabel>
            </span>
            <FormControl
              className={myStyles.input}
              type="text"
              spellCheck="false"
              inputRef={ref => {
                this.form = ref;
              }}
              autoFocus
            />
            <div className={myStyles.addIndicator} style={{ display: "none" }}>
              <i
                style={{ marginRight: 10 }}
                className="fa fa-plus"
                aria-hidden="true"
              />
              Add "James Franco"
            </div>
          </Modal.Header>

          <Modal.Body className={[styles.body, myStyles.addBody].join(" ")}>
            {this.renderRoster(students)}
          </Modal.Body>

          <Modal.Footer>
            <Button
              onClick={() => {
                this.createStudents(this.props.userID);
              }}
              className={styles.saveButton}
              bsSize="lg"
              bsStyle="primary"
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    );
  }
}
