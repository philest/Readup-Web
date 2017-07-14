import PropTypes from 'prop-types';
import React from 'react';

import NavigationBar from './components/NavigationBar'
import BookPage from './components/BookPage'
import BookCover from './components/BookCover'
import RectangleButton from './components/RectangleButton'


import styles from './styles.css'

import { RouteTransition, presets } from 'react-router-transition';

import { Modal, Button } from 'react-bootstrap';


import {
  Link,
  Redirect,
} from 'react-router-dom'



export default class Reader extends React.Component {
  static propTypes = {
    // For displaying the book page
    studentName: PropTypes.string.isRequired, // this is passed from the Rails view
    pageNumber: PropTypes.number,
    textLines: PropTypes.arrayOf(PropTypes.string),
    imageURL: PropTypes.string,

    // For displaying book cover
    showCover: PropTypes.bool,
    coverImageURL: PropTypes.string,
    bookTitle: PropTypes.string,
    bookAuthor: PropTypes.string,

    // other minimal state
    isFirstPage: PropTypes.bool,
    isLastPage: PropTypes.bool,

    // Callback functions
    // not required because not all functions needed for every page
    // i.e. the last page shouldn't have a nextPageClicked function
    onPauseClicked: PropTypes.func,
    onStopClicked: PropTypes.func,
    onStartClicked: PropTypes.func,
    onNextPageClicked: PropTypes.func,
    onPreviousPageClicked: PropTypes.func,
  };

  static defaultProps = {
    // Default to showing a regular page (neither cover nor first nor last)
    showCover: false,
    isFirstPage: false,
    isLastPage: false,
  }

  constructor(props, _railsContext) {
    super(props);
  }

  renderLeftButton = () => {
    if (this.props.showCover || this.props.isFirstPage) {
      return null
    }
    return (
      <RectangleButton  
        title='Previous' 
        subtitle='page'
        style={{ backgroundColor: '#2C6D9C' }}
        onClick={this.props.onPreviousPageClicked}
      />
    );
  }

  renderCenterDisplay = () => {
    if (this.props.showCover) {
      return <BookCover imageURL={this.props.coverImageURL} />
    }
    return (
      <BookPage 
        pageNumber={this.props.pageNumber}
        textLines={this.props.textLines}
        imageURL={this.props.imageURL}
      />
    );
  }

  renderRightButton = () => {
    if (this.props.isLastPage) {
      return (
        <RectangleButton  
          title='Stop' 
          subtitle='recording'
          style={{ backgroundColor: '#982E2B' }}
          onClick={this.props.onStopClicked}
        />
      );
    }
    else if (this.props.showCover) {
      return (
        <RectangleButton  
          title='Start' 
          subtitle='recording'
          style={{ backgroundColor: 'green' }}
          onClick={this.props.onStartClicked}
        />
      );
    }

    return (
      <RectangleButton  
        title='Next' 
        subtitle='page'
        style={{ backgroundColor: 'green' }}
        onClick={this.props.onNextPageClicked}
      />
    );
  }

  renderNavigationBar = () => {
    let navProps = {
      className: styles.navBar,
      studentName: this.props.studentName,
    }

    if (this.props.showCover) {
      navProps = {
        ...navProps,
        isCoverPage: true,
        bookTitle: this.props.bookTitle,
        bookAuthor: this.props.bookAuthor,
      }
    }
    else {
      navProps = {
        ...navProps,
        onPauseClicked: this.props.onPauseClicked,
      }
    }

    return <NavigationBar {...navProps} />
  }

  render() {

    console.log('Rerendering Reader, pageNumber is: ' + this.props.pageNumber)


    // const transitionPreset = this.props.location.action === 'POP' ? presets.slideLeft : presets.slideRight;
    const transitionProps = {...presets.pop, pathname: this.props.pathname, className: styles.routeTransition}

    return (
 
      <div className={styles.fullHeight}>


        { this.renderNavigationBar() }

        <div className={styles.contentContainer}>

          <div className={styles.leftButtonContainer}>
            { this.renderLeftButton() }
          </div>

          <div className={styles.bookpageContainer}>
            <RouteTransition {...transitionProps}>
              { this.renderCenterDisplay() }
            </RouteTransition>
          </div>

          <div className={styles.rightButtonContainer}>
            { this.renderRightButton() }
          </div>

        </div>        
      </div>
      
      
    );
  }
}