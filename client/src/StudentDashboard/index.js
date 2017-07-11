import PropTypes from 'prop-types';
import React from 'react';

import NavigationBar from './components/NavigationBar'
import Reader from './components/Reader'
import RectangleButton from './components/RectangleButton'

import styles from './styles.css'

import { RouteTransition } from 'react-router-transition';


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
      pageNumber: parseInt(this.props.match.params.page_number),
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
        redirectBack: false
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
      console.log('redirect forward')
      return <Redirect push to={'/story/STORY_ID/page/'+(this.state.pageNumber+1)} />
    }
    if (this.state.redirectBack) {
      console.log('redirect back')
      return <Redirect push to={'/story/STORY_ID/page/'+(this.state.pageNumber-1)} />
    }

    // Default: render page
    console.log('rerendering, pageNumber is ' + this.state.pageNumber)
    return (

      <RouteTransition
            pathname={this.props.location.pathname}
            atEnter={{ opacity: 0 }}
            atLeave={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
            className={styles.routeTransition}
          >

          
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
              pageNumber={this.state.pageNumber}
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
      </RouteTransition>
      
    );
  }
}


// const Fade = ({ children, ...props }) => (
//  <CSSTransition
//    {...props}
//    timeout={50}
//    classNames="fade"
//  >
//   {children}
//  </CSSTransition>
// );

export default class StudentDashboard extends React.Component {

  // constructor(...args) {
  //   super(...args);
  //   this.state= { show: false }

  //   setInterval(() => {
  //     this.setState({ show: true})
  //   }, 500)
  // }

  render()  {

    return (
      <HashRouter>

          
          

            <Route 
              path="/story/:story_id/page/:page_number" 
              component={StudentDashboardRouteComponent}
              // location={location}
              // key={location.key}
            />
          
          

          
        
      </HashRouter>
    );
  }
}






