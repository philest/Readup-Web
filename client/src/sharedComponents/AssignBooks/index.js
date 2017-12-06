import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";
import { Modal, Button } from "react-bootstrap";

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

  renderCol = colName => {
    let eltArr = [];
    let colArr;

    if (colName === "NAME") {
      colArr = names;
    } else if (colName === "LEVEL") {
      colArr = levels;
    } else if (colName === "BOOK") {
      colArr = books;
    }

    for (let i = 0; i < numStudents; i++) {
      eltArr.push(
        <div className={styles.rowElt} key={i}>
          {colArr[i]}
          {true && <hr />}
        </div>
      );
    }

    return <div className={styles.col}>{eltArr}</div>;
  };

  renderRoster = () => {
    return (
      <div className={styles.roster}>
        {this.renderCol("NAME")}
        {this.renderCol("LEVEL")}
        {this.renderCol("BOOK")}
      </div>
    );
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
