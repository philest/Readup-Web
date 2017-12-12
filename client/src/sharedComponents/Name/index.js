import PropTypes from "prop-types";
import React from "react";
import styles from "../AssignBooks/styles.css";
import myStyles from "./styles.css";

import { Button, Modal, FormControl, ControlLabel } from "react-bootstrap";

import { createUserWithClass } from "../../ReportsInterface/emailHelpers";

export default class Name extends React.Component {
  static propTypes = {
    hide: PropTypes.func.isRequired
  };

  static defaultProps = {};

  // User.create(first_name: "Dummy", last_name: "Teacher", name: "Dummy Teacher", password: "12345678", email:"dummy#{rand(1000000)}@gmail.com")

  createUser = name => {
    createUserWithClass(name)
      .then(res => {
        this.props.updateUserID(res.data.id);
        console.log("HERE: ", this.props.hide);
        this.props.hide();
      })
      .catch(err => {
        console.log(err);
      });
  };

  _handleKeyPress = e => {
    if (e.key === "Enter") {
      this.createUser(this.form.value);
    }
  };

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
            <Modal.Title className={myStyles.title}>Your Name</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <span className={myStyles.myLabel}>
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
              onKeyPress={this._handleKeyPress}
              inputRef={ref => {
                this.form = ref;
              }}
              autoFocus
            />

            {false && this.renderRoster()}

            <Button
              onClick={() => {
                this.createUser(this.form.value);
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
