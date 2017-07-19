import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../commonstyles.css'

import ModalHeader from '../subcomponents/ModalHeader'
import RectangleButton from 'StudentDashboard/components/RectangleButton'
import ButtonArray from '../subcomponents/ButtonArray'

export default class PermissionsModal extends React.Component {
  static propTypes = {
    onArrowClicked: PropTypes.func,
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
      <div className={styles.permissionsContainer}>
        <h1 style={{ color: 'white', fontSize: '2.5em' }}>
          Click "<i>Allow</i>" in the box above.
        </h1>
        <img src="/images/dashboard/green-up-arrow.png" className={styles.upArrow} onClick={this.props.onArrowClicked} />
      </div>


    );
  }
}
