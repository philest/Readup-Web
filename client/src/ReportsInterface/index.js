import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import NavigationBar from '../StudentDashboard/components/NavigationBar'
import InfoBar from './components/InfoBar'

import FormattedMarkupText from '../sharedComponents/FormattedMarkupText'
import { Button, Modal } from 'react-bootstrap'

import { sampleEvaluationText } from '../sharedComponents/sampleMarkup'



export default class ReportsInterface extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired, // this is passed from the Rails view
  };


  constructor(props, _railsContext) {
    super(props);
    this.state = {
      showAudioPlayback: false,
      showPricingModal: false,
      schoolName: '',
      phoneNumber: '',
    }
  }

  componentWillMount() {
    document.addEventListener("keydown", this._handleKeyDown);

  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  onLogoutClicked = () => {

  }

  onPlayRecordingClicked = () => {
    this.setState({ showAudioPlayback: true })
  }

  onPricingClicked = () => {
    this.setState({ showPricingModal: true })
  }

  closePricingModal = () => {
    this.setState({ showPricingModal: false })
  }

  _handleKeyDown = (event) => {
    if (this.state.showPricingModal && event.code === 'Enter') {
      this.onPricingFormSubmit()
    }
  }

  handleSchoolNameChange = (event) => {
    this.setState({ schoolName: event.target.value })
  }

  handlePhoneNumberChange = (event) => {
    this.setState({ phoneNumber: event.target.value })
  }

  onPricingFormSubmit = () => {
    const schoolName = this.state.schoolName
    const phoneNumber = this.state.phoneNumber

    // TODO do something with the data

  }


  render() {

    return (
      <div className={styles.reportsContainer}>



        <InfoBar
          title={"Example Report"}
          subtitle={"Sofia Vergara"}
          extraInfo={"Your actual report will come tonight"}
        />

        <div className={styles.contentWrapper}>

          <div className={styles.evaluationInfoHeader}>

            <div className={styles.mainHeadingContainer}>
              <div className={styles.studentNameHeading}>Sofia Vergara</div>
              <div className={styles.bookInfoSubheading}>
                <p>Firefly Night <span>- Level H</span></p>
              </div>
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

              <div className={styles.metricWrapper}>
                <div className={styles.metricFigureLabel}>4/5</div>
                <div className={styles.metricDescriptionLabel}>Comp.</div>
              </div>



              <div className={styles.levelInfoWrapper}>
                <div className={styles.levelRectangle}>Level H</div>
                <div className={styles.levelLabel}>Just-right level found <i className={"fa fa-check"} aria-hidden={"true"}></i></div>
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
                  Play Recording &nbsp;&nbsp;<i className={"fa fa-play faa-pulse animated"} aria-hidden={"true"}></i>
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

          <div className={styles.pricingFooter}>
            <div className={styles.pricingFooterLabel}>
              Want Readup at your school?
            </div>
            <Button
              className={styles.pricingFooterButton}
              bsStyle={'primary'}
              bsSize={'large'}
              onClick={this.onPricingClicked}
            >
              Get Pricing
            </Button>
          </div>


        </div>

        
        <style type="text/css">{'.modal-backdrop.in { opacity: 0.9; } '}</style>
        <Modal show={this.state.showPricingModal} onHide={this.closePricingModal}>
          <Modal.Header closeButton>
            <Modal.Title bsClass={styles.pricingModalTitle}>
              Request Pricing
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            <div className={styles.pricingFormWrapper}>

              <div className={styles.pricingFormField}>
                <div className={styles.pricingFormFieldLabel}>
                  School name
                </div>
                <input
                  className={styles.pricingFormFieldInput}
                  placeholder={"School name"}
                  value={this.state.schoolName}
                  onChange={this.handleSchoolNameChange}
                />
              </div>

              <div className={styles.pricingFormField}>
                <div className={styles.pricingFormFieldLabel}>
                  Your phone number
                </div>
                <input
                  className={styles.pricingFormFieldInput}
                  placeholder={"Phone number"}
                  value={this.state.phoneNumber}
                  onChange={this.handlePhoneNumberChange}
                />
              </div>

              <Button
                className={styles.pricingFormButton}
                bsStyle={'primary'}
                onClick={this.onPricingFormSubmit}
              >
                Request Pricing
              </Button>

            </div>

          </Modal.Body>
        </Modal>



      </div>
    );
  }
}


