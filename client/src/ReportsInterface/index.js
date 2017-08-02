import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap'

import styles from './styles.css'

import NavigationBar from '../StudentDashboard/components/NavigationBar'
import FormattedMarkupText from '../sharedComponents/FormattedMarkupText'
import { sampleEvaluationText } from '../sharedComponents/sampleMarkup'


export default class ReportsInterface extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired, // this is passed from the Rails view
  };


  constructor(props, _railsContext) {
    super(props);
    this.state = { showAudioPlayback: false }
  }

  onLogoutClicked = () => {

  }

  onPlayRecordingClicked = () => {
    this.setState({ showAudioPlayback: true })
  }


  render() {

    return (
      <div className={styles.reportsContainer}>

        <NavigationBar
          className={styles.navBar}
          studentName={this.props.name}
          showPauseButton={false}
          onExitClicked={this.props.onLogoutClicked}
        />


        <div className={styles.contentWrapper}>

          <div className={styles.evaluationInfoHeader}>

            <div className={styles.mainHeadingContainer}>
              <div className={styles.studentNameHeading}>Demo Student</div>
              <div className={styles.bookInfoSubheading}>Firefly Night -- Level H</div>
            </div>

            <div className={styles.metricsHeadingContainer}>
              <div className={styles.metricWrapper}>
                <div className={styles.metricFigureLabel}>94%</div>
                <div className={styles.metricDescriptionLabel}>Accuracy</div>
              </div>

              <div className={styles.metricWrapper}>
                <div className={styles.metricFigureLabel}>33</div>
                <div className={styles.metricDescriptionLabel}>wcpm</div>
              </div>


              <div className={styles.levelInfoWrapper}>
                <div className={styles.levelRectangle}>Level G</div>
                <div className={styles.levelLabel}>Just-right level found <i className={"fa fa-check"} aria-hidden={"true"} /></div>
              </div>

            </div>
          </div>


          <div className={styles.bookInfoHeader}>

            <div className={styles.bookInfoWrapper}>
              <div className={styles.bookInfoTitle}>Firefly Night</div>
              <div className={styles.bookInfoLevel}>Level H</div>
            </div>

            <div className={styles.audioWrapper}>

              { !this.state.showAudioPlayback &&
                <Button
                  className={styles.submitButton}
                  bsStyle={'primary'}
                  bsSize={'large'}
                  onClick={this.onPlayRecordingClicked}
                >
                  Play Recording &nbsp;&nbsp;<i className={"fa fa-play"} aria-hidden={"true"} />
                </Button>
              }

              { this.state.showAudioPlayback &&
                <audio controls autoPlay className={styles.audioElement}>
                  <source src={this.props.recordingURL} />
                  <p>Playback not supported</p>
                </audio>
              }

            </div>
          </div>


          <FormattedMarkupText
            paragraphs={sampleEvaluationText.paragraphs}
            isInteractive={false}
            endParagraphIndex={sampleEvaluationText.readingEndIndex.paragraphIndex}
            endWordIndex={sampleEvaluationText.readingEndIndex.wordIndex}
          />


        </div>
      </div>
    );
  }
}
