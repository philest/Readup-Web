import PropTypes from "prop-types";
import React from "react";
import styles from "../AssignBooks/styles.css";
import myStyles from "./styles.css";

import { Button, Modal, FormControl } from "react-bootstrap";

import {
  createStudentsForUser,
  setupClass
} from "../../ReportsInterface/emailHelpers";

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

    // createStudentsForUser(userID, studentsArr)
    //   .then(res => {
    //     console.log("results here!: ", res);
    //     this.props.hide();
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  };

  render() {
    return (
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title className={styles.title}>Add Class</Modal.Title>
          </Modal.Header>

          <style>
            {`.dropdown-menu { max-height: 140px; overflow-y: scroll; }`}
          </style>

          <Modal.Body className={styles.body}>
            <FormControl
              className={myStyles.spellingField}
              type="text"
              componentClass="textarea"
              bsSize="lg"
              spellCheck="false"
              inputRef={ref => {
                this.form = ref;
              }}
              autoFocus
            />

            {false && this.renderRoster()}
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
