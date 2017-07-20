import PropTypes from 'prop-types';
import React from 'react';
import RectangleButton from '../RectangleButton'
import BookInfoHeader from '../BookInfoHeader'
import css from './styles.css'


export default class NavigationBar extends React.Component {
  static propTypes = {
    studentName: PropTypes.string.isRequired,
    onPauseClicked: PropTypes.func,

    // cover related stuff
    isCoverPage: PropTypes.bool,
    showPauseButton: PropTypes.bool,
    bookTitle: PropTypes.string,
    bookAuthor: PropTypes.string,
  };
  static defaultProps = {
    isCoverPage: false,
    showPauseButton: true,
  }

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    this.state = { name: this.props.name };
  }


  render() {
    console.log('**** show pause??  ' + this.props.showPauseButton)
    return (
      <div className={css.navContainer}>
        <div className={css.subContainer}>
          <span className={css.brandText}>ReadUp</span>
        </div>
        <div className={css.subContainer}>
          <div className={css.centerDisplayContainer}>

          { this.props.showPauseButton && 
            <RectangleButton
              title={'Pause'}
              subtitle={'recording'}
              style={{ marginTop: 20, backgroundColor: '#9D2C28' }}
              id="navigation-button"
              onClick={this.props.onPauseClicked}
            />
          }

          { !this.props.showPauseButton && 
            <BookInfoHeader
              title={this.props.bookTitle}
              subtitle={( 'by ' + this.props.bookAuthor)}
              style={{ marginTop: 20 }}
            />
          }
            
          </div>
        </div>
        <div className={css.subContainer}>
          <div className={css.rightDisplayContainer}>
            <span className={css.userNameLabel}>{this.props.studentName}</span>
            <span className={css.logoutButton}>
              <span className={css.logoutLabel}>Exit</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
