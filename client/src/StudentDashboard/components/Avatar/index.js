import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

export default class Avatar extends React.Component {
  static propTypes = {
    fullName: PropTypes.string,
    color: PropTypes.string,
    large: PropTypes.bool
  };

  static defaultProps = {
    large: false
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
      <div className={styles.avatarWhole}>
        <div className={[styles.circle, styles.dropShadow].join(" ")}>
          <div className={[styles.innerCircle, styles.blue].join(" ")} />
          <span className={styles.name}>{this.props.fullName}</span>
        </div>
      </div>
    );
  }
}
