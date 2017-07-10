import PropTypes from 'prop-types';
import React from 'react';
import NavigationBar from './components/NavigationBar'
import Reader from './components/Reader'
import RectangleButton from './components/RectangleButton'
import styles from './styles.css'


export default class StudentDashboard extends React.Component {
  static propTypes = {
    // name: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    this.state = {  
      pageNumber: 0,
    };


    this.pauseRecordingClicked = this.pauseRecordingClicked.bind(this);
    this.stopRecordingClicked = this.stopRecordingClicked.bind(this);
    this.nextPageClicked = this.nextPageClicked.bind(this);
    this.previousPageClicked = this.previousPageClicked.bind(this);
  }

  pauseRecordingClicked() {

  }

  stopRecordingClicked() {
    this.setState({ pageNumber: 8 })
  }

  nextPageClicked() {
    this.setState({ pageNumber: this.state.pageNumber + 1 })
  }

  previousPageClicked() {
    this.setState({ pageNumber: this.state.pageNumber - 1 })
  }


  render() {
    return (
      <div className={styles.fullHeight}>
        <NavigationBar className={styles.navBar} />

        <div className={styles.contentContainer}>

          <div className={styles.leftButtonContainer}>
            <RectangleButton  
              title='Previous' 
              subtitle='page'
              style={{ backgroundColor: '#2C6D9C' }}
              onClick={this.previousPageClicked}
            />
          </div>

          <div className={styles.readerContainer}>
            <Reader 
              pageNumber={this.state.pageNumber + 1} // Because 0 indexed
            />
          </div>

          <div className={styles.rightButtonContainer}>
            <RectangleButton  
              title='Next' 
              subtitle='page'
              style={{ backgroundColor: 'green' }}
              onClick={this.nextPageClicked}
            />
          </div>


          

        </div>
      </div>
    );
  }
}
