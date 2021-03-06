import PropTypes from 'prop-types';
import React from 'react';
import css from './styles.css'


export default class InfoBar extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    extraInfo: PropTypes.string, // The reminder about emailed report
  };

  static defaultProps = {
    subtitle: "",
    extraInfo: "",
  }



  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes

  }


  render() {
    return (
      <div className={css.InfoContainer}>
        <div className={css.InfoTextContainer} style={{ maxWidth: this.props.withScorer ? "none" : 1025 + "px", paddingRight: this.props.withScorer ? 115 + "px" : 35 + "px"}}>
          <h2 className={css.InfoTitle}>{this.props.title}
            {this.props.subtitle.length > 0 &&
              <span className={css.InfoSubtitle}>{", " + this.props.subtitle}</span>
            }
          </h2>
          <div className={css.InfoExtraInfoContainer}>
            <p className={css.InfoExtraInfo}>{this.props.extraInfo}</p>
          </div>
        </div>

      </div>
    );
  }
}
