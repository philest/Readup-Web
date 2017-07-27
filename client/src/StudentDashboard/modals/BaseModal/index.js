import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../commonstyles.css'

import { Modal } from 'react-bootstrap'

import ModalHeader from '../subcomponents/ModalHeader'
import RectangleButton from 'StudentDashboard/components/RectangleButton'

export default class PausedModal extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    show: PropTypes.bool,
    animation: PropTypes.bool
  };

  static defaultProps = {
    show: true,
    animation: true,
  }

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {  };
  }

  render() {
    return (
      <Modal
        className={styles.baseModal}
        show={this.props.show}
        onHide={this.close}
        animation={this.props.animation}
      >
        <div className={commonStyles.modalContainer}>
          <div className={commonStyles.modalHeaderWrapper}>
            <ModalHeader title={this.props.title} />
          </div>

          {this.props.children}


        </div>
      </Modal>

    );
  }
}
