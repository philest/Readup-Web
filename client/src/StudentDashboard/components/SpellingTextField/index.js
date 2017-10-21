import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import { FormControl } from 'react-bootstrap'

import { updateAssessment, getAssessmentData } from '../../../ReportsInterface/emailHelpers'
import { getLastAssessmentID } from '../../sagas/networkingHelpers'


export default class SpellingTextField extends React.Component {
  static propTypes = {
    spellingQuestionNumber: PropTypes.number,
    onSpellingAnswerGiven: PropTypes.func,
    showVolumeIndicator: PropTypes.bool,
    showSpellingBoxIndicator: PropTypes.bool,
    spellingQuestionNumber: PropTypes.number,
    onEnterPressed: PropTypes.func,
  };
  static defaultProps = {
}

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      showHelper: true,
    };
  }


  saveSpellingResponse = (value) => {

    console.log('TODO: upload spelling')

  }

  componentWillMount() {
    document.addEventListener("keydown", this._handleKeyDown);

  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.spellingQuestionNumber !== nextProps.spellingQuestionNumber) {
      this.saveSpellingResponse(this.form.value)
      this.form.value = ''
    }
  }

  _handleKeyDown = (event) => {

    if (event.which == 13 || event.keyCode == 13 || event.code == 'Enter') {
      this.props.onEnterPressed()
    }
  }



  onInputClicked = () => {

    this.setState({showHelper: false})
    this.props.onSpellingAnswerGiven(true)
  }

  handleSpellingChange = () => {
    this.setState({showHelper: false})
    this.props.onSpellingAnswerGiven(true)    
  }



  render() {


    return (

        <div className={[styles.spellingContainer].join(' ')}>

          <img className={styles.spellingImage} src={`/images/dashboard/spelling/${(this.props.spellingQuestionNumber)}.png`} />

          
            <div className={styles.introVolume} style={{ visibility: this.props.showVolumeIndicator ? 'visible' : 'hidden' }}>
            <br />
            <i className={["fa fa-volume-up faa-pulse animated fa-3x faa-fast"].join(' ')} style={{ color: "white" }} aria-hidden="true"></i>
            </div>


          <style type='text/css'> 
          {`
            .form-control:focus {
              -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0px 26px rgba(102,175,233,.6);
              transition: all .3s;
            }

            .form-control {
              transition: all .3s;
            }

          `} 
          </style> 

          <FormControl
            className={styles.spellingField}
            type="text"
            bsSize='lg'
            spellCheck="false"
            onClick={this.onInputClicked}
            inputRef={ref => { this.form = ref; }}
            onChange={this.handleSpellingChange}
          />

          <i className={['fa fa-caret-right faa-passing animated', styles.helper].join(' ')} 
             style={{ visibility: (this.props.showSpellingBoxIndicator) ? 'visible' : 'hidden' }}
          />
        

        </div>

    );
  }
}
