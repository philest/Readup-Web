import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'





export default class CompReport extends React.Component {
  static propTypes = {
    bookObj: PropTypes.object.isRequired,
    studentResponses: PropTypes.object,
    graderComments: PropTypes.object,
    compScores: PropTypes.object,

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



  render() {


    return (

      <div>

        <div className={styles.colsWrapper}>

          {
            this.renderWordColumn(this.state.spellingObj.words, this.state.spellingObj.responses.length)
          }

          {
            this.renderResponsesColumn(this.state.spellingObj.words, this.state.spellingObj.responses)
          }

          {
            this.renderSections()
          }          
        </div>



      </div>

    )
  }
}
