import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import { FormControl } from 'react-bootstrap'



export default class SpellingTextField extends React.Component {
  static propTypes = {
    spellingQuestionNumber: PropTypes.number,
    onSpellingAnswerGiven: PropTypes.func,
    showVolumeIndicator: PropTypes.bool,
    showSpellingBoxIndicator: PropTypes.bool,
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

  componentWillReceiveProps(nextProps) {
    if (this.props.spellingQuestionNumber !== nextProps.spellingQuestionNumber) {
      this.form.value = ''
    }
  }


  onInputClicked = () => {
    this.setState({showHelper: false})
    this.props.onSpellingAnswerGiven(true)
  }


  render() {


    return (

        <div className={[styles.spellingContainer].join(' ')}>

          <img className={styles.spellingImage} src={`/images/dashboard/spelling/${(this.props.spellingQuestionNumber % 3) + 1}.png`} />

          
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
          />

          <i className={['fa fa-caret-right faa-passing animated', styles.helper].join(' ')} 
             style={{ visibility: (this.props.showSpellingBoxIndicator) ? 'visible' : 'hidden' }}
          />
        

        </div>

    );
  }
}
