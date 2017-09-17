import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import classNames from 'classnames/bind';

let cx = classNames.bind(styles);


export default class ModalHeader extends React.Component {
  static propTypes = {
    modalType: PropTypes.string,
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
  }

  render() {


    let modalHeaderTitleWrapperClass = cx({
      successModalHeaderTitleWrapper: this.props.modalType === 'success',
      infoModalHeaderTitleWrapper: this.props.modalType === 'info',
      dangerModalHeaderTitleWrapper: this.props.modalType === 'danger',
      modalHeaderTitleWrapper: true,
    });

    let modalHeaderTitleTextClass = cx({
      successModalHeaderTitleText: this.props.modalType === 'success',
      infoModalHeaderTitleText: this.props.modalType === 'info',
      dangerModalHeaderTitleText: this.props.modalType === 'danger',
      modalHeaderTitleText: true,
    });


    return (
      <div className={modalHeaderTitleWrapperClass}>
        <div className={modalHeaderTitleTextClass}>{this.props.title}</div>
      </div>

    );
  }
}
