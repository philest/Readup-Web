import PropTypes from "prop-types";
import React from "react";
import styles from "../AssignBooks/styles.css";
import myStyles from "./styles.css";

import { Button, Modal, FormControl, ControlLabel } from "react-bootstrap";

import {
  createStudentsForUser,
  setupClass
} from "../../ReportsInterface/emailHelpers";

function remove(array, element) {
  const index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

// let students = [
//   "Phil Esterman",
//   "Bradley Jay",
//   "Jordy Zeldin",
//   "Linny Jane",
//   "Sammy Price",
//   "Bradley Jay",
//   "Jordy Zeldin",
//   "Linny Jane",
//   "Sammy Price"
// ];

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
    this.state = {
      students: [],
      showIndicator: false,
      inputValue: ""
    };
  }

  checkForm = () => {
    this.setState({ inputValue: this.form.value });

    if (this.form.value !== "") {
      this.setState({ showIndicator: true });
    } else {
      this.setState({ showIndicator: false });
    }
  };

  _handleKeyPress = e => {
    if (e.key === "Enter") {
      this.validateAndSubmit();
    }
  };

  validateAndSubmit = () => {
    console.log("do validate");
    this.addStudent(this.form.value);
    this.setState({ inputValue: "" });
    this.setState({ showIndicator: false });
    this.form.focus();
  };

  addStudent = fullName => {
    let holder = this.state.students;
    holder.unshift(fullName);
    this.setState({ students: holder });
  };

  removeStudent = fullName => {
    let holder = this.state.students;

    remove(holder, fullName);
    this.setState({ students: holder });
  };

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
            style={{ cursor: "pointer" }}
            onClick={() => {
              this.removeStudent(fullName);
            }}
          />
        )}
      </div>
    );
  };

  renderRoster = studentArr => {
    let rowArr = [];

    if (studentArr.length > 0) {
      rowArr.push(
        <div>
          {this.renderRow(`${studentArr.length} students`, -1, true)}

          <hr
            style={{
              opacity: 0.35,
              marginTop: 0 + "em",
              marginBottom: 0 + "em"
            }}
          />
        </div>
      );
    }

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
              onKeyPress={this._handleKeyPress}
              onChange={this.checkForm}
              value={this.state.inputValue}
            />
            <div
              className={myStyles.addIndicator}
              style={{
                visibility: this.state.showIndicator ? "visible" : "hidden",
                cursor: "pointer"
              }}
              onClick={this.validateAndSubmit}
            >
              <i
                style={{ marginRight: 10 }}
                className="fa fa-plus"
                aria-hidden="true"
              />
              {`Add '${this.state.inputValue}'`}
            </div>
          </Modal.Header>

          <Modal.Body className={[styles.body, myStyles.addBody].join(" ")}>
            {this.renderRoster(this.state.students)}
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
