import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import _zip from 'lodash/zip';

export default class ButtonArray extends React.Component {
  static propTypes = {
    titles: PropTypes.arrayOf(PropTypes.string).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    actions: PropTypes.arrayOf(PropTypes.func),
    enlargeFirst: PropTypes.bool,
  };
  static defaultProps = {
    enlargeFirst: false,
  };

  render() {

    const zipped = _zip(this.props.actions, this.props.images, this.props.titles)

    return (
      <div className={styles.buttonArrayWrapper}>

        {zipped.map((buttonInfoArray, index) => (
          <div className={styles.buttonWrapper} key={buttonInfoArray[2]} onClick={buttonInfoArray[0]}>
            <img className={(this.props.enlargeFirst && index == 0) ? styles.largeButtonImage : styles.buttonImage} src={buttonInfoArray[1]} />
            <div className={(this.props.enlargeFirst && index == 0) ? styles.largeButtonText : styles.buttonText}>{buttonInfoArray[2]}</div>
          </div>
        ))}

      </div>
    );
  }
}
