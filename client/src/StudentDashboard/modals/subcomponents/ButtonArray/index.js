import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

import _zip from "lodash/zip";

import classNames from "classnames/bind";

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
    showSpinner: PropTypes.bool,
    disabled: PropTypes.bool,
    secondaryAnimation: PropTypes.string,
    talkingAboutFirst: PropTypes.bool,
    greyOutSecondary: PropTypes.bool
  };
  static defaultProps = {
    enlargeFirst: false,
    inline: false,
    fontAwesome: true,
    disabled: false,
    secondaryAnimation: null,
    talkingAboutFirst: false,
    greyOutSecondary: true
  };

  renderButtons = () => {
    const zipped = _zip(
      this.props.actions,
      this.props.images,
      this.props.titles
    );

    let buttonImageClass = cx({
      smallButtonImage: this.props.inline
    });

    let buttonTextClass = cx({
      smallButtonText: this.props.inline
    });

    let iconColorClass = cx({
      greenIcon: this.props.modalType === "success",
      blueIcon:
        this.props.modalType === "info" || this.props.modalType === "danger"
    });

    let secondaryIconColorClass = cx({
      redIcon: true
    });

    let faSizeClassFirst = cx({
      icon: this.props.inline,
      largeIcon: !this.props.inline
    });

    let faSizeClassRest = cx({
      smallIcon: this.props.inline,
      icon: !this.props.inline,
      obscure: true,
      lightgrayIcon: true,
      redIcon: this.props.modalType === "danger"
    });

    let faAnimationClass;

    if (this.props.showSpinner || this.props.disabled) {
      faAnimationClass = "";
    } else {
      faAnimationClass = "faa-tada animated-hover";
    }

    let secondaryAnimationClass = this.props.secondaryAnimation;

    if (secondaryAnimationClass) {
      secondaryAnimationClass = [
        secondaryAnimationClass,
        "animated",
        styles.noTransform
      ].join(" ");
    }

    if (this.props.fontAwesome) {
      return zipped.map((buttonInfoArray, index) => (
        <div
          className={[
            this.props.disabled &&
            !(this.props.talkingAboutFirst && index === 0)
              ? styles.disabledButtonWrapper
              : styles.buttonWrapper,
            secondaryAnimationClass,
            this.props.talkingAboutFirst && index === 0
              ? styles.buttonWrapper
              : ""
          ].join(" ")}
          key={buttonInfoArray[2]}
          onClick={buttonInfoArray[0]}
        >
          {this.props.greyOutSecondary && (
            <div>
              <i
                className={[
                  this.props.enlargeFirst && index === 0
                    ? faSizeClassFirst
                    : faSizeClassRest,
                  "fa",
                  faAnimationClass,
                  buttonInfoArray[1],
                  iconColorClass
                ].join(" ")}
                aria-hidden={"true"}
              />
              <div
                className={[
                  this.props.enlargeFirst && index == 0
                    ? styles.buttonText
                    : [styles.smallButtonText, styles.obscure].join(" ")
                ].join(" ")}
              >
                {buttonInfoArray[2]}
              </div>
            </div>
          )}
          {!this.props.greyOutSecondary && (
            <div>
              <i
                className={[
                  faSizeClassFirst,
                  "fa",
                  faAnimationClass,
                  buttonInfoArray[1],
                  index === 0 ? iconColorClass : secondaryIconColorClass
                ].join(" ")}
                aria-hidden={"true"}
              />
              <div className={styles.buttonText}>{buttonInfoArray[2]}</div>
            </div>
          )}
        </div>
      ));
    }
  };

  render() {
    const zipped = _zip(
      this.props.actions,
      this.props.images,
      this.props.titles
    );

    return (
      <div
        className={
          this.props.inline
            ? styles.inlineButtonArrayWrapper
            : styles.buttonArrayWrapper
        }
      >
        {this.renderButtons()}
      </div>
    );
  }
}
