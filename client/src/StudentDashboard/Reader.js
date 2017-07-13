import PropTypes from 'prop-types';
import React from 'react';

import NavigationBar from './components/NavigationBar'
import BookPage from './components/BookPage'
import RectangleButton from './components/RectangleButton'
import DoneModal from './components/modals/DoneModal'
import PausedModal from './components/modals/PausedModal'
import MicModal from './components/modals/MicModal'

import styles from './styles.css'

import { RouteTransition, presets } from 'react-router-transition';

import { Modal, Button } from 'react-bootstrap';


import {
  Link,
  Redirect,
} from 'react-router-dom'



export default class Reader extends React.Component {
  static propTypes = {
    // For displaying the page
    studentName: PropTypes.string.isRequired, // this is passed from the Rails view
    pageNumber: PropTypes.number,
    textLines: PropTypes.arrayOf(PropTypes.string),
    imageURL: PropTypes.string,

    // Callback functions
    onPauseRecordingClicked: PropTypes.func,
    onStopRecordingClicked: PropTypes.func,
    onNextPageClicked: PropTypes.func,
    onPreviousPageClicked: PropTypes.func,
  };

  constructor(props, _railsContext) {
    super(props);
  }


  render() {

    console.log('Rerendering Reader, pageNumber is: ' + this.props.pageNumber)


    // const transitionPreset = this.props.location.action === 'POP' ? presets.slideLeft : presets.slideRight;
    const transitionProps = {...presets.pop, pathname: this.props.pathname, className: styles.routeTransition}

    return (
 
      <div className={styles.fullHeight}>


        <Modal 
          dialogueClassName={styles.doneModal} 
          className={styles.doneModal} 
          show={false} 
          onHide={this.close}
          animation={true}
        >
          <MicModal />
        </Modal>


        <NavigationBar 
          className={styles.navBar}
          studentName={this.props.studentName} 
        />

        <div className={styles.contentContainer}>

          <div className={styles.leftButtonContainer}>
            <RectangleButton  
              title='Previous' 
              subtitle='page'
              style={{ backgroundColor: '#2C6D9C' }}
              onClick={this.props.onPreviousPageClicked}
            />
          </div>

          <div className={styles.bookpageContainer}>
            <RouteTransition {...transitionProps}
            >

              <BookPage 
                pageNumber={this.props.pageNumber}
                textLines={this.props.textLines}
                imageURL={this.props.imageURL}
              />

            </RouteTransition>
          </div>

          <div className={styles.rightButtonContainer}>
            <RectangleButton  
              title='Next' 
              subtitle='page'
              style={{ backgroundColor: 'green' }}
              onClick={this.props.onNextPageClicked}
            />
          </div>

        </div>        
      </div>
      
      
    );
  }
}