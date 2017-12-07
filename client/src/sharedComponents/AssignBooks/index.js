import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import { Modal, Button, DropdownButton, MenuItem } from "react-bootstrap";

import { library } from "../bookObjects.js";

let myClass = {
  numStudents: 3,
  1: {
    name: "Phil Esterman",
    level: 4,
    bookKey: "step4"
  },
  2: {
    name: "Sammy Sworskovi",
    level: 6,
    bookKey: "step6"
  },
  3: {
    name: "Jamie Lancaster",
    level: 8,
    bookKey: "step8"
  }
};

function getBookKeysAtLevel(level) {
  let titleArr = [];

  for (var bookKey in library) {
    if (
      library.hasOwnProperty(bookKey) &&
      library[bookKey].stepLevel === level
    ) {
      titleArr.push(bookKey);
    }
  }

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
    teacherName: PropTypes.string
  };

  static defaultProps = {};

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      myClass: myClass
    };
  }

  getColorClass = level => {
    if (level <= 4) {
      return styles.poorMetric;
    } else if (level <= 6) {
      return styles.fairMetric;
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

    for (let i = 1; i <= myClass.numStudents; i++) {
      rowArr.push(
        <div
          className={styles.rowElt}
          key={i}
          style={{
            marginBottom: i === myClass.numStudents ? 0 : 10
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
              marginBottom: i === myClass.numStudents ? 0 : 0.35 + "em"
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
            <Button className={styles.saveButton} bsSize="lg" bsStyle="primary">
              Done
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    );

    return modalInstance;
  }
}
