import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../../modals/commonstyles.css'

import { Button } from 'react-bootstrap'

const THIS_OVERLAY_ID = 'overlay-intro'

export default class IntroOverlay extends React.Component {
  static propTypes = {
    onContinueClicked: PropTypes.func,

    currentShowOverlay: PropTypes.string,
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {  };
  }

  render() {

    if (this.props.currentShowOverlay !== THIS_OVERLAY_ID) {
      return null
    }

    return (
      <div className={styles.introContainer}>
        <div className={styles.readupLogo}>ReadUp</div>
        <div className={styles.introTitle}>See how it works</div>
        <div className={styles.introSubtitle}>Get a sample running record, right now.</div>
        
        <Button 
          className={styles.continueButton}
          bsStyle={'primary'}
          bsSize={'large'}
          onClick={this.props.onContinueClicked}
        >
          Continue
        </Button>

      </div>


    );
  }
}
