import PropTypes from 'prop-types';
import React from 'react';
import css from './styles.css'
import styles from '../../styles.css'


import classNames from 'classnames/bind';

let cx = classNames.bind(styles);



export default class LevelResult extends React.Component {
  static propTypes = {
    difficulty: PropTypes.string.isRequired,
    currentLevel: PropTypes.string,
    levelFound: PropTypes.bool,
    reassess: PropTypes.bool,
    didEndEarly: PropTypes.bool,
    yellowColorOverride: PropTypes.bool,
  };

  static defaultProps = {
    levelFound: false,
    reassess: false,
    yellowColorOverride: false
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

  getDelta(difficulty) {
    if (this.props.reassess || this.props.didEndEarly) {
      return 0
    } else if (difficulty == 'Frustrational') {
      return -1
    } else {
      return 1
    }
  }

  getNextLevelString(delta) {
    return String.fromCharCode(this.props.currentLevel.charCodeAt(0) + delta)
  }


  render() {

    let btnClass = cx({
      goodLevelResult: this.props.difficulty !== 'Frustrational',
      poorLevelResult: this.props.difficulty === 'Frustrational',
      fairLevelResult: this.props.reassess === true || this.props.didEndEarly || this.props.yellowColorOverride,
      levelRectangle: true,
    });

    let label
    let nextStepMsg

    if (this.props.didEndEarly) {
      label = "Did not finish"
      nextStepMsg = "Resasses at Level " + this.getNextLevelString(this.getDelta(this.props.difficulty))
    } else {
      label = this.props.difficulty
      nextStepMsg = "Assess at Level " + this.getNextLevelString(this.getDelta(this.props.difficulty))
    }


    return (


      <div className={styles.levelInfoWrapper}>
        <div className={btnClass}>{label}</div>
        { this.props.levelFound &&
          <div className={styles.levelLabel}>
            Just-right level found <i className={"fa fa-check"} aria-hidden={"true"}></i>
          </div>
        }
        { !this.props.levelFound &&
          <div className={styles.ReassessLevelLabel}>
            <span>Next step:</span><br />{ nextStepMsg }
          </div>
        }
      </div>


    );
  }
}
