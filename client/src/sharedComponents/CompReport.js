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


  render() {


    return (

      <div>

        <CompQuestion
          studentResponse={this.props.studentResponses["0"]}
          graderComment={this.props.graderComments["0"]}
          compScore={this.props.compScores["0"]}
          pointsPossible={this.props.book.questions["1"].points}
          academicStandard={this.props.book.questions["1"].standard}
          questionNum={1}
          isGraded={this.isQuestionGraded(1)}
          title={this.props.book.questions["1"].title}
          subtitle={this.props.book.questions["1"].subtitle}
          showCompAudioPlayback={this.props.showCompAudioPlaybackHash['1']}
          onCompPlayRecordingClicked={this.onCompPlayRecordingClicked}
          renderCompAudio={this.renderCompAudio} 
          studentFirstName={this.props.studentFirstName}
          isInteractive={false}                    
        />


      </div>

    )
  }
}
