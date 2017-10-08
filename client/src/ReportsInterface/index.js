import PropTypes from 'prop-types';
import React from 'react';

import { Button, Modal, FormGroup, FormControl, ControlLabel, OverlayTrigger  } from 'react-bootstrap'


import styles from './styles.css'

import InfoBar from './components/InfoBar'
import LevelResult from './components/LevelResult'
import Metric from './components/Metric'


import studentDashboardIndexStyles from '../StudentDashboard/styles.css'

import sharedStyles from '../sharedComponents/styles.css'

import FormattedMarkupText from '../sharedComponents/FormattedMarkupText'

import { sampleWithMSV } from '../sharedComponents/sampleWithMSV'

import { updateAssessment, sendEmail, didEndEarly, getScoredText, getAssessmentUpdateTimestamp, updateUserEmail, getTotalWordsInText, getTotalWordsReadCorrectly, getAccuracy, getWCPM } from './emailHelpers'
import { stopAudio, playSoundAsync } from '../StudentDashboard/audioPlayer'

import { fpBook, fireflyBook, stepBook, library } from '../StudentDashboard/state.js'

import {wasMSVgraded} from '../sharedComponents/FormattedMarkupText'

const ADMIN_EMAIL = "philesterman@gmail.com"

let book
let numQuestions




const initShowCompAudioPlayback = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
}


export function getFullTitle(question) {

 let title = question.title
 let subtitle = question.subtitle

 if (subtitle) {
  return `${title} ${subtitle}` 
 } 
 else {
  return title 
 }

}




