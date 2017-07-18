import PropTypes from 'prop-types';
import React from 'react';
import RectangleButton from '../RectangleButton'
import css from './styles.css'


export default class NavigationBar extends React.Component {
  static propTypes = {
    studentName: PropTypes.string.isRequired,
    onPauseClicked: PropTypes.func,

    // cover related stuff
    isCoverPage: PropTypes.bool,
    bookTitle: PropTypes.string,
    bookAuthor: PropTypes.string,
  };
  static defaultProps = {
    isCoverPage: false,
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
        <div className={css.subContainer}>
          <div className={css.centerDisplayContainer}>
            <RectangleButton
              title={ (this.props.isCoverPage && this.props.bookTitle) || 'Pause'  }
              subtitle={ (this.props.isCoverPage && ('by ' + this.props.bookAuthor)) || 'recording'  }
              style={{ marginTop: 20 }}
              id="navigation-button"
              disabled={this.props.isCoverPage}
              onClick={this.props.onPauseClicked}
            />
          </div>
        </div>
        <div className={css.subContainer}>
          <div className={css.rightDisplayContainer}>
            <span className={css.userNameLabel}>{this.props.studentName}</span>
            <span className={css.logoutButton}>
              <span className={css.logoutLabel}>Logout</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
