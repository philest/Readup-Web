import PropTypes from "prop-types";
import React from "react";
import styles from "../AssignBooks/styles.css";
import myStyles from "./styles.css";

import { Button, Modal, FormControl } from "react-bootstrap";

export default class AddClass extends React.Component {
  static propTypes = {
    userID: PropTypes.number
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
              onClick={() => {}}
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
