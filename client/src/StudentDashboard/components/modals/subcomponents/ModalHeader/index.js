import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

export default class ModalHeader extends React.Component {
  static propTypes = {
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
      <div className={styles.modalHeaderTitleWrapper}>
        <div className={styles.modalHeaderTitleText}>{this.props.title}</div>
      </div>
        
    );
  }
}
