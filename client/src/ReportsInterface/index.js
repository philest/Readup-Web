import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import InfoBar from './components/InfoBar'
import NavigationBar from '../StudentDashboard/components/NavigationBar'
import studentDashboardIndexStyles from '../StudentDashboard/styles.css'

import FormattedMarkupText from '../sharedComponents/FormattedMarkupText'
import { Button, Modal } from 'react-bootstrap'

import { newSampleEvaluationText } from '../sharedComponents/newSampleMarkup'

import { sendEmail, getScoredText, getTotalWordsInText, getTotalWordsReadCorrectly, getAccuracy, getWCPM } from './emailHelpers'


const ADMIN_EMAIL = "philesterman@gmail.com"

//   var classNames = require('classnames');

//   let groupClasses = classNames(
//   'metricFigureLabel',
//       'goodMetric',
// );





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
      levelFound: false,
      email: '',
      name: '',
      schoolName: '',
      phoneNumber: '',
      gradedText: newSampleEvaluationText,
    }

  }



  componentWillMount() {
    document.addEventListener("keydown", this._handleKeyDown);

    if (!this.props.isSample) {
      // Hide the email modal and render graded text
      this.setState({ showEmailModal: false })
      getScoredText().then(res => {
        this.setState({ gradedText: res })
      })
    }


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

    console.log(getTotalWordsReadCorrectly(this.state.gradedText))
  }

  onEmailFormSubmit = () => {

    this.setState({ showEmailModal: false })
    this.setState({ showSampleInfoModal: true })
    const email = this.state.email

    const subject = ["Demo submitted: ", email].join(' ')


    const message = ["The user's email is ", email].join(' ')

    sendEmail(subject, message, ADMIN_EMAIL)

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
    if (this.state.showEmailModal && event.code === 'Enter') {
      this.onEmailFormSubmit()
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
    const email = this.state.email


    const subject = ["Pricing request: ", schoolName].join(' ')

    this.setState({ showPricingModal: false })

    const message = ["Pricing just requested.\n\nEmail: ", email, "\nName: ", name, "\nSchool: ", schoolName, "\nPhone: ", phoneNumber].join(' ')

    sendEmail(subject, message, ADMIN_EMAIL)

    // TODO do something with the data
  }







  render() {

    return (



      <div className={styles.reportsContainer}>


        <InfoBar
          title={ this.props.isSample ? "Example Report" : "Your Report"}
          extraInfo={"Graded by our teaching team"}
        />

        <div className={styles.contentWrapper}>

          <div className={styles.evaluationInfoHeader}>

            <div className={styles.mainHeadingContainer}>
              <div className={styles.studentNameHeading}>{this.props.name}</div>
              <div className={styles.bookInfoSubheading}>
                <p>{this.props.bookTitle}<span> - Level {this.props.bookLevel}</span></p>
              </div>
            </div>

            <div className={styles.metricsHeadingContainer}>


            { getAccuracy(this.state.gradedText) >= 90 &&
              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.goodMetric].join(' ')}>{ getAccuracy(this.state.gradedText) }%</div>
                <div className={styles.metricDescriptionLabel}>Accuracy</div>
              </div>
            }

            { getAccuracy(this.state.gradedText) < 90 &&
              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.poorMetric].join(' ')}>{ getAccuracy(this.state.gradedText) }%</div>
                <div className={styles.metricDescriptionLabel}>Accuracy</div>
              </div>
            }


            { this.props.isSample &&
              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.goodMetric].join(' ')}>161</div>
                <div className={styles.metricDescriptionLabel}>wcpm</div>
              </div>
            }

            { !this.props.isSample &&
              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.goodMetric].join(' ')}>118</div>
                <div className={styles.metricDescriptionLabel}>wcpm</div>
              </div>
            }

            { this.props.isSample &&
              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.fairMetric].join(' ')}>3/5</div>
                <div className={styles.metricDescriptionLabel}>Comp.</div>
              </div>
            }


            { !this.props.isSample &&
              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.fairMetric].join(' ')}>N/A</div>
                <div className={styles.metricDescriptionLabel}>Comp.</div>
              </div>
            }

            { this.props.isSample &&
              <div className={styles.levelInfoWrapper}>
                <div className={[styles.fairLevelResult, styles.levelRectangle].join(' ')}>Level S</div>
                { this.state.levelFound &&
                  <div className={styles.levelLabel}>Just-right level found <i className={"fa fa-check"} aria-hidden={"true"}></i></div>
                }
                { !this.state.levelFound &&
                  <div className={styles.ReassessLevelLabel}><span>Next step:</span> Assess at Level S</div>
                }
              </div>
            }


            { (!this.props.isSample && (getAccuracy(this.state.gradedText) < 90)) &&
              <div className={styles.levelInfoWrapper}>
                <div className={[styles.fairLevelResult, styles.levelRectangle].join(' ')}>Level G</div>
                { this.state.levelFound &&
                  <div className={styles.levelLabel}>Just-right level found <i className={"fa fa-check"} aria-hidden={"true"}></i></div>
                }
                { !this.state.levelFound &&
                  <div className={styles.ReassessLevelLabel}><span>Next step:</span> Assess at Level G</div>
                }

              </div>
 
            }

            { (!this.props.isSample && (getAccuracy(this.state.gradedText) >= 90)) &&
              <div className={styles.levelInfoWrapper}>
                <div className={[styles.goodLevelResult, styles.levelRectangle].join(' ')}>Level I</div>
                { this.state.levelFound &&
                  <div className={styles.levelLabel}>Just-right level found <i className={"fa fa-check"} aria-hidden={"true"}></i></div>
                }
                { !this.state.levelFound &&
                  <div className={styles.ReassessLevelLabel}><span>Next step:</span> Assess at Level I</div>
                }
              </div>
 
            }

            </div>
          </div>

          <div className={styles.bookInfoHeader}>

            <div className={styles.bookInfoWrapper}>
              <div className={styles.bookInfoTitle}>{this.props.bookTitle}</div>
              <div className={styles.bookInfoLevel}>Level {this.props.bookLevel}</div>
            </div>

            <div className={styles.audioWrapper}>

              { !this.state.showAudioPlayback &&
                <Button
                  className={styles.submitButton}
                  bsStyle={'primary'}
                  bsSize={'large'}
                  onClick={this.onPlayRecordingClicked}
                >
                  Play Recording &nbsp;&nbsp;<i className={["fa", "fa-play", styles.pulse].join(" ")} aria-hidden={"true"} />
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
            paragraphs={this.state.gradedText.paragraphs}
            isInteractive={false}
            endParagraphIndex={this.state.gradedText.readingEndIndex.paragraphIndex}
            endWordIndex={this.state.gradedText.readingEndIndex.wordIndex}
            bookLevel={this.props.bookLevel}
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
              Get your scored demo report
            </Modal.Title>
            <h4 className={styles.modalSubtitle}>Your running record will come by email tonight</h4>
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
        <Modal show={this.state.showPricingModal} restoreFocus={false} onHide={this.closePricingModal} dialogClassName={styles.modalMedium}>
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


