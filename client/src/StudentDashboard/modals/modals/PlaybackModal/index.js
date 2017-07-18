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
      <div className={commonStyles.modalContainer}>
        <div className={commonStyles.modalHeaderWrapper}>
          <ModalHeader title="Paused" />
        </div>

        <div className={styles.playbackContainer}>
          <h4 style={{ fontWeight: 'bold', marginTop: 20 }}>Hear it</h4>
          <audio src={this.props.audioSrc} style={{ marginBottom: 20 }} controls>

          </audio>
        </div>
        
        <div className={commonStyles.modalButtonArrayWrapper}>
          <ButtonArray
            titles={['Start over', 'Turn it in']}
            images={['/images/dashboard/record-again-icon.png', '/images/dashboard/turn-it-in-icon.png']}  //TODO strip /images/dashboard
            actions={[this.props.onStartOverClicked, this.props.onTurnInClicked]}
          />
        </div>


      </div>

       
    );
  }
}
