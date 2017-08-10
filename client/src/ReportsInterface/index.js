import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import InfoBar from './components/InfoBar'

import FormattedMarkupText from '../sharedComponents/FormattedMarkupText'
import { Button, Modal } from 'react-bootstrap'

import { newSampleEvaluationText } from '../sharedComponents/newSampleMarkup'



export default class ReportsInterface extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired, // this is passed from the Rails view
  };


  constructor(props, _railsContext) {
    super(props);
    this.state = {
      showAudioPlayback: false,
      showPricingModal: false,
      showEmailModal: true,
      showSampleInfoModal: false,
      email: '',
      name: '',
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

  onEmailFormSubmit = () => {
    this.setState({ showEmailModal: false })
    this.setState({ showSampleInfoModal: true })
    const email = this.state.email

    // TODO do something with the data
  }

  onSampleButtonClick = () => {
    this.setState({ showSampleInfoModal: false })
  }

  closePricingModal = () => {
    this.setState({ showPricingModal: false })
  }

  closeSampleInfoModal  = () => {
    this.setState({ showSampleInfoModal: false })
  }

  _handleKeyDown = (event) => {
    if (this.state.showPricingModal && event.code === 'Enter') {
      this.onPricingFormSubmit()
    }
  }


  handleEmailChange = (event) => {
    this.setState({ email: event.target.value })
  }

  handleNameChange = (event) => {
    this.setState({ name: event.target.value })
  }


  handleSchoolNameChange = (event) => {
    this.setState({ schoolName: event.target.value })
  }

  handlePhoneNumberChange = (event) => {
    this.setState({ phoneNumber: event.target.value })
  }

  onPricingFormSubmit = () => {
    const name = this.state.name
    const schoolName = this.state.schoolName
    const phoneNumber = this.state.phoneNumber

    // TODO do something with the data

  }


  render() {

    return (
      <div className={styles.reportsContainer}>



        <InfoBar
          title={"Example Report"}
          extraInfo={"Your actual report will come tonight"}
        />

        <div className={styles.contentWrapper}>

          <div className={styles.evaluationInfoHeader}>

            <div className={styles.mainHeadingContainer}>
              <div className={styles.studentNameHeading}>Sofia Vergara</div>
              <div className={styles.bookInfoSubheading}>
                <p>{this.props.bookTitle}<span> - {this.props.bookLevel}</span></p>
              </div>
            </div>

            <div className={styles.metricsHeadingContainer}>
              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.poorMetric].join(' ')}>89%</div>
                <div className={styles.metricDescriptionLabel}>Accuracy</div>
              </div>

              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.goodMetric].join(' ')}>161</div>
                <div className={styles.metricDescriptionLabel}>wcpm</div>
              </div>

              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.fairMetric].join(' ')}>4/5</div>
                <div className={styles.metricDescriptionLabel}>Comp.</div>
              </div>



              <div className={styles.levelInfoWrapper}>
                <div className={[styles.fairLevelResult, styles.levelRectangle].join(' ')}>Level O</div>
                <div className={styles.levelLabel}>Just-right level found <i className={"fa fa-check"} aria-hidden={"true"}></i></div>
              </div>

            </div>
          </div>

          <div className={styles.bookInfoHeader}>

            <div className={styles.bookInfoWrapper}>
              <div className={styles.bookInfoTitle}>{this.props.bookTitle}</div>
              <div className={styles.bookInfoLevel}>{this.props.bookLevel}</div>
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
            paragraphs={newSampleEvaluationText.paragraphs}
            isInteractive={false}
            endParagraphIndex={newSampleEvaluationText.readingEndIndex.paragraphIndex}
            endWordIndex={newSampleEvaluationText.readingEndIndex.wordIndex}
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
        <Modal show={this.state.showEmailModal} dialogClassName={styles.modalMedium}>
          <Modal.Header>
            <img alt="" className={styles.paperImage} src="https://s3-us-west-2.amazonaws.com/readup-now/website/demo/paper-pen.png" />
            <img alt="" className={styles.paperImageOverlay} src="https://s3-us-west-2.amazonaws.com/readup-now/website/demo/rolling-small.gif" />
            <Modal.Title bsClass={styles.pricingModalTitle}>
              Get your scored running record
            </Modal.Title>
            <h4 className={styles.modalSubtitle}>It will come by email tonight</h4>
          </Modal.Header>
          <Modal.Body>

            <div className={styles.pricingFormWrapper}>

              <div className={styles.pricingFormField}>
                <div className={styles.pricingFormFieldLabel}>
                  Email
                </div>
                <input
                  className={styles.pricingFormFieldInput}
                  placeholder={"Email"}
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                />
              </div>


              <Button
                className={styles.pricingFormButton}
                bsStyle={'primary'}
                onClick={this.onEmailFormSubmit}
              >
                Get it
              </Button>

            </div>

          </Modal.Body>
        </Modal>


        <style type="text/css">{'.modal-backdrop.in { opacity: 0.7; } '}</style>
        <Modal show={this.state.showSampleInfoModal}  onHide={this.closeSampleInfoModal} dialogClassName={styles.modalMedium}>
          <Modal.Header closeButton>
            <Modal.Title bsClass={styles.pricingModalTitle}>
              Great, here's an example of one first
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div className={styles.pricingFormWrapper}>

              <Button
                className={styles.pricingFormButton}
                bsStyle={'primary'}
                onClick={this.onSampleButtonClick}
              >
                See sample
              </Button>

            </div>

          </Modal.Body>
        </Modal>


        <style type="text/css">{'.modal-backdrop.in { opacity: 0.9; } '}</style>
        <Modal show={this.state.showPricingModal} onHide={this.closePricingModal} dialogClassName={styles.modalMedium}>
          <Modal.Header closeButton>
            <Modal.Title bsClass={styles.pricingModalTitle}>
              Get ReadUp at your School
            </Modal.Title>
            <h4 className={[styles.modalSubtitle, styles.modalSubtitleLong].join(' ')}>Save thousands of hours of intstructional time so you can focus on student learning</h4>

          </Modal.Header>
          <Modal.Body>

            <div className={styles.pricingFormWrapper}>

              <div className={styles.pricingFormField}>
                <div className={styles.pricingFormFieldLabel}>
                  Name
                </div>
                <input
                  className={styles.pricingFormFieldInput}
                  placeholder={"Name"}
                  value={this.state.name}
                  onChange={this.handleNameChange}
                />
              </div>




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