export default class ReportsInterface extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired, // this is passed from the Rails view
  };



  constructor(props, _railsContext) {
    super(props);
    this.state = {
      showAudioPlayback: false,
      showCompAudioPlayback: initShowCompAudioPlayback,
      showPricingModal: false,
      showBookModal: false,
      showEmailModal: true,
      showPlaybook: false,
      playbackFidgets: false,
      showSampleInfoModal: false,
      levelFound: false,
      email: '',
      name: '',
      schoolName: '',
      phoneNumber: '',
      gradedText: sampleWithMSV,
      lastUpdated: this.props.whenCreated,
      givenScoredReport: false,
      showReportReadyModal: false,
      footerButtonText: '',
      footerLabelText: '',
      footerLink: '',
      noNoteStarted: (this.props.teacherNote === null),
      draftingNote: false,
      noteExists: (this.props.teacherNote !== null),
      teacherNote: this.props.teacherNote,
    }
    this.tick = this.tick.bind(this);


  }






  componentWillMount() {

    stopAudio()

    document.addEventListener("keydown", this._handleKeyDown);

    if (!this.props.isSample) {
      // Hide the email modal and render graded text
      this.setState({ showEmailModal: false })
      console.log("graded text is this:")
      console.log(this.state.gradedText)
      this.setState({ gradedText: JSON.parse(this.props.scoredText) })
    }

    if (!this.props.fullPage) {
      this.setState({ showEmailModal: false })

    }


    if (this.props.bookKey && this.props.userID > 150) {
      book = library[this.props.bookKey]
    }
    else {
      book = fireflyBook
    }


    numQuestions = book.numQuestions



    // Set the footer label and button 
    let footerButtonText
    let footerLabelText
    let footerLink

    // if (!this.props.isSample || this.props.isDirectSample) {

    if (this.props.isDirectSample) {
      footerLabelText = "Try out a student demo of ReadUp"
      footerButtonText = "See demo"
      footerLink = "/step"
    }
    else {

      footerLabelText = "See our progress monitoring texts"
      footerButtonText = "See F&P leveled texts"
      footerLink = "/library"

    }


    // } else {
    //   footerLabelText = "Save thousands of instructional hours"
    //   footerButtonText = "Get Pricing"
    //   footerLink = ''
    // }


    this.setState({ footerButtonText: footerButtonText })
    this.setState({ footerLabelText: footerLabelText })
    this.setState({ footerLink: footerLink })


    this.timeoutId = setTimeout(function () {
        this.setState({ playbackFidgets: true });
    }.bind(this), 9000);




  }

  componentDidMount() {

    if (this.props.fullPage) {
      this.interval = setInterval(this.tick, 2000);
    }

  }


  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
    clearInterval(this.interval);
    
    if (this.timeoutId) {
        clearTimeout(this.timeoutId);
    }


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

    playSoundAsync('/audio/complete.mp3')


    setTimeout(function () {
      window.location.href = loc
    }, 800);




       // getScoredText().then(res => {
    //   this.setState({ gradedText: res })
    // })



  }


  getDifficulty(acc, comp, compDenom) {

    const accOnlyScores = ['Frustrational', 'Instructional', 'Independent']

    // Scores with comp 
    const fullScores = [
      ['Frustrational', 'Frustrational', 'Frustrational', 'Frustrational'],
      ['Frustrational', 'Frustrational', 'Instructional', 'Instructional'],
      ['Frustrational', 'Instructional', 'Independent', 'Independent'],
    ]
    // Indexed [acc] by [comp] so, [0][1] is an accIndex of 0 and compScore (index) of 1
    // based on Fountas and Pinnell: https://www.dropbox.com/s/gid9673g38cne07/Screenshot%202017-09-19%2011.13.32.png?dl=0


    // first, convert accuracy to an index
    let accIndex

    if (acc >= 95) {
      accIndex = 2
    } else if (acc >= 90) {
      accIndex = 1
    } else {
      accIndex = 0
    }

    let compIndex 

    if (compDenom === 3 && comp) {
      compIndex = comp 
    } 
    else if (compDenom === 6 && comp) {

      if (comp >= 5) {
        compIndex = 3 
      }
      else if (comp >= 4) {
        compIndex = 2
      }
      else if (comp >= 3) {
        compIndex = 1 
      }
      else {
        compIndex = 0
      }
    }






    // Decide whether to use just acc, or the comp as well

    if (comp == null) {
      return accOnlyScores[accIndex]
    } else {
      return fullScores[accIndex][compIndex]
    }

  }


  getCompTotal() {


    if (this.props.isSample) {
      return 5
    }
    else if (this.props.compScores["0"] === null) {
      return null
    }
    else if (this.props.compScores["1"] === null) { //backwards compat
      return Number(this.props.compScores["0"])
    }


    let total = 0 

    for(let i = 0; i < numQuestions; i++) {

      if (this.isQuestionGraded(i + 1)) {
      total += Number(this.props.compScores[String(i)])
      }
    } 


    return total
  }

  getCompDenom() {

    if (this.props.isSample) {
      return 9
    }


    let total = 0 

    for(let i = 0; i < numQuestions; i++) {
      total += book.questions[String(i + 1)].points
    } 
    
    return total

  }


  hideReportReadyModal() {
    this.setState({ showReportReadyModal: false })
  }


  onLogoutClicked = () => {

  }

  onPlayRecordingClicked = () => {
    this.setState({ showAudioPlayback: true })
  }

  onCompPlayRecordingClicked = (qNum) => {

    let showCompAudioNew = this.state.showCompAudioPlayback
    showCompAudioNew[String(qNum)] = true 

    this.setState({ showCompAudioPlayback: showCompAudioNew })
  }


  onPricingClicked = () => {
    this.setState({ showPricingModal: true })
  }

  onFooterClicked = () => {

    if (this.props.isDirectSample) {
      window.location.href = '/step'
    }
    else {
      this.setState({ showBookModal: true })
    }
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

  closeBookModal  = () => {
    this.setState({ showBookModal: false })
  }

  onAddNoteClicked = () => {
    this.setState({ noNoteStarted: false,
                    draftingNote: true
                  })
  }

  onSaveNoteClicked = () => {

    updateAssessment( { teacher_note: this.noteInput.value },
                       this.props.assessmentID,
                    )


    if (this.noteInput.value) {

    this.setState({ noteExists: true, 
                    draftingNote: false,
                    teacherNote: this.noteInput.value,
                  })
    }

    else {
      this.setState({ noNoteStarted: true,
                      draftingNote: false,
                   })

    }


  }

  onEditClicked  = () => {

    updateAssessment( { teacher_note: this.noteInput },
                       this.props.assessmentID,
                    )


    this.setState({ noteExists: false, 
                    draftingNote: true
                  })
  }

  onPlaybookClicked = () => {
    this.setState({ showPlaybook: true })
  }

  onPlaybookClose = () => {
    this.setState({ showPlaybook: false })
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



  renderCompAudio = (questionNum) => {

    let compURL 

    if (this.props.userID < 156) {
      compURL = `https://s3-us-west-2.amazonaws.com/readup-now/fake-assessments/${this.props.env}/${this.props.userID}/comp/recording.webm`
    } else {
      compURL = `https://s3-us-west-2.amazonaws.com/readup-now/fake-assessments/${this.props.env}/${this.props.userID}/comp/question${questionNum}.webm`
    }


    return (
    <audio controls autoPlay preload="auto" className={[styles.compAudioElement, (!this.existTranscription(questionNum - 1) ? styles.noTranscriptionMiniPlayButton : '')].join(' ')}>
      <source src={compURL} />
      <p>Playback not supported</p>
    </audio>
    )

  }

  renderFullQuestion = (questionNum, isGraded) => {

    let pointsLabel
    let qLabel = (questionNum + 1) + '. '

    let pts = book.questions[String(questionNum + 1)].points
    let standard = book.questions[String(questionNum + 1)].standard


    if (standard) {
      pointsLabel = `(${standard})`
    } else {
      pointsLabel = ""
    }


    return (
      <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
        <h4 className={[styles.questionText, (this.isQuestionGraded(questionNum + 1) ? '' : styles.fadedComp)].join(' ')}>{qLabel + getFullTitle(book.questions[String(questionNum + 1)])}<span className={styles.pointValue}> {pointsLabel}</span></h4>
       
        { this.isQuestionGraded(questionNum + 1) &&
          this.renderGradedPartOfQuestion(questionNum)
        }
        
      </div>
    )


  }



  renderGradedPartOfQuestion = (questionNum) => {
    let scoreLabel
    let colorClass

    let pts = book.questions[String(questionNum + 1)].points


    if (pts === 3) {
      scoreLabel = this.props.compScores[String(questionNum)] + ' of 3' + ' points'
      colorClass = this.getColorClass(this.props.compScores[String(questionNum)], true)

    }
    else {
      scoreLabel = this.props.compScores[String(questionNum)] + ' of 1' + ' points'
      colorClass = this.getColorClass(this.props.compScores[String(questionNum)], false)
    } 

    return (
            <div className={'faa-parent animated-hover faa-slow'}>
            
            { this.existTranscription(questionNum) &&
              <p className={styles.studentResponse}>"{ this.props.studentResponses[String(questionNum)] }"</p> 
            }

            { !this.state.showCompAudioPlayback[questionNum + 1] &&
            <Button onClick={() => this.onCompPlayRecordingClicked(questionNum + 1)} className={['fa faa-horizontal faa-slow', styles.miniPlayButton, (!this.existTranscription(questionNum) ? styles.noTranscriptionMiniPlayButton : '')].join(' ')} bsStyle="primary">Play <i className={["fa", "fa-play", 'animated', 'faa-pulse', styles.miniPlayIcon].join(" ")} /> </Button> 
            }
            { this.state.showCompAudioPlayback[questionNum + 1] &&
              this.renderCompAudio(questionNum + 1)
            }

            <p className={colorClass}><span className={styles.correct}>{scoreLabel}:</span> {this.props.graderComments[String(questionNum)]}</p>
            </div>
          )
  }


  existTranscription(questionNum) {
    return this.props.studentResponses[String(questionNum)]
  }


  // It's graded if there's a score and comment
  isQuestionGraded(qNum) {
    return (this.props.graderComments[String(qNum - 1)] && (this.props.compScores[String(qNum - 1)] != null))
  }

  areAllQuestionsGraded() {
    for (let i = 1; i < book.numQuestions; i++) {
      if(!isQuestionGraded(i - 1)){
        return false 
      }
    } 
    return true 
  }





  getColorClass(score, isRetell) {
    let colorClass

    if (isRetell) {

        if (score >= 2) {
          colorClass = styles.compCorrect

        } else if (score >= 1) {
          colorClass = styles.compFair
        } else {
          colorClass = styles.compMissed
        }
    }
    else {

      if (score === 1) {
        colorClass = styles.compCorrect
      }
      else {
        colorClass = styles.compMissed
      }

    }

    return colorClass

  }



 getCompSectionTotal(sectionNum) {

    let total = 0 

    for (let i = 0; i < book.numQuestions; i++) {

      if (this.isQuestionGraded(i + 1) && book.questions[String(i + 1)].section === sectionNum) {
        total += Number(this.props.compScores[String(i)])
      }
    }

    return total

  }

  getCompSectionDenom(sectionNum) {

    let total = 0

    for (let i = 0; i < book.numQuestions; i++) {

      if (book.questions[String(i + 1)].section === sectionNum) {
        total += book.questions[String(i + 1)].points
      }
    }

    return total

  }


  getNumErrors() {
    let totalErrors = 0
    let paragraphs = this.state.gradedText.paragraphs

    for (let i = 0; i < paragraphs.length; i++) {
      let words = paragraphs[i].words
      for (let k = 0; k < words.length; k ++) {
        if (words[k].wordDeleted || words[k].substituteWord || words[k].addAfterWord) {
          totalErrors += 1
        }
      }
    }

    return totalErrors
  }



  getTotalMiscueType(type) {
    let totalErrors = 0
    let paragraphs = this.state.gradedText.paragraphs

    for (let i = 0; i < paragraphs.length; i++) {
      let words = paragraphs[i].words
      for (let k = 0; k < words.length; k ++) {

        if (type.toLowerCase() === 'm' && words[k].mTypeError) {
          totalErrors += 1
        }

        if (type.toLowerCase() === 's' && words[k].sTypeError) {
          totalErrors += 1
        }


        if (type.toLowerCase() === 'v' && words[k].vTypeError) {
          totalErrors += 1
        }

      }
    }

    return totalErrors
  }

  getSubtotals() {
    let numSections = book.numSections
    let arr = []

      console.log(`here i am in subtoal`)

    for (let i = 1; i <= numSections; i++){
      console.log(`here i am..${i}`)
      const label = book.sections[String(i)]
      const str = String(this.getCompSectionTotal(i)) + '/' + String(this.getCompSectionDenom(i))
      const num = this.getCompSectionTotal(i) / this.getCompSectionDenom(i)
      arr.push([label, str, num])
    }

    return arr

  }



  render() {


    let subtotals = this.getSubtotals() 

    let msvArr = [] 

    let msv = ['Meaning', 'Structure', 'Visual']

    for (let i = 0; i < 3; i++) {
      let label = msv[i]
      let str = String(Math.round((this.getTotalMiscueType(msv[i][0])  / this.getNumErrors()) * 100))
      let num = this.getTotalMiscueType(msv[i][0]) / this.getNumErrors()

      msvArr.push([label, str, num])
    }


    const acc = getAccuracy(this.state.gradedText)
    const WCPM = getWCPM(this.state.gradedText)
    const comp = 7

    let itDidEndEarly = didEndEarly(this.state.gradedText)


    console.log('total M errors: ', this.getTotalMiscueType('M'))

    console.log('total errors: ', this.getNumErrors())


    // let firstQuestionGraded = (this.props.studentResponses["0"] && this.props.graderComments["0"] && (this.props.compScores["0"] != null))
    // let secondQuestionGraded = (this.props.studentResponses["1"] && this.props.graderComments["1"] && (this.props.compScores["1"] != null))
    // let thirdQuestionGraded = (this.props.studentResponses["2"] && this.props.graderComments["2"] && (this.props.compScores["2"] != null))
    // let fourthQuestionGraded = (this.props.studentResponses["3"] && this.props.graderComments["3"] && (this.props.compScores["3"] != null))

    // let firstQuestionGraded = (this.props.graderComments["0"] && (this.props.compScores["0"] != null))
    // let secondQuestionGraded = (this.props.graderComments["1"] && (this.props.compScores["1"] != null))
    // let thirdQuestionGraded = (this.props.graderComments["2"] && (this.props.compScores["2"] != null))
    // let fourthQuestionGraded = (this.props.graderComments["3"] && (this.props.compScores["3"] != null))
    // let fifthQuestionGraded = (this.props.graderComments["4"] && (this.props.compScores["4"] != null))
    // let sixthQuestionGraded = (this.props.graderComments["5"] && (this.props.compScores["5"] != null))



    // let allQuestionsGraded = (firstQuestionGraded && secondQuestionGraded && thirdQuestionGraded && fourthQuestionGraded)


    const difficulty = this.getDifficulty(acc, this.getCompTotal(), this.getCompDenom())


 

    let bookLevel

    if (this.props.assessmentBrand === 'FP') {
      bookLevel = this.props.bookLevel
    } else {
      bookLevel = this.props.stepLevel
    }





    return (

      <div className={styles.reportsContainer}>



        <div className={styles.contentWrapper} style={{ paddingTop: this.props.fullPage ? 130 + "px" : 110 + "px", paddingLeft: this.props.fullPage ? 110 + "px" : 60 + "px"  } }>

          <div className={styles.evaluationInfoHeader}>

            <div className={styles.mainHeadingContainer}>
              <div className={styles.studentNameHeading}>{this.props.name}
              </div>


              { this.props.isSample &&
                <LevelResult
                  difficulty="Frustrational"
                  currentLevel={bookLevel}
                  reassess={this.props.isUnscorable}
                  didEndEarly={false}
                  yellowColorOverride={true}
                  assessmentBrand={this.props.assessmentBrand}
                />
              }




              { !this.props.isSample &&
                <LevelResult
                  difficulty={difficulty}
                  currentLevel={bookLevel}
                  reassess={this.props.isUnscorable}
                  didEndEarly={itDidEndEarly}
                  assessmentBrand={this.props.assessmentBrand}
                />
              }


              { this.props.userID > 155 &&
                <span onClick={this.onPlaybookClicked} className={styles.playbookTrigger}>See playbook
                  <img className={styles.icon} src="/images/playbook-blue.svg" alt="Playbook icon blue" />
                </span>
              } 


            </div>



          { this.props.isUnscorable &&

            <div className={styles.metricsHeadingContainer}>

              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.fairMetric].join(' ')}>{"—"}</div>
                <div className={styles.metricDescriptionLabel}>Accuracy</div>
              </div>

              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.fairMetric].join(' ')}>{"—"}</div>
                <div className={styles.metricDescriptionLabel}>Words/Min</div>
              </div>

              <div className={styles.metricWrapper}>
                <div className={[styles.metricFigureLabel, styles.fairMetric].join(' ')}>{"—"}</div>
                <div className={styles.metricDescriptionLabel}>Comp.</div>
              </div>

            </div>

          }


          { !this.props.isUnscorable &&

            <div className={styles.metricsHeadingContainer}>


              <Metric
                label="Accuracy"
                number={acc}
                showDetails={this.props.userID > 155 && wasMSVgraded(this.state.gradedText.paragraphs)}
                isSample={this.props.isSample}
                msvSubtotals={msvArr}
                showPlaybook={this.state.showPlaybook}
                onPlaybookClose={this.onPlaybookClose}
              />

              { (this.props.fluencyScore != null) &&
                <Metric
                  label="Fluency"
                  number={this.props.fluencyScore}
                  denominator={3}
                  showDetails={this.props.userID > 155}
                  isSample={this.props.isSample}
                />
              }


              { !this.props.isSample &&
                <Metric
                  label="Words/Min"
                  number={WCPM}
                  showDetails={this.props.isSample}
                  isSample={this.props.isSample}
                />
              }

              { this.props.isSample &&
                <Metric
                  label="Words/Min"
                  number={161}
                  showDetails={this.props.isSample}
                  isSample={this.props.isSample}
                />
              }


            { this.props.isSample && // No comp if it's not a sample
                <Metric
                  label="Comp."
                  number={5}
                  denominator={9}
                  showDetails={this.props.isSample}
                  compSubtotals={subtotals}
                  isSample={this.props.isSample}

                />
            }

            { (!this.props.isSample && (this.props.compScores["0"] != null)) &&
              <Metric
                label="Comp."
                number={this.getCompTotal()}
                denominator={this.getCompDenom()}
                showDetails={this.props.userID > 155}
                compSubtotals={subtotals}
                isSample={this.props.isSample}
              />
            }

            </div>
          }

          </div>


          <h5 className={styles.sectionHeader}>1. ORAL READING</h5>

          <div className={styles.bookInfoHeader}>

            <div className={styles.bookInfoWrapper}>
              <div className={styles.bookInfoTitle}>{this.props.bookTitle}</div>
              <div className={styles.bookInfoLevel}>Level {this.props.bookLevel}</div>
            </div>

            <div className={styles.audioWrapper}>

              { !this.state.showAudioPlayback && !this.state.playbackFidgets && 
                <Button
                  className={styles.submitButton}
                  bsStyle={'primary'}
                  bsSize={'large'}
                  onClick={this.onPlayRecordingClicked}
                >
                  Play Recording &nbsp;&nbsp;<i className={["fa", "fa-play", 'animated', 'faa-pulse'].join(" ")} aria-hidden={"true"} />
                </Button>
              }

              { !this.state.showAudioPlayback && this.state.playbackFidgets && 
                <Button
                  className={[styles.wiggler, styles.submitButton].join(' ')}
                  bsStyle={'primary'}
                  bsSize={'large'}
                  onClick={this.onPlayRecordingClicked}
                >
                  Play Recording &nbsp;&nbsp;<i className={["fa", "fa-play", 'animated', 'faa-pulse'].join(" ")} aria-hidden={"true"} />
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
            isSample={this.props.isSample}
            showSeeMore={this.state.gradedText.readingEndIndex.paragraphIndex < (this.state.gradedText.paragraphs.length - 1)}
            showMSV={this.props.userID > 156} // backwards compatibility 
            bookKey={this.props.bookKey}
          />


        {this.props.isSample && this.props.assessmentBrand === 'FP' &&
   
          <div className={[styles.comp, sharedStyles.compContainerLarge].join(' ')}>
            
            <hr className={styles.compDivider}/>


           <h5 className={styles.sectionHeader}>2. COMPREHENSION</h5>

            <div className={styles.compPart}>
              <h2 className={[styles.compPartHeader, styles.retellHeader].join(' ')}>Retell</h2>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>Tell as much as you can about the passage you just read. Be sure to include the beginning, middle and end.<span className={styles.pointValue}> (3 points)</span></h4>
                  <p className={styles.studentResponse}>Chris’s mom tells him he can get a new bike and his Dad agrees. Chris is still nervous about getting a new bike because he still wants to search for the old one he likes. Then Chris and his Mom go out to get the new bike.</p> 
 
                    { !this.state.showCompAudioPlayback[1] &&
                      <Button onClick={() => this.onCompPlayRecordingClicked(1)} className={['fa faa-horizontal faa-slow', styles.miniPlayButton].join(' ')} bsStyle="primary">Play <i className={["fa", "fa-play", 'animated', 'faa-pulse', styles.miniPlayIcon].join(" ")} /> </Button> 
                    }

                    { this.state.showCompAudioPlayback[1] &&
                      <audio controls autoPlay preload="auto" className={[styles.compAudioElement].join(' ')}>
                        <source src={'/audio/sample/recording.mp3'} />
                        <p>Playback not supported</p>
                      </audio>
                    }
                  <p className={styles.compCorrect}><span className={styles.correct}>3 of 3 points:</span> Shows excellent undestanding of the passage, including three critical plot details, as well as sequence and characters.</p> 
                </div>
            </div>

            <div className={styles.compPart}>
              <h2 className={styles.compPartHeader}>Within the Text</h2>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>1. How is the narrator's mom trying to make him feel better?<span className={styles.pointValue}> (1 point)</span></h4>
                  <p className={styles.studentResponse}>Chris's mom is trying to make him feel better by buying him a new bike.</p> 

                    { !this.state.showCompAudioPlayback[2] &&
                      <Button onClick={() => this.onCompPlayRecordingClicked(2)} className={['fa faa-horizontal faa-slow', styles.miniPlayButton].join(' ')} bsStyle="primary">Play <i className={["fa", "fa-play", 'animated', 'faa-pulse', styles.miniPlayIcon].join(" ")} /> </Button> 
                    }

                    { this.state.showCompAudioPlayback[2] &&
                      <audio controls autoPlay preload="auto" className={[styles.compAudioElement].join(' ')}>
                        <source src={'/audio/sample/1.mp3'} />
                        <p>Playback not supported</p>
                      </audio>
                    }

                  <p className={styles.compCorrect}><span className={styles.missed}>1 of 1 point:</span> Shows strong undertanding of character and plot regarding Chris's mom.</p> 
                </div>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>2. Will Chris stop looking for his old bike when he gets a new one? How do you know?<span className={styles.pointValue}> (1 point)</span></h4>
                  <p className={styles.studentResponse}>Chris will stop looking because he still hasn’t found it.</p> 

                    { !this.state.showCompAudioPlayback[3] &&
                      <Button onClick={() => this.onCompPlayRecordingClicked(3)} className={['fa faa-horizontal faa-slow', styles.miniPlayButton].join(' ')} bsStyle="primary">Play <i className={["fa", "fa-play", 'animated', 'faa-pulse', styles.miniPlayIcon].join(" ")} /> </Button> 
                    }

                    { this.state.showCompAudioPlayback[3] &&
                      <audio controls autoPlay preload="auto" className={[styles.compAudioElement].join(' ')}>
                        <source src={'/audio/sample/2.mp3'} />
                        <p>Playback not supported</p>
                      </audio>
                    }

                  <p className={styles.compMissed}><span className={styles.missed}>0 of 1 point:</span> Missed key point that Chris will likely not stop looking for his old bike because he says that nothing will replace his old bike.</p> 
                </div>
            </div>


            <div className={styles.compPart}>
              <h2 className={styles.compPartHeader}>Beyond and About the Text</h2>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>3. Chris’s dad says, “We all know about Mr. Podler…Someday I’ll tell you about the ghosts he saw in City Hall.” What do you think he means?<span className={styles.pointValue}> (1 point)</span></h4>
                  <p className={styles.studentResponse}>He thinks Mr. Podler once saw a ghost.</p> 

                   { !this.state.showCompAudioPlayback[4] &&
                      <Button onClick={() => this.onCompPlayRecordingClicked(4)} className={['fa faa-horizontal faa-slow', styles.miniPlayButton].join(' ')} bsStyle="primary">Play <i className={["fa", "fa-play", 'animated', 'faa-pulse', styles.miniPlayIcon].join(" ")} /> </Button> 
                    }

                    { this.state.showCompAudioPlayback[4] &&
                      <audio controls autoPlay preload="auto" className={[styles.compAudioElement].join(' ')}>
                        <source src={'/audio/sample/3.mp3'} />
                        <p>Playback not supported</p>
                      </audio>
                    }

                  <p className={styles.compMissed}><span className={styles.missed}>0 of 1 point:</span> Missed key point that Chris thinks Mr. Podler believes things that aren’t true.</p> 
                </div>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>4. How do you think Chris feels about getting a new bike? What makes you think this?<span className={styles.pointValue}> (1 point)</span></h4>
                  <p className={styles.studentResponse}>He wants a bike so he is happy about getting a new one. But he is also upset because he really wants his old bike back. The story says that he doesn’t say yes to getting the new bike at first.</p> 


                   { !this.state.showCompAudioPlayback[5] &&
                      <Button onClick={() => this.onCompPlayRecordingClicked(5)} className={['fa faa-horizontal faa-slow', styles.miniPlayButton].join(' ')} bsStyle="primary">Play <i className={["fa", "fa-play", 'animated', 'faa-pulse', styles.miniPlayIcon].join(" ")} /> </Button> 
                    }

                    { this.state.showCompAudioPlayback[5] &&
                      <audio controls autoPlay preload="auto" className={[styles.compAudioElement].join(' ')}>
                        <source src={'/audio/sample/4.mp3'} />
                        <p>Playback not supported</p>
                      </audio>
                    }


                  <p className={styles.compCorrect}><span className={styles.missed}>1 of 1 point:</span> Reflects excellent understanding of the text. Includes details on Chris’s mixed feelings and evidence from the text.</p> 

                </div>
            </div>

          </div>

        }

        {this.props.isSample && this.props.assessmentBrand === 'STEP' &&
   
          <div className={[styles.comp, sharedStyles.compContainerLarge].join(' ')}>
            
            <hr className={styles.compDivider}/>


           <h5 className={[styles.sectionHeader, (true ? styles.showQ : styles.fadedComp)].join(' ')}>2. COMPREHENSION</h5>

            <div className={ [(true ? styles.showQ : styles.fadedComp), styles.compPart].join(' ') }>
              <h2 className={[styles.compPartHeader, styles.retellHeader].join(' ')}>Retell</h2>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>Tell as much as you can about the passage you just read. Be sure to include the beginning, middle and end.<span className={styles.pointValue}> (CCRA.R.2 and CCRA.R.3)</span></h4>
                  <p className={styles.studentResponse}>Chris’s mom tells him he can get a new bike and his Dad agrees. Chris is still nervous about getting a new bike because he still wants to search for the old one he likes. Then Chris and his Mom go out to get the new bike.</p> 




                    { !this.state.showCompAudioPlayback[1] &&
                      <Button onClick={() => this.onCompPlayRecordingClicked(1)} className={['fa faa-horizontal faa-slow', styles.miniPlayButton].join(' ')} bsStyle="primary">Play <i className={["fa", "fa-play", 'animated', 'faa-pulse', styles.miniPlayIcon].join(" ")} /> </Button> 
                    }

                    { this.state.showCompAudioPlayback[1] &&
                      <audio controls autoPlay preload="auto" className={[styles.compAudioElement].join(' ')}>
                        <source src={'/audio/sample/recording.mp3'} />
                        <p>Playback not supported</p>
                      </audio>
                    }

                 
                  <p className={styles.compCorrect}><span className={styles.correct}>2 of 3 points:</span> Response demonstrates a good understanding of the passage. Includes three major plot events in sequence, and shows insight into Chris’s actions. Lacks some important details to enrich the retelling, such as details on setting.</p> 
                </div>
            </div>

            <div className={styles.compPart}>
              <h2 className={styles.compPartHeader}>Factual</h2>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>1. How is the narrator's mom trying to make him feel better?<span className={styles.pointValue}> (CCRA.R.2)</span></h4>
                  <p className={styles.studentResponse}>Chris's mom is trying to make him feel better by buying him a new bike.</p> 
   

                    { !this.state.showCompAudioPlayback[2] &&
                      <Button onClick={() => this.onCompPlayRecordingClicked(2)} className={['fa faa-horizontal faa-slow', styles.miniPlayButton].join(' ')} bsStyle="primary">Play <i className={["fa", "fa-play", 'animated', 'faa-pulse', styles.miniPlayIcon].join(" ")} /> </Button> 
                    }

                    { this.state.showCompAudioPlayback[2] &&
                      <audio controls autoPlay preload="auto" className={[styles.compAudioElement].join(' ')}>
                        <source src={'/audio/sample/1.mp3'} />
                        <p>Playback not supported</p>
                      </audio>
                    }

                  <p className={styles.compCorrect}><span className={styles.missed}>1 of 1 points:</span> Response shows a strong undertanding of character and plot regarding Chris's mom. Correctly identifies key point that Mom wants to get Chris a new bike so he stops worrying about his lost one.</p> 
                </div>
            </div>

            <div className={styles.compPart}>
              <h2 className={styles.compPartHeader}>Inferential</h2>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>2. Will Chris stop looking for his old bike when he gets a new one? How do you know?<span className={styles.pointValue}> (CCRA.R.1)</span></h4>
                  <p className={styles.studentResponse}>Chris will stop looking because he still hasn’t found it.</p> 
 
                    { !this.state.showCompAudioPlayback[3] &&
                      <Button onClick={() => this.onCompPlayRecordingClicked(3)} className={['fa faa-horizontal faa-slow', styles.miniPlayButton].join(' ')} bsStyle="primary">Play <i className={["fa", "fa-play", 'animated', 'faa-pulse', styles.miniPlayIcon].join(" ")} /> </Button> 
                    }

                    { this.state.showCompAudioPlayback[3] &&
                      <audio controls autoPlay preload="auto" className={[styles.compAudioElement].join(' ')}>
                        <source src={'/audio/sample/2.mp3'} />
                        <p>Playback not supported</p>
                      </audio>
                    }

                  <p className={styles.compMissed}><span className={styles.missed}>0 of 1 points:</span> Response does not demonstrate proficiency in understanding whether Chris will keep looking. Misses key point that Chris will likely not stop looking for his old bike because he says that nothing will replace his old bike. Response suggests student could benefit from reviewing the text before answering.</p> 
                </div>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>3. Chris’s dad says, “We all know about Mr. Podler…Someday I’ll tell you about the ghosts he saw in City Hall.” What do you think he means?<span className={styles.pointValue}> (CCRA.R.4)</span></h4>
                  <p className={styles.studentResponse}>He thinks Mr. Podler once saw a ghost.</p> 

                    { !this.state.showCompAudioPlayback[4] &&
                      <Button onClick={() => this.onCompPlayRecordingClicked(4)} className={['fa faa-horizontal faa-slow', styles.miniPlayButton].join(' ')} bsStyle="primary">Play <i className={["fa", "fa-play", 'animated', 'faa-pulse', styles.miniPlayIcon].join(" ")} /> </Button> 
                    }

                    { this.state.showCompAudioPlayback[4] &&
                      <audio controls autoPlay preload="auto" className={[styles.compAudioElement].join(' ')}>
                        <source src={'/audio/sample/3.mp3'} />
                        <p>Playback not supported</p>
                      </audio>
                    }
                  <p className={styles.compMissed}><span className={styles.missed}>0 of 1 points:</span> Response does not demonstrate proficiency in inferring the meaning behind Chris’s dad's response. Student misses key point that Chris thinks Mr. Podler believes things that aren’t true.</p> 
                </div>                
            </div>



            <div className={styles.compPart}>
              <h2 className={styles.compPartHeader}>Critical Thinking</h2>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>4. How do you think Chris feels about getting a new bike? What makes you think this?<span className={styles.pointValue}> (CCRA.R.1)</span></h4>
                  <p className={styles.studentResponse}>He wants a bike so he is happy about getting a new one. But he is also upset because he really wants his old bike back. The story says that he doesn’t say yes to getting the new bike at first.</p> 
 

                    { !this.state.showCompAudioPlayback[5] &&
                      <Button onClick={() => this.onCompPlayRecordingClicked(5)} className={['fa faa-horizontal faa-slow', styles.miniPlayButton].join(' ')} bsStyle="primary">Play <i className={["fa", "fa-play", 'animated', 'faa-pulse', styles.miniPlayIcon].join(" ")} /> </Button> 
                    }

                    { this.state.showCompAudioPlayback[5] &&
                      <audio controls autoPlay preload="auto" className={[styles.compAudioElement].join(' ')}>
                        <source src={'/audio/sample/4.mp3'} />
                        <p>Playback not supported</p>
                      </audio>
                    }

                  <p className={styles.compCorrect}><span className={styles.missed}>1 of 1 point:</span> Reflects an excellent understanding of the text. Includes details on Chris’s mixed feelings and strong evidence from the text. Student shows strong ability to understand character motivation and reference the passage.</p> 

                </div>
            </div>

          </div>

        }





       { !this.props.isSample && this.props.assessmentBrand === 'STEP' && this.props.bookKey === 'firefly' &&
   
          <div className={[styles.comp, sharedStyles.compContainerLarge].join(' ')}>
            
            <hr className={styles.compDivider}/>


           <h5 className={[styles.sectionHeader, (this.isQuestionGraded(1) ? styles.showQ : styles.fadedComp)].join(' ')}>2. COMPREHENSION</h5>

            <div className={ [(this.isQuestionGraded(1) ? styles.showQ : styles.fadedComp), styles.compPart].join(' ') }>
              <h2 className={[styles.compPartHeader, styles.retellHeader].join(' ')}>Retell</h2>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>Tell as much as you can about the passage you just read. Be sure to include the beginning, middle and end.<span className={styles.pointValue}> (3 points)</span></h4>
                 
                  { this.isQuestionGraded(1) &&
                    this.renderGradedPartOfQuestion(0)
                  }
                  


                </div>
            </div>

            <div className={[styles.compPart, styles.fadedComp].join(' ')}>
              <h2 className={styles.compPartHeader}>Factual</h2>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>1. Why did the girl and her dad go outside?<span className={styles.pointValue}> (1 point)</span></h4>
                </div>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>2. Talk about how the story ended.<span className={styles.pointValue}> (1 point)</span></h4>
                </div>
            </div>


            <div className={[styles.compPart, styles.fadedComp].join(' ')}>
              <h2 className={styles.compPartHeader}>Inferential</h2>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>3. Why do you think the girl liked catching fireflies?<span className={styles.pointValue}> (1 point)</span></h4>
                </div>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>4. Why did the girl feel like opening her jar and letting the fireflies go?<span className={styles.pointValue}> (1 point)</span></h4>
                </div>
            </div>


            <div className={[styles.compPart, styles.fadedComp].join(' ')}>
              <h2 className={styles.compPartHeader}>Critical Thinking</h2>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>5. Does it seem like the girl and her Dad have caught fireflies before? Why do you think that?<span className={styles.pointValue}> (1 point)</span></h4>
                </div>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>6. Do you agree with the girl’s decision to let the fireflies go? Why? <span className={styles.pointValue}> (1 point)</span></h4>
                </div>
            </div>



          </div>

        }

       { !this.props.isSample && this.props.assessmentBrand === 'FP' && this.props.bookKey !== 'nick' &&
   
          <div className={[styles.comp, sharedStyles.compContainerLarge].join(' ')}>
            
            <hr className={styles.compDivider}/>


           <h5 className={[styles.sectionHeader, (this.isQuestionGraded(1) ? styles.showQ : styles.fadedComp)].join(' ')}>2. COMPREHENSION</h5>

            <div className={ [(styles.showQ), styles.compPart].join(' ') }>
              <h2 className={[styles.compPartHeader, styles.retellHeader].join(' ')}>Retell</h2>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={[(this.isQuestionGraded(1) ? '' : styles.fadedComp), styles.questionText].join(' ')}>Tell as much as you can about the passage you just read. Be sure to include the beginning, middle and end.<span className={styles.pointValue}> (3 points)</span></h4>
                 
                  { this.isQuestionGraded(1) &&
                    this.renderGradedPartOfQuestion(0)
                  }
                  


                </div>
            </div>

            <div className={[styles.compPart, styles.fadedComp].join(' ')}>
              <h2 className={styles.compPartHeader}>Within the Text</h2>
                {
                  this.renderFullQuestion(1)
                }
                 <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>2. Talk about how the story ended.<span className={styles.pointValue}> (1 point)</span></h4>
                </div>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>3. Why do you think the girl liked catching fireflies?<span className={styles.pointValue}> (1 point)</span></h4>
                </div>
            </div>



            <div className={[styles.compPart, styles.fadedComp].join(' ')}>
              <h2 className={styles.compPartHeader}>Beyond and About the Text</h2>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>4. Why did the girl feel like opening her jar and letting the fireflies go?<span className={styles.pointValue}> (1 point)</span></h4>
                </div>

                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>5. Does it seem like the girl and her Dad have caught fireflies before? Why do you think that?<span className={styles.pointValue}> (1 point)</span></h4>
                </div>
                <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
                  <h4 className={styles.questionText}>6. Do you agree with the girl’s decision to let the fireflies go? Why? <span className={styles.pointValue}> (1 point)</span></h4>
                </div>
            </div>



          </div>

        }



       { !this.props.isSample && this.props.assessmentBrand === 'FP' && this.props.bookKey === 'nick' &&
   
          <div className={[styles.comp, sharedStyles.compContainerLarge].join(' ')}>
            
            <hr className={styles.compDivider}/>


           <h5 className={[styles.sectionHeader, (this.isQuestionGraded(1) ? styles.showQ : styles.fadedComp)].join(' ')}>2. COMPREHENSION</h5>

            <div className={ [(this.isQuestionGraded(1) ? styles.showQ : styles.fadedComp), styles.compPart].join(' ') }>
              <h2 className={[styles.compPartHeader, styles.retellHeader].join(' ')}>Within the Text</h2>
                {
                  this.renderFullQuestion(0)
                }

            </div>


            <div className={[styles.compPart, (this.isQuestionGraded(2) ? styles.showQ : styles.fadedComp)].join(' ')}>
              <h2 className={styles.compPartHeader}>Beyond and About the Text</h2>
                {
                  this.renderFullQuestion(1)
                }

                {
                  this.renderFullQuestion(2)
                }


                {
                  this.renderFullQuestion(3)
                }

            </div>


          </div>

        }


      { this.props.bookKey === 'step' &&
   
          <div className={[styles.comp, sharedStyles.compContainerLarge].join(' ')}>
            
            <hr className={styles.compDivider}/>


           <h5 className={[styles.sectionHeader, (this.isQuestionGraded(1) ? styles.showQ : styles.fadedComp)].join(' ')}>2. COMPREHENSION</h5>


            <div className={ [styles.showQ, styles.compPart].join(' ') }>
              <h2 className={[styles.compPartHeader, styles.retellHeader, (this.isQuestionGraded(1) ? '' : styles.fadedComp)].join(' ')}>Factual</h2>
                {
                  this.renderFullQuestion(0)
                }

                {
                  this.renderFullQuestion(1)
                }

                {
                  this.renderFullQuestion(3)
                }

            </div>


            <div className={[styles.compPart, (styles.showQ)].join(' ')}>
              <h2 className={[(this.isQuestionGraded(3) ? '' : styles.fadedComp), styles.compPartHeader].join(' ')}>Inferential</h2>

                {
                  this.renderFullQuestion(2)
                }

                {
                  this.renderFullQuestion(4)
                }

            </div>


            <div className={[styles.compPart, styles.showQ].join(' ')}>
              <h2 className={[(this.isQuestionGraded(6) ? '' : styles.fadedComp), styles.compPartHeader].join(' ')}>Critical Thinking</h2>

                {
                  this.renderFullQuestion(5)
                }


            </div>



          </div>

        }



        { this.state.noNoteStarted &&
          <Button
            className={styles.addNoteButton} 
            bsStyle={'primary'}
            onClick={this.onAddNoteClicked}
          >
          Add notes <i className={"fa fa-pencil"} style={{marginLeft: 4}} aria-hidden="true"></i>
          </Button>
        }

        { this.state.draftingNote && 
          <div>
            <FormGroup controlId="teacherNote">
              <ControlLabel className={styles.noteControlLabel} >Your Notes</ControlLabel>
              <FormControl className={styles.noteTextArea} componentClass="textarea" defaultValue={this.state.teacherNote} inputRef={ref => { this.noteInput = ref; }} placeholder="Your note" />
            </FormGroup>

            <Button
              className={styles.saveNoteButton} 
              bsStyle={'primary'}
              onClick={this.onSaveNoteClicked}
            >
            Save note <i className={"fa fa-bookmark"} style={{marginLeft: 4}} aria-hidden="true"></i>
            </Button>
          </div> 
        }

        { this.state.noteExists && 
          <div>
            <ControlLabel className={styles.noteControlLabel} >Your Notes</ControlLabel>
            <p className={styles.editTeacherNoteText}>
            { this.state.teacherNote } 
            </p>
            <span className={styles.editSpan} onClick={this.onEditClicked}> Edit <i className={"fa fa-pencil " + styles.caret} aria-hidden="true"></i>
            </span>
          </div>
        }


          

          <div className={styles.pricingFooter}>
            <div className={styles.pricingFooterLabel}>
              { this.state.footerLabelText }
            </div>
            <div className={[styles.footerButtonContainer]}>
              <Button
                className={[styles.pricingFooterButton].join(' ')}
                bsStyle={'primary'}
                bsSize={'large'}
                onClick={ this.onFooterClicked }
              >
                { this.state.footerButtonText}
              </Button>


            </div>


          </div>


        </div>

        <style type="text/css">{'.modal-backdrop.in { opacity: 0.9; } '}</style>
        <Modal show={this.state.showEmailModal} dialogClassName={styles.modalMedium}>
          <Modal.Header>
            <img alt="" className={styles.paperImage} src="https://s3-us-west-2.amazonaws.com/readup-now/website/demo/paper-pen.png" />
            <img alt="" className={styles.paperImageOverlay} src="https://s3-us-west-2.amazonaws.com/readup-now/website/demo/rolling-small.gif" />
            <Modal.Title bsClass={styles.pricingModalTitle}>
              Get your scored assessment soon
            </Modal.Title>
            <h4 className={styles.modalSubtitle}>Your scored assessment will come within 15 minutes</h4>
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


       <style type="text/css">{'.modal-backdrop.in { opacity: 0.7; } '}</style>
        <Modal show={this.state.showBookModal} bsSize={"large"} onHide={this.closeBookModal} >
          <Modal.Body>
            <embed className={styles.pdf} src="/ReadUp-Leveled-Books-Library.pdf" type='application/pdf'/>
          </Modal.Body>
        </Modal>

        <style type="text/css">{'.btn-primary:hover {  background-color: #337ab7; border-color: #2e6da4; }'}</style>










      </div>
    );
  }
}


