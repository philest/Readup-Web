import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import { Modal, Button, DropdownButton, MenuItem } from "react-bootstrap";

let numStudents = 12;
let names = [
  "Phil Esterman",
  "Jordy Zeldin",
  "Samantha Stobierski",
  "Phil Esterman",
  "Jordy Zeldin",
  "Samantha Stobierski",
  "Phil Esterman",
  "Jordy Zeldin",
  "Samantha Stobierski",
  "Phil Esterman",
  "Jordy Zeldin",
  "Samantha Stobierski"
];
let levels = [5, 4, 6, 7, 8, 8, 5, 4, 2, 5, 7, 12];
let books = [
  "Baby Avengers (P)",
  "Monster City (P)",
  "Hello from Sweet Home Alabama! (P)",
  "Baby Avengers (P)",
  "Monster City (P)",
  "Hello from Sweet Home Alabama! (Y)",
  "Baby Avengers (Y)",
  "Monster City (Y)",
  "Hello from Sweet Home Alabama! (Y)",
  "Baby Avengers (Y)",
  "Monster City (Y)",
  "Hello from Sweet Home Alabama! (Y)"
];

export default class AssignBooks extends React.Component {
  static propTypes = {
    teacherName: PropTypes.string
  };

  static defaultProps = {};

  componentWillMount() {}

  getColorClass = level => {
    if (level <= 4) {
      return styles.poorMetric;
    } else if (level <= 6) {
      return styles.fairMetric;
    } else if (level <= 12) {
      return styles.goodMetric;
    }
  };

  renderDropDownSTEP = level => {
    return (
      <div className={[styles.myDrop, this.getColorClass(level)].join(" ")}>
        <DropdownButton bsStyle="default" title={"STEP " + level}>
          <MenuItem eventKey="1">STEP 1</MenuItem>
          <MenuItem eventKey="2">STEP 2</MenuItem>
          <MenuItem eventKey="3" active>
            STEP 3
          </MenuItem>
          <MenuItem eventKey="4">STEP 4</MenuItem>
          <MenuItem eventKey="5">STEP 5</MenuItem>
          <MenuItem eventKey="6">STEP 6</MenuItem>
          <MenuItem eventKey="7">STEP 7</MenuItem>
          <MenuItem eventKey="8">STEP 8</MenuItem>
          <MenuItem eventKey="9">STEP 9</MenuItem>
          <MenuItem eventKey="10">STEP 10</MenuItem>
          <MenuItem eventKey="11">STEP 11</MenuItem>
          <MenuItem eventKey="12">STEP 12</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey="4">Separated link</MenuItem>
        </DropdownButton>
      </div>
    );
  };

  truncate = title => {
    if (title.length <= 18) {
      return title;
    }

    var trunc = title.substr(0, 18) + "\u2026";
    return trunc;
  };

  renderDropDownBook = book => {
    return (
      <div className={styles.bookElt}>
        <DropdownButton bsStyle="default" title={this.truncate(book)}>
          <MenuItem eventKey="1">The Magic Ring (Yellow)</MenuItem>
          <MenuItem eventKey="2" active>
            Ella's Magic (Purple)
          </MenuItem>
        </DropdownButton>
      </div>
    );
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {};
  }

  renderRow = (name, level, book, key) => {
    return (
      <div key={key} className={styles.row}>
        <span className={styles.nameElt}>{name}</span>

        {this.renderDropDownSTEP(level)}

        {this.renderDropDownBook(book)}
      </div>
    );
  };

  renderAllRows = () => {
    let rowArr = [];

    for (let i = 0; i < numStudents; i++) {
      rowArr.push(
        <div
          className={styles.rowElt}
          key={i}
          style={{
            marginBottom: i === numStudents - 1 ? 0 : 20
          }}
        >
          {this.renderRow(names[i], levels[i], books[i])}
          <hr
            style={{
              opacity: 0.55,
              marginBottom: i === numStudents - 1 ? 0 : 1 + "em"
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
