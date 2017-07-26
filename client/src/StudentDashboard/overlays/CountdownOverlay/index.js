import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../../modals/commonstyles.css'
export default class CountdownModal extends React.Component {
  static propTypes = {
    countdownDuration: PropTypes.number.isRequired,
    onCountdownFinished: PropTypes.func,
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      curTimerValue: this.props.countdownDuration,
    };

    setTimeout(this.countdownTick, 1000)
  }

  countdownTick = () => {
    const newTimerValue = this.state.curTimerValue - 1
    if (newTimerValue < 0) {
      return this.props.onCountdownFinished && this.props.onCountdownFinished()
    }

    this.setState({ curTimerValue: newTimerValue })
    setTimeout(this.countdownTick, 1000)
  }

  render() {
    return (
      <div className={styles.countdownWrapper}>
        <div className={styles.countdownContentCountainer}>
          <div className={styles.countdownTitle}>
            Recording in...
          </div>
          <div className={styles.countdownNumber}>
            {this.state.curTimerValue}
          </div>
        </div>
      </div>
    );
  }
}
