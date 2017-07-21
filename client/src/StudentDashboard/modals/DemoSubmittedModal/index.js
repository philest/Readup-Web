import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../commonstyles.css'
import indexStyles from '../../styles.css'

import NavigationBar from '../../components/NavigationBar'
import ModalHeader from '../subcomponents/ModalHeader'
import RectangleButton from 'StudentDashboard/components/RectangleButton'
import ButtonArray from '../subcomponents/ButtonArray'

import { Button } from 'react-bootstrap'

export default class DemoSubmittedModal extends React.Component {
  static propTypes = {
    onLogoutClicked: PropTypes.func,
    studentName: PropTypes.string,
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
    return (
      <div className={styles.wrapper}>
        <NavigationBar 
          className={indexStyles.navBar}
          studentName={this.props.studentName}
          showPauseButton={false}
          onExitClicked={this.props.onLogoutClicked}
        />

        <div className={styles.submittedContainer}>

        <div>
          <img className={styles.submittedImage} src="/images/dashboard/paper-pen.png" />
          <h4 className={styles.title}>Great, we're grading it now!</h4>
          <p className={styles.subtitle}>We'll email you a full running record tonight.</p>
        </div>

        <div>
          <Button 
            className={styles.endButton}
            bsStyle={'primary'}
            bsSize={'large'}
            onClick={this.props.onLogoutClicked}
          >
            End demo and logout
          </Button>
        </div>
        </div>
      </div>

    );
  }
}
