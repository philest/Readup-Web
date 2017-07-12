import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import _zip from 'lodash/zip';


export default class ButtonArray extends React.Component {
  static propTypes = {
    titles: PropTypes.arrayOf(PropTypes.string).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  render() {

    const zipped = _zip(this.props.images, this.props.titles)
    console.log(zipped)

    return (
      <div className={styles.buttonArrayWrapper}>

        {zipped.map(titleImageArray => (
          <div className={styles.buttonWrapper}>
            <img className={styles.buttonImage} src={titleImageArray[0]} />
            <div className={styles.buttonText}>{titleImageArray[1]}</div>
          </div>
        ))}

      </div>    
    );
  }
}
