import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import { Modal, Button, DropdownButton, MenuItem } from "react-bootstrap";

import { library } from "../bookObjects.js";

import {
  getAllStudents,
  getAllAssessments,
  updateAllAssessments
} from "../../ReportsInterface/emailHelpers";

let studentDataArr;

function getBookKeysAtLevel(level) {
  let titleArr = [];

  for (var bookKey in library) {
    if (
      library.hasOwnProperty(bookKey) &&
      library[bookKey].stepLevel === level &&
      library[bookKey].brand === "STEP"
    ) {
      titleArr.push(bookKey);
    }
  }

  console.log("There (level, titleArr)", level, titleArr);

  return titleArr;
}

function getSeriesTag(bookKey) {
  if (library[bookKey].stepSeries === "PURPLE") {
    return " (P)";
  } else if (library[bookKey].stepSeries === "NONE") {
    return "";
  } else {
    return " (Y)";
  }
}

export default class AssignBooks extends React.Component {
  static propTypes = {
    teacherName: PropTypes.string,
    userID: PropTypes.number,
    hideModal: PropTypes.func
  };

  static defaultProps = {};

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      myClass: {}
    };
  }

  batchUpdate = myClass => {
    let assessments = {};

    for (var studentKey in myClass) {
      if (
        myClass.hasOwnProperty(studentKey) &&
        myClass[studentKey].assessmentID !== "NO_ASSESSMENT_CREATED" &&
        myClass[studentKey].assessmentID
      ) {
        let elt = { book_key: myClass[studentKey].bookKey };
        assessments[myClass[studentKey].assessmentID] = elt;
      }
    }

    console.log("assessments: ", assessments);

    let res = updateAllAssessments(assessments);
    console.log(res);

    // for each key in myClass
    // grab that elts bookKey
    // grab that elts assessmentID
    // add the key:value pair to the assessments hash
    // submit the assessments hash
  };

  componentWillMount = () => {
    let newClass = {};
    let userID = this.props.userID;

    getAllStudents(userID)
      .then(res => {
        console.log("resolved: ");
        console.log(res);
        const studentDataArr = res.data;

        getAllAssessments(userID).then(res => {
          const assessmentDataArr = res.data;

          newClass.numStudents = studentDataArr.length;
          for (let i = 0; i < studentDataArr.length; i++) {
            newClass[i + 1] = {
              name:
                studentDataArr[i].first_name +
                " " +
                studentDataArr[i].last_name,
              level: assessmentDataArr[i]
                ? library[assessmentDataArr[i].book_key].stepLevel
                : 5,
              bookKey: assessmentDataArr[i]
                ? assessmentDataArr[i].book_key
                : "step5",
              assessmentID: assessmentDataArr[i]
                ? assessmentDataArr[i].id
                : "NO_ASSESSMENT_CREATED"
            };
          }
          console.log;

          this.setState({ myClass: newClass });
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  getColorClass = level => {
    if (level <= 3) {
      return styles.poorMetric;
    } else if (level <= 12) {
      return styles.goodMetric;
    }
  };

  truncate = title => {
    console.log("attempting to trunc: ", title);

    if (title.length <= 18) {
      return title;
    }

    var trunc = title.substr(0, 18) + "\u2026";
    return trunc;
  };

  changeSTEP = (newLevel, id) => {
    let myClassHolder = this.state.myClass;
    myClassHolder[id].level = newLevel;

    let bookKeyArr = getBookKeysAtLevel(newLevel);
    myClassHolder[id].bookKey = bookKeyArr[0];

    this.setState({ myClass: myClassHolder });
  };

  changeBookKey = (newBookKey, id) => {
    let myClassHolder = this.state.myClass;
    myClassHolder[id].bookKey = newBookKey;
    this.setState({ myClass: myClassHolder });
  };

  renderSTEPmenuItems = (activeLevel, id) => {
    let menuArr = [];

    for (let i = 1; i <= 12; i++) {
      menuArr.push(
        <MenuItem
          eventKey={i}
          active={activeLevel === i}
          onClick={() => {
            this.changeSTEP(i, id);
          }}
        >
          {`STEP ${i}`}
        </MenuItem>
      );
    }

    return menuArr;
  };

  renderBookmenuItems = (activeBookKey, level, id) => {
    let bookKeyArr = getBookKeysAtLevel(level);
    let menuArr = [];

    for (let i = 0; i < bookKeyArr.length; i++) {
      menuArr.push(
        <MenuItem
          eventKey={i}
          active={activeBookKey === bookKeyArr[i]}
          onClick={() => {
            this.changeBookKey(bookKeyArr[i], id);
          }}
        >
          {library[bookKeyArr[i]].title + getSeriesTag(bookKeyArr[i])}
        </MenuItem>
      );
    }

    return menuArr;
  };

  renderDropDownSTEP = (level, id) => {
    return (
      <div className={[styles.myDrop, this.getColorClass(level)].join(" ")}>
        <DropdownButton bsStyle="default" title={"STEP " + level}>
          {this.renderSTEPmenuItems(level, id)}
        </DropdownButton>
      </div>
    );
  };

  renderDropDownBook = (bookKey, level, id) => {
    console.log("Here we are (bookKey, level, id)", bookKey, level, id);

    return (
      <div className={styles.bookElt}>
        <DropdownButton
          bsStyle="default"
          title={this.truncate(library[bookKey].title) + getSeriesTag(bookKey)}
        >
          {this.renderBookmenuItems(bookKey, level, id)}
        </DropdownButton>
      </div>
    );
  };

  renderRow = (name, level, book, id) => {
    return (
      <div key={id} className={styles.row}>
        <span className={styles.nameElt}>{name}</span>

        {this.renderDropDownSTEP(level, id)}

        {this.renderDropDownBook(book, level, id)}
      </div>
    );
  };

  renderAllRows = () => {
    let rowArr = [];

    for (let i = 1; i <= this.state.myClass.numStudents; i++) {
      rowArr.push(
        <div
          className={styles.rowElt}
          key={i}
          style={{
            marginBottom: i === this.state.myClass.numStudents ? 0 : 10
          }}
        >
          {this.renderRow(
            this.state.myClass[i].name,
            this.state.myClass[i].level,
            this.state.myClass[i].bookKey,
            i
          )}
          <hr
            style={{
              opacity: 0.55,
              marginTop: 0.35 + "em",
              marginBottom:
                i === this.state.myClass.numStudents ? 0 : 0.35 + "em"
            }}
          />
        </div>
      );
    }

    return <div className={styles.col}>{rowArr}</div>;
  };

  renderRoster = () => {
    return <div className={styles.roster}>{this.renderAllRows()}</div>;
  };

  render() {
    const modalInstance = (
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title className={styles.title}>Assign Books</Modal.Title>
          </Modal.Header>

          <style>
            {`.dropdown-menu { max-height: 140px; overflow-y: scroll; }`}
          </style>

          <Modal.Body className={styles.body}>{this.renderRoster()}</Modal.Body>

          <Modal.Footer>
            <Button
              onClick={() => {
                this.props.back();
              }}
              className={[styles.saveButton, styles.backButton].join(" ")}
              bsSize="lg"
              bsStyle="default"
            >
              Back
            </Button>

            <Button
              onClick={() => {
                this.batchUpdate(this.state.myClass);
                this.props.hideModal();
              }}
              className={[styles.saveButton, styles.offcenter].join(" ")}
              bsSize="lg"
              bsStyle="primary"
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    );

    return modalInstance;
  }
}
