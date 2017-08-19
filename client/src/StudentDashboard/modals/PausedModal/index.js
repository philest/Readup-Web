import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../commonstyles.css'

import ModalHeader from '../subcomponents/ModalHeader'
import RectangleButton from 'StudentDashboard/components/RectangleButton'
import ButtonArray from '../subcomponents/ButtonArray'

import BaseModal from '../BaseModal'

const THIS_MODAL_ID = 'modal-paused'

export default class PausedModal extends React.Component {
  static propTypes = {
    onContinueClicked: PropTypes.func.isRequired,
    onStartOverClicked: PropTypes.func,  // TODO required?
    onTurnInClicked: PropTypes.func,

    currentShowModal: PropTypes.string,
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
      <BaseModal title='Paused' show={(this.props.currentShowModal === THIS_MODAL_ID)}>

        <div className={commonStyles.modalButtonArrayWrapper}>
          <ButtonArray
            titles={['Turn it in', 'Go on', 'Start over']}
            images={['/images/dashboard/finish-icon-green.png', '/images/dashboard/go-on-icon.png', '/images/dashboard/record-again-icon.png' ]}
            actions={[this.props.onTurnInClicked, this.props.onContinueClicked, this.props.onStartOverClicked ]}
            enlargeFirst={true}
          />
        </div>


      </BaseModal>


    );
  }
}
