import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'
import bookpageStyles from '../BookPage/styles.css'

export default class BookCover extends React.Component {
  static propTypes = {
    imageURL: PropTypes.string,
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

        <div className={bookpageStyles.fullContainer}>
          <div className={bookpageStyles.readerContentContainer}>
            <img src={this.props.imageURL} className={styles.coverImage} />            
          </div>
        </div>
    );
  }
}
