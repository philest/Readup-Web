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
let levels = [5, 4, 6, 5, 4, 6, 5, 4, 6, 5, 4, 6];
let books = [
  "Baby Avengers",
  "Monster City",
  "Hello from Sweet Home Alabama!",
  "Baby Avengers",
  "Monster City",
  "Hello from Sweet Home Alabama!",
  "Baby Avengers",
  "Monster City",
  "Hello from Sweet Home Alabama!",
  "Baby Avengers",
  "Monster City",
  "Hello from Sweet Home Alabama!"
];

export default class AssignBooks extends React.Component {
  static propTypes = {
    teacherName: PropTypes.string
  };

  static defaultProps = {};

  componentWillMount() {}

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

        <style>{".dropdown-menu { height: 140px; overflow-y: scroll; }"}</style>
        <DropdownButton
          bsStyle="default"
          title={"STEP " + level}
          className={styles.myDrop}
          key={key}
        >
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

        <span className={styles.bookElt}>{book}</span>
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

          <Modal.Body className={styles.body}>{this.renderRoster()}</Modal.Body>

          <Modal.Footer>
            <Button className={styles.saveButton} bsStyle="primary">
              Save
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    );

    return modalInstance;
  }
}
