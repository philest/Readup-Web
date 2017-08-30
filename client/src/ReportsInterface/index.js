import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import InfoBar from './components/InfoBar'
import NavigationBar from '../StudentDashboard/components/NavigationBar'
import studentDashboardIndexStyles from '../StudentDashboard/styles.css'

import sharedStyles from '../sharedComponents/styles.css'

import FormattedMarkupText from '../sharedComponents/FormattedMarkupText'
import { Button, Modal } from 'react-bootstrap'

import { newSampleEvaluationText } from '../sharedComponents/newSampleMarkup'

import { sendEmail, getScoredText, getAssessmentUpdateTimestamp, updateUserEmail, getTotalWordsInText, getTotalWordsReadCorrectly, getAccuracy, getWCPM } from './emailHelpers'


const ADMIN_EMAIL = "philesterman@gmail.com"







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
      lastUpdated: this.props.whenCreated,
      givenScoredReport: false,
      showReportReadyModal: false,
    }
    this.tick = this.tick.bind(this);


  }






  componentWillMount() {
    document.addEventListener("keydown", this._handleKeyDown);

    if (!this.props.isSample) {
      // Hide the email modal and render graded text
      this.setState({ showEmailModal: false })
      this.setState({ gradedText: JSON.parse(this.props.scoredText) })
    }

    if (!this.props.fullPage) {
      this.setState({ showEmailModal: false })

    }

  }

  componentDidMount() {

    if (this.props.fullPage) {
      this.interval = setInterval(this.tick, 2000);
    }
  }


  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
    clearInterval(this.interval);
  }



  tick() {

    let updated = this.assessmentUpdated(this.props.assessmentID)
    let givenScoredReport = this.state.givenScoredReport

    if (updated && !givenScoredReport) {
      console.log("SHOW modal")
      this.setState({ givenScoredReport: true })
      this.deliverScoredReport()
    } else {
      console.log("don't show modal")
      // this.hideReportReadyModal()
    }

  }


  assessmentUpdated(id) {

    let res = getAssessmentUpdateTimestamp(id)
    res.then(res => {
      this.setState({ lastUpdated: res })
    })

    let whenCreated = this.props.whenCreated
    let lastUpdated = this.state.lastUpdated

    if (whenCreated !== lastUpdated) { // their timestamps are different
      return true
    } else {
      return false
    }
  }


  deliverScoredReport() {

    this.setState({ showReportReadyModal: true })


    let loc =  `/reports/${this.props.userID}`
    console.log(loc)

    setTimeout(function () {
      window.location.href = loc
    }, 500);




       // getScoredText().then(res => {
    //   this.setState({ gradedText: res })
    // })



  }



  hideReportReadyModal() {
    this.setState({ showReportReadyModal: false })
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
    const id = this.props.userID

    const subject = ["Demo submitted: ", email].join(' ')
    const message = ["The user's email is ", email].join(' ')

    sendEmail(subject, message, ADMIN_EMAIL)
    updateUserEmail(email, id)

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


        {this.props.fullPage &&
          <InfoBar
            title={ this.props.isSample ? "Example Report" : "Your Report"}
            extraInfo={this.props.isSample ? "Your actual report will come within one hour" : "Graded by our teaching team"}
          />
        }

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
                <div className={styles.metricDescriptionLabel}>WCPM</div>
              </div>
            }

            { (!this.props.isSample && (getWCPM(this.state.gradedText) < 25)) &&
              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.goodMetric].join(' ')}>{getWCPM(this.state.gradedText)}</div>
                <div className={styles.metricDescriptionLabel}>wcpm</div>
              </div>
            }


            { (!this.props.isSample && (getWCPM(this.state.gradedText) >= 25))  &&
              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.goodMetric].join(' ')}>{getWCPM(this.state.gradedText)}</div>
                <div className={styles.metricDescriptionLabel}>wcpm</div>
              </div>
            }




            { this.props.isSample && // No comp if it's not a sample
              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.fairMetric].join(' ')}>7/9</div>
                <div className={styles.metricDescriptionLabel}>Comp.</div>
              </div>
            }



            { this.props.isSample &&
              <div className={styles.levelInfoWrapper}>
                <div className={[styles.fairLevelResult, styles.levelRectangle].join(' ')}>Hard</div>
                { this.state.levelFound &&
                  <div className={styles.levelLabel}>Just-right level found <i className={"fa fa-check"} aria-hidden={"true"}></i></div>
                }
                { !this.state.levelFound &&
                  <div className={styles.ReassessLevelLabel}><span>Next step:</span> Assess at Level Q</div>
                }
              </div>
            }


            { (!this.props.isSample && (getAccuracy(this.state.gradedText) < 90)) &&
              <div className={styles.levelInfoWrapper}>
                <div className={[styles.poorLevelResult, styles.levelRectangle].join(' ')}>Hard</div>
                { this.state.levelFound &&
                  <div className={styles.levelLabel}>Just-right level found <i className={"fa fa-check"} aria-hidden={"true"}></i></div>
                }
                { !this.state.levelFound &&
                  <div className={styles.ReassessLevelLabel}><span>Next step:</span> {["Assess at Level", String.fromCharCode(this.props.bookLevel.charCodeAt(0) - 1)].join(' ')}</div>
                }
              </div>
 
            }


            { ((!this.props.isSample && (getAccuracy(this.state.gradedText) >= 90)) && (getAccuracy(this.state.gradedText) <= 94)) &&
              <div className={styles.levelInfoWrapper}>
                <div className={[styles.goodLevelResult, styles.levelRectangle].join(' ')}>Instructional</div>
                { this.state.levelFound &&
                  <div className={styles.levelLabel}>Just-right level found <i className={"fa fa-check"} aria-hidden={"true"}></i></div>
                }
                { !this.state.levelFound &&
                  <div className={styles.ReassessLevelLabel}><span>Next step:</span> {["Assess at Level", String.fromCharCode(this.props.bookLevel.charCodeAt(0) + 1)].join(' ')}</div>
                }
              </div>
 
            }



            { (!this.props.isSample && (getAccuracy(this.state.gradedText) >= 95)) &&
              <div className={styles.levelInfoWrapper}>
                <div className={[styles.goodLevelResult, styles.levelRectangle].join(' ')}>Independent</div>
                { this.state.levelFound &&
                  <div className={styles.levelLabel}>Just-right level found <i className={"fa fa-check"} aria-hidden={"true"}></i></div>
                }
                { !this.state.levelFound &&
                  <div className={styles.ReassessLevelLabel}><span>Next step:</span> {["Assess at Level", String.fromCharCode(this.props.bookLevel.charCodeAt(0) + 1)].join(' ')}</div>
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
                <audio controls autoPlay preload="auto" className={styles.audioElement}>
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

        {this.props.isSample &&
   
          <div className={[styles.comp, sharedStyles.textContainerLarge].join(' ')}>

            <div className={styles.compPart}>
              <h2 className={styles.compPartHeader}>Retell</h2>
                <div className={styles.questionBlock}>
                  <h4 className={styles.questionText}>Retell the most important parts of what you just read.<span className={styles.pointValue}> (3 pts)</span></h4>
                  <p className={styles.studentResponse}>"Chris’s mom tells him he can get a new bike and his Dad agrees. Chris is still nervous about getting a new bike because he still wants to search for the old one he likes. Then Chris and his Mom go out to get the new bike."</p> 
                  <p className={styles.compCorrect}><span className={styles.correct}>+3 points:</span> Shows excellent undestanding of the passage, including three critical plot details, as well as sequence and characters.</p> 
                </div>
            </div>

            <div className={styles.compPart}>
              <h2 className={styles.compPartHeader}>Within the Text</h2>
                <div className={styles.questionBlock}>
                  <h4 className={styles.questionText}>1. How is the narrator's mom trying to make him feel better?<span className={styles.pointValue}> (1 pt)</span></h4>
                  <p className={styles.studentResponse}>"Chris's mom is trying to make him feel better by buying him a new bike."</p> 
                  <p className={styles.compCorrect}><span className={styles.missed}>+1 points:</span> Shows strong undertanding of character and plot regarding Chris's mom.</p> 
                </div>
                <div className={styles.questionBlock}>
                  <h4 className={styles.questionText}>2. Will Chris stop looking for his old bike when he gets a new one? How do you know?<span className={styles.pointValue}> (1 pt)</span></h4>
                  <p className={styles.studentResponse}>"Chris will stop looking because he still hasn’t found it."</p> 
                  <p className={styles.compMissed}><span className={styles.missed}>No points:</span> Missed key point that Chris will likely not stop looking for his old bike because he says that nothing will replace his old bike.</p> 
                </div>
            </div>


            <div className={styles.compPart}>
              <h2 className={styles.compPartHeader}>Beyond the Text</h2>
                <div className={styles.questionBlock}>
                  <h4 className={styles.questionText}>3. Chris’s dad says, “We all know about Mr. Podler…Someday I’ll tell you about the ghosts he saw in City Hall.” What do you think he means?<span className={styles.pointValue}> (1 pt)</span></h4>
                  <p className={styles.studentResponse}>"He thinks Mr. Podler once saw a ghost."</p> 
                  <p className={styles.compMissed}><span className={styles.missed}>No points:</span> Missed key point that Chris thinks Mr. Podler believes things that aren’t true.</p> 
                </div>
                <div className={styles.questionBlock}>
                  <h4 className={styles.questionText}>4. How do you think Chris feels about getting a new bike? What makes you think this?<span className={styles.pointValue}> (1 pt)</span></h4>
                  <p className={styles.studentResponse}>"He wants a bike so he is happy about getting a new one. But he is also upset because he really wants his old bike back. The story says that he doesn’t say yes to getting the new bike at first."</p> 
                  <p className={styles.compCorrect}><span className={styles.missed}>+1 point:</span> Reflects excellent understanding of the text. Includes details on Chris’s mixed feelings and evidence from the text.</p> 

                </div>
            </div>

          </div>

        }




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
            <h4 className={styles.modalSubtitle}>Your running record will come within one hour</h4>
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
        <Modal show={this.state.showReportReadyModal} dialogClassName={styles.modalSmall}>
          <Modal.Header>
            <Modal.Title bsClass={[styles.pricingModalTitle, styles.readyModalTitle].join(' ')}>
              Yours is ready! 
            </Modal.Title>
          </Modal.Header>
          <Modal.Body bsClass={styles.readyModalBody}>

            <div className={styles.pricingFormWrapper}>
              <img alt="" className={[styles.paperImage, styles.readyModalPaperImage].join(' ')} src="/images/checkmark-on-paper.jpg" />
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


