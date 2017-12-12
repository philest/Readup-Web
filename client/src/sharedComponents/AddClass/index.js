import PropTypes from "prop-types";
import React from "react";
import styles from "../AssignBooks/styles.css";
import myStyles from "./styles.css";

import {
  Button,
  Modal,
  FormControl,
  ControlLabel,
  FormGroup
} from "react-bootstrap";

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
    hide: PropTypes.func,
    showImport: PropTypes.func,
    importedStudents: PropTypes.array
  };

  static defaultProps = {
    importedStudents: []
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      students: [],
      showIndicator: false,
      inputValue: "",
      validationState: null
    };
  }

  componentWillUpdate(nextProps) {
    if (this.props.importedStudents !== nextProps.importedStudents) {
      let holder = nextProps.importedStudents.concat(this.state.students);
      this.setState({ students: holder });
    }
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
    if (this.validate() !== false) {
      this.addStudent(this.form.value);
      this.setState({ inputValue: "" });
      this.setState({ showIndicator: false });
      this.form.focus();
    }
  };

  validate = () => {
    let arr = this.form.value.split(" ");
    if (arr.length <= 1) {
      this.setState({ validationState: "error" });
      return false;
    } else {
      this.setState({ validationState: null });
      return true;
    }
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
    if (this.state.students.length === 0) {
      return;
    }

    setupClass(this.state.students)
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

    if (rowArr.length > 0) {
      return <div>{rowArr}</div>;
    } else {
      return (
        <span className={myStyles.noIndicator}>No students added yet</span>
      );
    }
  };

  render() {
    return (
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title className={styles.title}>Add Class</Modal.Title>
            <span
              onClick={this.props.showImport}
              className={myStyles.importCTA}
            >
              <i style={{ marginRight: 7 }} className="fa fa-file" />Import
              Class
            </span>
          </Modal.Header>

          <Modal.Header className={myStyles.minorHeader}>
            <FormGroup validationState={this.state.validationState}>
              <span className={myStyles.myLabel}>
                <ControlLabel>
                  {this.state.validationState === "error"
                    ? "Last name is required"
                    : "Start typing to add students"}
                </ControlLabel>
              </span>
              <FormControl
                placeholder="First and last name"
                className={myStyles.input}
                type="text"
                spellCheck="false"
                inputRef={ref => {
                  this.form = ref;
                }}
                onKeyPress={this._handleKeyPress}
                onChange={this.checkForm}
                value={this.state.inputValue}
                autoFocus
              />
            </FormGroup>

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
              disabled={this.state.students.length === 0}
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    );
  }
}
