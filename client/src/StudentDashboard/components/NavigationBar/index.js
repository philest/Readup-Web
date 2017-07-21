import PropTypes from 'prop-types';
import React from 'react';
import RectangleButton from '../RectangleButton'
import BookInfoHeader from '../BookInfoHeader'
import css from './styles.css'


export default class NavigationBar extends React.Component {
  static propTypes = {
    studentName: PropTypes.string.isRequired,
    onPauseClicked: PropTypes.func,
    onExitClicked: PropTypes.func,

    // cover related stuff
    isCoverPage: PropTypes.bool,
    showPauseButton: PropTypes.bool,
    showBookInfo: PropTypes.bool,
    bookTitle: PropTypes.string,
    bookAuthor: PropTypes.string,
  };
  static defaultProps = {
    showPauseButton: true,
    isCoverPage: false,
    showBookInfo: false,
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
    return (
      <div className={css.navContainer}>
        <div className={css.subContainer}>
          <span className={css.brandText}>ReadUp</span>
        </div>
        
        { this.props.showPauseButton && 

          <div className={css.subContainer}>
            <div className={css.centerDisplayContainer}>
              <RectangleButton
                title={'Pause'}
                subtitle={'recording'}
                style={{ marginTop: 20, backgroundColor: '#9D2C28' }}
                id="navigation-button"
                onClick={this.props.onPauseClicked}
              />
            </div>
          </div>

        }

        { (this.props.isCoverPage || this.props.showBookInfo) && 

          <div className={css.subContainer}>
            <div className={css.centerDisplayContainer}>
              <BookInfoHeader
                title={this.props.bookTitle}
                subtitle={( 'by ' + this.props.bookAuthor)}
                style={{ marginTop: 20 }}
              />
            </div>
          </div>

        }
            
        <div className={css.subContainer}>
          <div className={css.rightDisplayContainer}>
            <span className={css.userNameLabel}>{this.props.studentName}</span>
            <span className={css.logoutButton}>
              <a className={css.logoutLabel} onClick={this.props.onExitClicked}>Exit</a>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
