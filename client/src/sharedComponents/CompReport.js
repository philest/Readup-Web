import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

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


  render() {


    return (

      <div>
        {this.renderCompQuestion(1)}
      </div>

    )
  }
}
