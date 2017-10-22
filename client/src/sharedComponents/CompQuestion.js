import PropTypes from 'prop-types';
import React from 'react';
import styles from '../ReportsInterface/styles.css'

import { Button, Modal, FormGroup, FormControl, ControlLabel, ButtonGroup } from 'react-bootstrap'
import { updateAssessment, getAssessmentData } from '../ReportsInterface/emailHelpers'



export default class CompQuestion extends React.Component {
  static propTypes = {
    studentResponse: PropTypes.string,
    graderComment: PropTypes.string,
    compScore: PropTypes.number,
    pointsPossible: PropTypes.number,
    academicStandard: PropTypes.string,
    questionNum: PropTypes.number,
    isGraded: PropTypes.bool,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    showCompAudioPlayback: PropTypes.bool,
    onCompPlayRecordingClicked: PropTypes.func,
    renderCompAudio: PropTypes.func, 
    studentFirstName: PropTypes.string,
    assessmentID: PropTypes.number,

    isInteractive: PropTypes.bool,
  };
  static defaultProps = {
    isInteractive: false,
    studentFirstName: 'Student',
  };

  constructor(props) {
    super(props)
    this.state = {
      showRescoreModal: false,
      graderComment: this.props.graderComment,
      compScore: null,
      savedNewScore: false,
    }
  }

  getFullTitle() {

     let title = this.props.title
     let subtitle = this.props.subtitle

     if (subtitle) {
      return `${title} ${subtitle}`
     }
     else {
      return title
     }

  }


  renderFullQuestion = () => {

    let pointsLabel = ''
    let qLabel = `${this.props.questionNum}. `

    let pts = this.props.pointsPossible
    let standard = this.props.academicStandard

    if (standard) {
      pointsLabel = `(${standard})`
    }

    return (
      <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow'].join(' ')}>
        <h4 className={[styles.questionText, (this.props.isGraded ? '' : styles.fadedComp)].join(' ')}>{qLabel + this.getFullTitle()}
          <span className={styles.pointValue}> {pointsLabel}</span>
        </h4>
       
        { this.props.isGraded &&
          this.renderGradedPartOfQuestion(this.props.questionNum)
        }
        
      </div>
    )

  }


  renderGradedPartOfQuestion = (questionNum) => {
    let scoreLabel
    let colorClass

    let pts = this.props.pointsPossible

    let compScore = this.props.compScore
    let graderComment = this.props.graderComment

    if (this.state.savedNewScore) { // Use their new scoring instead 
      compScore = this.state.compScore
      graderComment = this.state.graderComment
    }

    if (pts === 3) {
      scoreLabel = compScore + ' of 3' + ' points'
      colorClass = this.getColorClass(compScore, true)

    }
    else {
      scoreLabel = compScore + ' of 1' + ' points'
      colorClass = this.getColorClass(compScore, false)
    } 

    return (
            <div className={'faa-parent animated-hover faa-slow'}>
            
            { this.props.studentResponse &&
              <p className={styles.studentResponse}>"{this.props.studentResponse}"</p> 
            }

            { !this.props.showCompAudioPlayback &&
              <Button onClick={() => this.props.onCompPlayRecordingClicked(questionNum)} className={['fa faa-horizontal faa-slow', styles.miniPlayButton, (!this.props.studentResponse ? styles.noTranscriptionMiniPlayButton : '')].join(' ')} bsStyle="primary">
                Hear {this.props.studentFirstName} <i className={["fa", "fa-play", 'animated', 'faa-pulse', styles.miniPlayIcon].join(" ")} />
              </Button> 
            }
            { this.props.showCompAudioPlayback &&
              this.props.renderCompAudio(questionNum)
            }

            <p className={colorClass}><span className={styles.correct}>{scoreLabel}:</span> {graderComment}</p>
            <span className={styles.rescoringLabels}> 
              { this.state.savedNewScore && // TODO created DB column to track this stateless. 
                <span className={styles.rescoreIndicator}>Rescored</span> 
              }
              <span onClick={this.onShowRescoreModal} className={styles.rescore}>Give a different score</span>
            </span> 
            </div>
          )
  }




