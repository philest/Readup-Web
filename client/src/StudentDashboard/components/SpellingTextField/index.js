import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'



export default class SpellingTextField extends React.Component {
  static propTypes = {
    pageNumber: PropTypes.number,
  };
  static defaultProps = {
}

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

        <div className={styles.textFieldContainer}>
          <h1>Hello World</h1>

        </div>

    );
  }
}
