// @flow

import React from "react";
import styles from "./styles.css";

type props = {
  title: string,
  subtitle: string,
  onClick: Function,
  disabled: boolean,
  pulsatingArrow: boolean,
  style: {},
  inline: boolean,
  red: boolean,
  muted: boolean
};

function RectangleButton({
  title = "",
  subtitle = "",
  onClick = function() {
    return null;
  },
  disabled = false,
  pulsatingArrow = false,
  style = {},
  inline = false,
  red = false,
  muted = false
}: props) {
  return (
    <div
      className={[
        disabled ? styles.disabledButtonContainer : styles.arrowButtonContainer,
        red ? styles.red : "",
        muted ? styles.muted : ""
      ].join(" ")}
      style={style}
      onClick={() => !disabled && onClick()}
    >
      <div className={styles.arrowButtonTextContainer}>
        <div
          className={[
            styles.arrowButtonTitle,
            inline ? styles.arrowButtonInlineTitle : ""
          ].join(" ")}
        >
          {pulsatingArrow &&
            !disabled && (
              <i
                className={["fa fa-angle-right", styles.pulsatingArrow].join(
                  " "
                )}
              />
            )}
          {title}
        </div>

        {subtitle &&
          subtitle !== "" && (
            <div className={styles.arrowButtonSubtitle}> {subtitle} </div>
          )}
      </div>
    </div>
  );
}

export default RectangleButton;
