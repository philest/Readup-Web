import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import _zip from 'lodash/zip';

import classNames from 'classnames/bind';

let cx = classNames.bind(styles);




export default class ButtonArray extends React.Component {
  static propTypes = {
    titles: PropTypes.arrayOf(PropTypes.string).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    actions: PropTypes.arrayOf(PropTypes.func),
    enlargeFirst: PropTypes.bool,
    inline: PropTypes.bool,
    fontAwesome: PropTypes.bool,
    modalType: PropTypes.string,
  };
  static defaultProps = {
    enlargeFirst: false,
    inline: false,
  };


  renderButtons = () => {

    const zipped = _zip(this.props.actions, this.props.images, this.props.titles)

    let buttonImageClass = cx({
      smallButtonImage: this.props.inline,
    });



    let buttonTextClass = cx({
      smallButtonText: this.props.inline,
    });

    let iconColorClass = cx({
      greenIcon: this.props.modalType === 'success',
    });

    let faSizeClassFirst = cx({
      icon: this.props.inline,
      largeIcon: !this.props.inline,
    })


    let faSizeClassRest = cx({
      smallIcon: this.props.inline,
      icon: !this.props.inline,
      obscure: true,
      lightgrayIcon: true,  
    })


    if (this.props.fontAwesome) {
      return (
        zipped.map((buttonInfoArray, index) => (
          <div className={this.props.disabled ? styles.disabledButtonWrapper : styles.buttonWrapper} key={buttonInfoArray[2]} onClick={buttonInfoArray[0]}>
            <i className={[((this.props.enlargeFirst && index === 0) ? faSizeClassFirst : faSizeClassRest), 'fa', 'faa-tada', 'animated-hover', buttonInfoArray[1], iconColorClass].join(' ')} aria-hidden={"true"} />
            <div className={[((this.props.enlargeFirst && index == 0) ? styles.buttonText : [styles.smallButtonText, styles.obscure].join(' '))].join(' ')}>{buttonInfoArray[2]}</div>
          </div>
        ))
      );
    } else {
      return (
        zipped.map((buttonInfoArray, index) => (
          <div className={styles.buttonWrapper} key={buttonInfoArray[2]} onClick={buttonInfoArray[0]}>
            <img className={[((this.props.enlargeFirst && index == 0) ? styles.largeButtonImage : styles.buttonImage), buttonImageClass].join(' ')} src={buttonInfoArray[1]} />
            <div className={[((this.props.enlargeFirst && index == 0) ? styles.largeButtonText : styles.buttonText), buttonTextClass].join(' ')}>{buttonInfoArray[2]}</div>
          </div>
        ))
      );
    }

  }

  render() {





    const zipped = _zip(this.props.actions, this.props.images, this.props.titles)

    return (
      <div className={this.props.inline ? styles.inlineButtonArrayWrapper : styles.buttonArrayWrapper}>
        {this.renderButtons()}
      </div>
    );
  }
}
