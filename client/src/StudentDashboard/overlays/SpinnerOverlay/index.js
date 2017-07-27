import PropTypes from 'prop-types';
import React from 'react';

import styles from './styles.css'
import commonStyles from '../../modals/commonstyles.css'


export default class SpinnerOverlay extends React.Component {

  constructor(props, _railsContext) {
    super(props);
  }

  render() {
    return (
      <div className={styles.spinnerWrapper}>
        <img className={styles.spinner} src="/images/dashboard/rolling-small.gif" />
      </div>
    );
  }
}
