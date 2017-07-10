import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

export default class RectangleButton extends React.Component {
  static propTypes = {
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
      <div className={styles.rectangleButtonContainer} style={this.props.style} onClick={this.props.onClick}>
        <div className={styles.rectangleButtonTitle}>{this.props.title}</div>
        <div className={styles.rectangleButtonSubtitle}>{this.props.subtitle}</div>


      </div>

       
    );
  }
}
