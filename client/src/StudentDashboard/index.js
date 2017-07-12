import PropTypes from 'prop-types';
import React from 'react';

import NavigationBar from './components/NavigationBar'
import Reader from './components/Reader'
import RectangleButton from './components/RectangleButton'
import DoneModal from './components/modals/DoneModal'
import PausedModal from './components/modals/PausedModal'
import MicModal from './components/modals/MicModal'

import styles from './styles.css'

import { RouteTransition, presets } from 'react-router-transition';

import { Modal, Button } from 'react-bootstrap';


import {
  BrowserRouter as Router,
  HashRouter,
  Route,
  Link,
  Redirect,
} from 'react-router-dom'


const inlineStyles = {}

inlineStyles.fill = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0
}



class StudentDashboardRouteComponent extends React.Component {
  static propTypes = {
    studentName: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  constructor(props, _railsContext) {
    super(props);

    this.state = {  
      pageNumber: parseInt(this.props.match.params.page_number),
      storyId: this.props.match.params.story_id,
    };


    this.pauseRecordingClicked = this.pauseRecordingClicked.bind(this);
    this.stopRecordingClicked = this.stopRecordingClicked.bind(this);
    this.nextPageClicked = this.nextPageClicked.bind(this);
    this.previousPageClicked = this.previousPageClicked.bind(this);
  }

  componentDidUpdate(nextProps) {
    console.log('DIDUPDATE; pagenumber =' + this.props.match.params.page_number)

    if (parseInt(this.props.match.params.page_number) != this.state.pageNumber) {
      this.setState({  
        pageNumber: parseInt(this.props.match.params.page_number),
        redirectForward: false,
        redirectBack: false,
        showDoneModal: false,
      });
    }
  }

  pauseRecordingClicked() {

  }

  stopRecordingClicked() {

  }

  nextPageClicked() {
    this.setState({ redirectForward: true })
  }

  previousPageClicked() {
    this.setState({ redirectBack: true })
  }


  render() {

    // Catch redirection to other pages
    if (this.state.redirectForward) {
      return <Redirect push to={'/story/STORY_ID/page/'+(this.state.pageNumber+1)} />
    }
    if (this.state.redirectBack) {
      return <Redirect push to={'/story/STORY_ID/page/'+(this.state.pageNumber-1)} />
    }

    // Default: render page
    console.log('Rerendering, pageNumber is: ' + this.state.pageNumber)


    // const transitionPreset = this.props.location.action === 'POP' ? presets.slideLeft : presets.slideRight;
    const transitionProps = {...presets.pop, pathname: this.props.location.pathname, className: styles.routeTransition}

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
              onClick={this.previousPageClicked}
            />
          </div>

          <div className={styles.readerContainer}>
            <RouteTransition {...transitionProps}
            >

              <Reader 
                pageNumber={this.state.pageNumber}
                textLines={["Cesar worked hard so that others could live better.", "He made life more fair."]}
                imageURL={"http://mediad.publicbroadcasting.net/p/shared/npr/201405/306846592.jpg"}
              />

            </RouteTransition>
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

// Really just a wrapper component that contains the router
export default class StudentDashboard extends React.Component {
  static propTypes = {
    studentName: PropTypes.string.isRequired, // this is passed from the Rails view
  };

  render()  {
    console.log('more props!!')
    console.log(this.props)
    return (
      <HashRouter>
        <Route 
          path="/story/:story_id/page/:page_number" 
          render={(props) => {
            const fullProps = {...props, ...this.props}
            return <StudentDashboardRouteComponent {...fullProps} />
          }}
        />
      </HashRouter>
    );
  }
}






