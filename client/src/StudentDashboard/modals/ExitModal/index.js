import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../commonstyles.css'

import ModalHeader from '../subcomponents/ModalHeader'
import RectangleButton from 'StudentDashboard/components/RectangleButton'
import ButtonArray from '../subcomponents/ButtonArray'

import BaseModal from '../BaseModal'

const THIS_MODAL_ID = 'modal-exit'

export default class ExitModal extends React.Component {
  static propTypes = {
    onContinueClicked: PropTypes.func,
    onExitAndUploadClicked: PropTypes.func,
    onExitNoUploadClicked: PropTypes.func,
    startedRecording: PropTypes.bool,

    currentShowModal: PropTypes.string,
    modalType: PropTypes.string,
        onTurnInClicked: PropTypes.func,

  };
  static defaultProps = {
    startedRecording: false,
  };
  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
  }


  render() {

    let exitAction

    // if (this.props.startedRecording) {
    //   exitAction = this.props.onExitAndUploadClicked
    // } else {
    //   exitAction = this.props.onExitNoUploadClicked
    // }

    exitAction = this.props.onExitNoUploadClicked // Keep this because it's more expected by user

    return (
      <BaseModal title="Exit?" show={(this.props.currentShowModal === THIS_MODAL_ID)} modalType="danger">


        <div className={commonStyles.modalButtonArrayWrapper}>
          <ButtonArray
            titles={['Keep reading', 'Turn in early', 'Exit book']}
            images={['fa-play', 'fa-check', 'fa-times']}
            actions={[this.props.onContinueClicked, this.props.onExitAndUploadClicked, exitAction]}
            enlargeFirst={true}
            fontAwesome={true}
            modalType={'danger'}
          />
        </div>



      </BaseModal>


    );
  }
}
