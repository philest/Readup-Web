import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../../modals/commonstyles.css'

export default class SubmittedModal extends React.Component {
  static propTypes = {
    onStartOverClicked: PropTypes.func,  // TODO required?
    onTurnInClicked: PropTypes.func,
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
          <h4 className={styles.title}>Good Job!</h4>
          <img src="/images/dashboard/Little-girl-jumping.png" className={styles.submittedImage} />
          <p className={styles.subtitle}>Goodbye for now!</p>
        </div>
      </div>


    );
  }
}
