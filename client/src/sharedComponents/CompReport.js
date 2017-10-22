import PropTypes from 'prop-types';
import React from 'react';
import styles from '../ReportsInterface/styles.css'

import CompQuestion from './CompQuestion'




export default class CompReport extends React.Component {
  static propTypes = {
    studentResponses: PropTypes.object,
    graderComments: PropTypes.object,
    compScores: PropTypes.object,
    showCompAudioPlaybackHash: PropTypes.object,
    onCompPlayRecordingClicked: PropTypes.func,
    renderCompAudio: PropTypes.func,
    studentFirstName: PropTypes.string,
    book: PropTypes.object,
    numSections: PropTypes.number,
    numQuestions: PropTypes.number,
    sections: PropTypes.object,
    questions: PropTypes.object,

    isInteractive: PropTypes.bool,
  };
  static defaultProps = {
    isInteractive: false,
  };

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  renderSection = () => {

  }


  isQuestionGraded(qNum) {
    return (this.props.graderComments[String(qNum - 1)] && (this.props.compScores[String(qNum - 1)] != null))
  }

  renderCompQuestion = (qNum) => {

    return (
        <CompQuestion
          studentResponse={this.props.studentResponses[qNum - 1]}
          graderComment={this.props.graderComments[qNum - 1]}
          compScore={this.props.compScores[qNum - 1]}
          pointsPossible={this.props.book.questions[qNum].points}
          academicStandard={this.props.book.questions[qNum].standard}
          questionNum={qNum}
          isGraded={this.isQuestionGraded(qNum)}
          title={this.props.book.questions[qNum].title}
          subtitle={this.props.book.questions[qNum].subtitle}
          showCompAudioPlayback={this.props.showCompAudioPlaybackHash[qNum]}
          onCompPlayRecordingClicked={this.props.onCompPlayRecordingClicked}
          renderCompAudio={this.props.renderCompAudio}
          studentFirstName={this.props.studentFirstName}
          isInteractive={false}                    
        />
    )
  }


  renderCompSection = (sectionNum) => {
    let qArr = []


    for (let q = 1, len = this.props.numQuestions; q <= len; q++) {
      if (this.props.questions[q].section === sectionNum) { 
        qArr.push(this.renderCompQuestion(q))
      }
    }

    return (
    <div className={ [styles.showQ, styles.compPart].join(' ') }>
      <h2 className={[styles.compPartHeader, styles.retellHeader, (this.isQuestionGraded(1) ? '' : styles.fadedComp)].join(' ')}>{this.props.sections[sectionNum]}</h2> 

        <div>
          {qArr}
        </div>
    </div> 
    )
  }


  render() {


    return (

      <div>
        {this.renderCompSection(1)}
      </div>

    )
  }
}
