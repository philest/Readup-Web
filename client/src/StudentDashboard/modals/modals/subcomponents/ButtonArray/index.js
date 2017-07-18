import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import _zip from 'lodash/zip';

export default class ButtonArray extends React.Component {
  static propTypes = {
    titles: PropTypes.arrayOf(PropTypes.string).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    actions: PropTypes.arrayOf(PropTypes.func),
  };

  render() {

    const zipped = _zip(this.props.actions, this.props.images, this.props.titles)

    return (
      <div className={styles.buttonArrayWrapper}>

        {zipped.map(buttonInfoArray => (
          <div className={styles.buttonWrapper} key={buttonInfoArray[2]} onClick={buttonInfoArray[0]}>
            <img className={styles.buttonImage} src={buttonInfoArray[1]} />
            <div className={styles.buttonText}>{buttonInfoArray[2]}</div>
          </div>
        ))}

      </div>    
    );
  }
}
