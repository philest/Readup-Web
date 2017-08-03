import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../../modals/commonstyles.css'
export default class CountdownModal extends React.Component {
  static propTypes = {
    countdownValue: PropTypes.number.isRequired,
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
  }


  render() {
    return (
      <div className={styles.countdownWrapper}>
        <div className={styles.countdownContentCountainer}>
          <div className={styles.countdownTitle}>

            Recording in...

          </div>
          <div className={styles.countdownNumber}>

            {this.props.countdownValue}

          </div>
        </div>
      </div>
    );
  }
}
