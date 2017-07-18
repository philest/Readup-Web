import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../commonstyles.css'

import ModalHeader from '../subcomponents/ModalHeader'
import RectangleButton from 'StudentDashboard/components/RectangleButton'
import ButtonArray from '../subcomponents/ButtonArray'

export default class SubmittedModal extends React.Component {
  static propTypes = {
    onStartOverClicked: PropTypes.func,  // TODO required?
    onTurnInClicked: PropTypes.func
  };

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
      <div className={commonStyles.fill}>
        <div className={styles.submittedContainer}>
          <h4 className={styles.title}>Great Job!</h4>
          <img src="/images/dashboard/Little-girl-jumping.png" className={styles.submittedImage} />
          <p className={styles.subtitle}>Logging out...</p>
        </div>
      </div>

       
    );
  }
}
