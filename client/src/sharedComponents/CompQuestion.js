import PropTypes from 'prop-types';
import React from 'react';
import styles from '../ReportsInterface/styles.css'

import { Button } from 'react-bootstrap'




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

    isInteractive: PropTypes.bool,
  };
  static defaultProps = {
    isInteractive: false,
    studentFirstName: 'Student',
  };

  constructor(props) {
    super(props)
    this.state = {
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


    if (pts === 3) {
      scoreLabel = this.props.compScore + ' of 3' + ' points'
      colorClass = this.getColorClass(this.props.compScore, true)

    }
    else {
      scoreLabel = this.props.compScore + ' of 1' + ' points'
      colorClass = this.getColorClass(this.props.compScore, false)
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

            <p className={colorClass}><span className={styles.correct}>{scoreLabel}:</span> {this.props.graderComment}</p>
            <span className={styles.rescore}>Give a different score</span>
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






  render() {


    return (
      <div>
        { this.renderFullQuestion() }
      </div>
    )
  }
}
