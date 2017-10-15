import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import { FormControl } from 'react-bootstrap'



export default class SpellingTextField extends React.Component {
  static propTypes = {
    pageNumber: PropTypes.number,
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


  onInputClicked = () => {
    this.setState({showHelper: false})
  }


  render() {


    return (

        <div className={styles.spellingContainer}>

          <img className={styles.spellingImage} src='/images/dashboard/spelling/1-hay.png' />

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
            placeholder="_____"
            bsSize='lg'
            spellCheck="false"
            onClick={this.onInputClicked}
          />

          <i className={['fa fa-caret-right faa-passing animated', styles.helper].join(' ')} 
             style={{ visibility: (this.state.showHelper) ? 'visible' : 'hidden' }}
          />
        

        </div>

    );
  }
}
