import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

export default class StudentDashboard extends React.Component {
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
      <div className={styles.readerContentContainer}>
        <img src="/images/chavez.jpeg" className={styles.readerImage} />

        <div className={styles.readerTextContainer}>

          <div className={styles.textParagraph}>
            Cesar worked hard so that others could live better.
          </div>
          
          <div className={styles.textParagraph}>
            He made life more fair.
          </div>

      
          
        </div>

        
        <div className={styles.pageNumber}>{this.props.pageNumber}</div>

      </div>
    );
  }
}
