import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../commonstyles.css'

import ModalHeader from '../subcomponents/ModalHeader'
import RectangleButton from 'StudentDashboard/components/RectangleButton'
import ButtonArray from '../subcomponents/ButtonArray'

import BaseModal from '../BaseModal'

const THIS_MODAL_ID = 'modal-playback'

export default class PlaybackModal extends React.Component {
  static propTypes = {
    audioSrc: PropTypes.string,
    compAudioSrc: PropTypes.string,
    onStartOverClicked: PropTypes.func,  // TODO required?
    onTurnInClicked: PropTypes.func,

    currentShowModal: PropTypes.string,
    modalType: PropTypes.string,
    showSpinner: PropTypes.bool,
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

    let firstIcons

    if (this.props.showSpinner) {
      firstIcons = 'fa-spinner fa-pulse'
    } else {
      firstIcons = 'fa-check'
    }



    return (
      <BaseModal title='Your Recording' show={(this.props.currentShowModal === THIS_MODAL_ID)} modalType="info">

        <div className={styles.playbackContainer}>
          <h4 style={{ fontWeight: 'bold', marginTop: 20 }}>Hear reading</h4>
          <audio controls autoPlay style={{ marginBottom: 20 }}>
            <source src={this.props.audioSrc} />
            <p>Playback not supported</p>
          </audio>
          <h4 style={{ fontWeight: 'bold', marginTop: 20 }}>Hear first answer</h4>
          <audio controls style={{ marginBottom: 20 }}>
            <source src={this.props.compAudioSrc} />
            <p>Playback not supported</p>
          </audio>
 
        </div>

        <div className={commonStyles.modalButtonArrayWrapper}>
          <ButtonArray
            titles={['Turn it in', 'Mic broken']}
            images={[firstIcons, 'fa-microphone-slash']}
            actions={[this.props.onTurnInClicked, this.props.onStartOverClicked]}
            fontAwesome={true}
            enlargeFirst={true}
            showSpinner={this.props.showSpinner}
          />
        </div>


      </BaseModal>


    );
  }
}
