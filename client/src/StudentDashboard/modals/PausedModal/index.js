import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../commonstyles.css'

import ModalHeader from '../subcomponents/ModalHeader'
import RectangleButton from 'StudentDashboard/components/RectangleButton'
import ButtonArray from '../subcomponents/ButtonArray'

export default class PausedModal extends React.Component {
  static propTypes = {
    onContinueClicked: PropTypes.func.isRequired,
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
      <div className={commonStyles.modalContainer}>
        <div className={commonStyles.modalHeaderWrapper}>
          <ModalHeader title="Paused" />
        </div>

        <div className={styles.pausedModalContinueButtonWrapper}>
          <RectangleButton
            className={styles.pausedModalContinueButton}
            title="Go on!"
            style={{ width: 200, height: 65, backgroundColor: 'green' }}
            onClick={this.props.onContinueClicked}
          />
        </div>

        <div className={commonStyles.modalButtonArrayWrapper}>
          <ButtonArray
            titles={['Start over', 'Turn it in']}
            images={['/images/dashboard/record-again-icon.png', '/images/dashboard/finish-icon-blue.png']} 
            actions={[this.props.onStartOverClicked, this.props.onTurnInClicked]}
          />
        </div>


      </div>


    );
  }
}
