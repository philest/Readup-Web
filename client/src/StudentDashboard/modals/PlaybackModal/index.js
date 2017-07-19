import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../commonstyles.css'

import ModalHeader from '../subcomponents/ModalHeader'
import RectangleButton from 'StudentDashboard/components/RectangleButton'
import ButtonArray from '../subcomponents/ButtonArray'

export default class PlaybackModal extends React.Component {
  static propTypes = {
    audioSrc: PropTypes.string.isRequired,
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
          <ModalHeader title="Your Recording" />
        </div>

        <div className={styles.playbackContainer}>
          <h4 style={{ fontWeight: 'bold', marginTop: 20 }}>Hear it</h4>
          <audio autoplay="autoplay" controls style={{ marginBottom: 20 }}>
            <source src={this.props.audioSrc} />
            <p>Playback not supported</p>
          </audio>
        </div>

        <div className={commonStyles.modalButtonArrayWrapper}>
          <ButtonArray
            titles={['Finish', 'Read again']}
            images={['/images/dashboard/finish-icon.png', '/images/dashboard/record-again-icon.png']}
            actions={[this.props.onTurnInClicked, this.props.onStartOverClicked]}
          />
        </div>


      </div>


    );
  }
}
