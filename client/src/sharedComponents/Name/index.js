import PropTypes from "prop-types";
import React from "react";
import styles from "../AssignBooks/styles.css";
import myStyles from "./styles.css";

import { Button, Modal, FormControl, ControlLabel } from "react-bootstrap";

import { createStudentsForUser } from "../../ReportsInterface/emailHelpers";

export default class Name extends React.Component {
  static propTypes = {
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

  render() {
    return (
      <div className="static-modal">
        <style>
          {`@media (min-width: 768px) { .modal-sm { width: 410px; } }`}
        </style>
        <Modal.Dialog bsSize={"sm"}>
          <Modal.Header>
            <Modal.Title className={styles.title}>Your Name</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <span className={styles.myLabel}>
              <ControlLabel
                style={{ marginLeft: 10 + "%", marginTop: 7, color: "#505050" }}
              >
                Full Name
              </ControlLabel>
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

            {false && this.renderRoster()}

            <Button
              onClick={() => {
                this.createStudents(this.props.userID);
              }}
              className={styles.saveButton}
              bsStyle="primary"
            >
              Done
            </Button>
          </Modal.Body>
        </Modal.Dialog>
      </div>
    );
  }
}
