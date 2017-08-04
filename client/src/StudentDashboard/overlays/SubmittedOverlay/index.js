import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../../modals/commonstyles.css'

const THIS_OVERLAY_ID = 'overlay-submitted'

export default class SubmittedModal extends React.Component {
  static propTypes = {
    onStartOverClicked: PropTypes.func,  // TODO required?
    onTurnInClicked: PropTypes.func,

    currentShowOverlay: PropTypes.string,
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

    if (this.props.currentShowOverlay !== THIS_OVERLAY_ID) {
      return null
    }

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
