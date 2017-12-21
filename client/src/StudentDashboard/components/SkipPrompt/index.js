import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

export default class SkipPrompt extends React.Component {
  static propTypes = {
    topOffset: PropTypes.number,
    onSkipClicked: PropTypes.func,
    nextSection: PropTypes.string,
    dragSpelling: PropTypes.bool,
    spelling: PropTypes.bool
  };

  static defaultProps = {
    dragSpelling: false
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <span
        style={{
          top: `${this.props.topOffset}vh`
        }}
        onClick={this.props.onSkipClicked}
        className={[
          styles.skipPrompt,
          this.props.dragSpelling ? styles.dragSpelling : "",
          this.props.spelling ? styles.spelling : ""
        ].join(" ")}
      >
        Skip to {this.props.nextSection}
        <i
          className="fa fa-caret-right"
          style={{ marginLeft: 5 }}
          aria-hidden="true"
        />
      </span>
    );
  }
}
