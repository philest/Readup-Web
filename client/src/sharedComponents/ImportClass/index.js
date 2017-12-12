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

function remove(array, element) {
  const index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

export default class ImportClass extends React.Component {
  static propTypes = {
    hide: PropTypes.func,
    importStudents: PropTypes.func
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

  import = () => {
    console.log("heree");
    let arr = this.form.value.split("\n");

    if (arr.length >= 1) {
      this.props.importStudents(arr);
    }

    this.props.hide();
  };

  render() {
    return (
      <div className="static-modal">
        <style type="text/css">{".modal-backdrop.in { opacity: 0.7; } "}</style>
        <Modal show onHide={this.props.hide}>
          <Modal.Header closeButton>
            <Modal.Title className={styles.title}>
              Copy/Paste Student List
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className={[styles.body, myStyles.addBody].join(" ")}>
            <span className={myStyles.myLabel}>
              <ControlLabel>Paste your student list from Word</ControlLabel>
            </span>
            <FormControl
              placeholder={
                "Examples:\n\nFirst name Last Name\nFirst name Last name\nFirst name Last name"
              }
              className={myStyles.spellingField}
              componentClass="textarea"
              spellCheck="false"
              inputRef={ref => {
                this.form = ref;
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={this.import}
              className={styles.saveButton}
              bsSize="lg"
              bsStyle="primary"
              disabled={false}
            >
              Done
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
