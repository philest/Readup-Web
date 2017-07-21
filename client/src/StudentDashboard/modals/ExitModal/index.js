import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../commonstyles.css'

import ModalHeader from '../subcomponents/ModalHeader'
import RectangleButton from 'StudentDashboard/components/RectangleButton'
import ButtonArray from '../subcomponents/ButtonArray'

export default class ExitModal extends React.Component {
  static propTypes = {
    onContinueClicked: PropTypes.func,
    onExitAndUploadClicked: PropTypes.func,
    onExitNoUploadClicked: PropTypes.func,
    startedRecording: PropTypes.bool,
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
    return (
      <div className={commonStyles.modalContainer}>
        <div className={commonStyles.modalHeaderWrapper}>
          <ModalHeader title="Paused" />
        </div>

        <div className={styles.exitModalTextWrapper}>

        {this.props.startedRecording && 
          <p className={styles.exitModalText}>Are you sure you want to quit? You can resume the demo, exit and upload your recording to be scored, or exit without uploading your recording.</p>
        }

        {!this.props.startedRecording && 
          <p className={styles.exitModalText}>Are you sure you want to quit? We can't show you how we score running records if you don't give us one! Press continue to start the demo.</p>
        }

        </div>

        <div className={styles.exitModalButtonArrayWrapper}>
          <RectangleButton
            className={styles.exitModalButton}
            title="Resume"
            style={{ width: 200, height: 50, backgroundColor: 'green', fontSize: 11, margin: 10 }}
            onClick={this.props.onContinueClicked}
          />

          {this.props.startedRecording && 
            <RectangleButton
              className={styles.exitModalButton}
              title="Exit & Upload"
              style={{ width: 200, height: 50, backgroundColor: '#3C8FCA', fontSize: 11, margin: 10 }}
              onClick={this.props.onExitAndUploadClicked}
            />
          }
          <RectangleButton
            className={styles.exitModalButton}
            title="Exit without uploading"
            style={{ width: 200, height: 50, backgroundColor: '#982E2B', fontSize: 11, margin: 10 }}
            onClick={this.props.onExitNoUploadClicked}
          />
        </div>


      </div>


    );
  }
}
