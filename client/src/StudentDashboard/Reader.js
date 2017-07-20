import PropTypes from 'prop-types';
import React from 'react';

import NavigationBar from './components/NavigationBar'
import BookPage from './components/BookPage'
import BookCover from './components/BookCover'
import RectangleButton from './components/RectangleButton'


import styles from './styles.css'

import { RouteTransition, presets } from 'react-router-transition';

import { Modal, Button, Popover, OverlayTrigger } from 'react-bootstrap';


import {
  Link,
  Redirect,
} from 'react-router-dom'



export default class Reader extends React.Component {
  static propTypes = {
    isDemo: PropTypes.bool,
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

    // other state
    showPauseButton: PropTypes.bool,
    isFirstPage: PropTypes.bool,
    isLastPage: PropTypes.bool,
    disabled: PropTypes.bool,

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
    isDemo: false,
    // Default to showing a regular page (neither cover nor first nor last)
    showCover: false,
    isFirstPage: false,
    isLastPage: false,
    showPauseButton: true,
    disabled: false,
  }

  constructor(props, _railsContext) {
    super(props);
  }

  

  renderLeftButton = () => {
    if (this.props.showCover || this.props.isFirstPage) {
      return null
    }

    if (this.props.isDemo) { // disabled previous button
      const previousHoverPopover = (
        <Popover id="popover-trigger-hover-focus" title="Popover bottom">
          <div style={{ backgroundColor: 'white' }}>
            Previous button is disabled in demo
          </div>
        </Popover>
      );

      return (
        <OverlayTrigger trigger={['hover', 'focus']} placement='top' overlay={<Popover id='back'>Previous button is disabled in this demo</Popover>}>
          <div className={styles.fullWidthHeight}>
            <RectangleButton
              title='Previous'
              subtitle='page'
              style={{ backgroundColor: '#2C6D9C' }}
              disabled={true}
              onClick={this.props.onPreviousPageClicked}
            />
          </div>
        </OverlayTrigger>
      );
    }

    return (
      <RectangleButton
        title='Previous'
        subtitle='page'
        style={{ backgroundColor: '#2C6D9C' }}
        onClick={this.props.onPreviousPageClicked}
      />
    )
    
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
          pulsatingArrow={true}
          disabled={this.props.disabled}
          onClick={this.props.onStopClicked}
        />
      );
    }
    else if (this.props.showCover) {
      return (
        <RectangleButton
          title='Start'
          subtitle='read and record'
          style={{ backgroundColor: 'green' }}
          pulsatingArrow={true}
          disabled={this.props.disabled}
          onClick={this.props.onStartClicked}
        />
      );
    }

    return (
      <RectangleButton
        title='Next'
        subtitle='page'
        style={{ backgroundColor: 'green' }}
        disabled={this.props.disabled}
        onClick={this.props.onNextPageClicked}
      />
    );
  }

  renderNavigationBar = () => {

    const navProps = {
      className: styles.navBar,
      studentName: this.props.studentName,
      showPauseButton: this.props.showPauseButton,
      bookTitle: this.props.bookTitle,
      bookAuthor: this.props.bookAuthor,
      isCoverPage: this.props.showCover,
      onPauseClicked: this.props.onPauseClicked,
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