  renderQuestionForRescoring = () => {
    let pointsLabel = ''

    let pts = this.props.pointsPossible
    let standard = this.props.academicStandard

    if (standard) {
      pointsLabel = `(${standard})`
    }

    return (
      <div className={[styles.questionBlock, 'faa-parent animated-hover faa-slow', styles.rescoringQuestionBlock].join(' ')}>
        <h4 className={[styles.questionText, styles.rescoringQuestionText, (this.props.isGraded ? '' : styles.fadedComp)].join(' ')}>{this.getFullTitle()}
          <span className={styles.pointValue}> {pointsLabel}</span>
        </h4>
      </div>
    )

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




  onHideRescoreModal = () => {
    this.setState({ showRescoreModal: false })
  }

  onShowRescoreModal = () => {
    this.setState({ showRescoreModal: true })
  }

  handleGraderCommentChange = (event) => {
    const graderComment = event.target.value
    this.setState({ graderComment: graderComment })
  }

  renderScoringButtonsComp = () => {
    let qNum = this.props.questionNum

    let buttonArr = []
    let pointsPossible = this.props.pointsPossible

    for (let i = 0; i <= pointsPossible; i++) {
      buttonArr.push(
        <Button key={i} active={this.state.compScore === i} href="#" onClick={() => this.onCompScoreClicked(i, qNum - 1)}><strong>{i}</strong> {i === 0 ? ' points' : ' points'}</Button>
      )
    }

    return (
      <div>
        <ControlLabel>Updated Score</ControlLabel>
        <br />
        <ButtonGroup className={[styles.fluencyButtonGroup, styles.promptButtonGroup].join(' ')}>
          { buttonArr }
        </ButtonGroup>
      </div> 
    )

  }

  onCompScoreClicked = (score) => {
    this.setState({ compScore: score })
  }

  onSaveNewScoreClicked = () => {
  
    if (this.props.assessmentID) {// non-sample only 
      let assessment = getAssessmentData(this.props.assessmentID)

      assessment.then( (assessment) => {
        console.log('got assessment: ', assessment)
        let compScoresHolder = assessment.comp_scores
        let graderCommentsHolder = assessment.grader_comments

        compScoresHolder[this.props.questionNum - 1] = this.state.compScore
        graderCommentsHolder[this.props.questionNum - 1] = this.state.graderComment


        updateAssessment( {
                           grader_comments: graderCommentsHolder,
                           comp_scores: compScoresHolder,
                          },
                           this.props.assessmentID,
                        )
      })
    }

    this.setState({ savedNewScore: true })

    this.onHideRescoreModal()
    // update the assessment 
  



  }


  render() {


    return (
      <div>
        { this.renderFullQuestion() }


       <style type="text/css">{'.modal-backdrop.in { opacity: 0.6; } '}</style>
        <Modal dialogClassName={styles.modalLg}  show={this.state.showRescoreModal}   onHide={this.onHideRescoreModal} >
          <Modal.Header bsClass={[styles.playbookModalHeader, 'modal-header'].join(' ')} closeButton>
            <Modal.Title>
              Rescoring Question {this.props.questionNum}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.rescoringContainer} > 

              <div className={styles.tophalfRescoring}>
                {this.renderQuestionForRescoring()}

                { this.props.studentResponse &&
                  <p className={[styles.studentResponse, styles.rescoringStudentResponse].join(' ')}>"{this.props.studentResponse}"</p> 
                }
              </div>

              <hr className={styles.rescoringDivider} /> 


              <FormGroup controlId="graderComments">
                <ControlLabel>Updated comments</ControlLabel>
                <FormControl componentClass="textarea" className={styles.rescoringGraderCommentForm} value={this.state.graderComment} onChange={(event) => this.handleGraderCommentChange(event)} placeholder="Your comments" />
              </FormGroup>

              {this.renderScoringButtonsComp()}


              <Button
                className={[styles.saveNoteButton, styles.saveNewScoreButton].join(' ')} 
                bsStyle={'primary'}
                onClick={this.onSaveNewScoreClicked}
              >
              Save new score <i className={"fa fa-bookmark"} style={{marginLeft: 4}} aria-hidden="true"></i>
              </Button>

              <Button
                className={[styles.saveNoteButton, styles.saveNewScoreButton].join(' ')} 
                bsStyle={'default'}
                onClick={this.onHideRescoreModal}
              >
              Cancel <i className={"fa fa-ban"} style={{marginLeft: 4}} aria-hidden="true"></i>
              </Button>



            </div> 


          </Modal.Body>
        </Modal>


      </div>
    )
  }
}
