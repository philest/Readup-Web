// @flow

import React from "react";
import styles from "./styles.css";
import css from "../NavigationBar/styles.css";

import ButtonArray from "../../modals/subcomponents/ButtonArray";

type props = {
  title: string,
  subtitle: string,
  onClick: Function,
  disabled: boolean,
  pulsatingArrow: boolean,
  pulsatingCircle: boolean,
  partiallyDisabled: boolean,
  style: {},
  showSpinner: boolean,
  id: string,
  showPrompting: boolean,
  isLarge: boolean,
  isGreen: boolean,
  isRed: boolean
};

function RectangleButton({
  title = "",
  subtitle = "",
  onClick = function() {
    return null;
  },
  disabled = false,
  partiallyDisabled = false,
  pulsatingArrow = false,
  pulsatingCircle = false,
  style = {},
  showSpinner = false,
  id = "",
  showPrompting = false,
  isLarge = false,
  isGreen = false,
  isRed = false
}: props) {
  let containerStyle;

  if (disabled && isLarge) {
    containerStyle = styles.largeDisabledButtonContainer;
  } else if (partiallyDisabled && isLarge) {
    containerStyle = styles.largePartiallyDisabledButtonContainer;
  } else if (disabled) {
    containerStyle = styles.disabledButtonContainer;
  } else if (partiallyDisabled) {
    containerStyle = styles.partiallyDisabledButtonContainer;
  } else if (isLarge) {
    containerStyle = styles.largeRectangleButtonContainer;
  } else {
    containerStyle = styles.rectangleButtonContainer;
  }

  if (isGreen) {
    containerStyle = [containerStyle, styles.greenButton].join(" ");
  } else if (isRed) {
    containerStyle = [containerStyle, styles.redButton].join(" ");
  }

  let isNavButton = id === "navigation-button";

  if (showSpinner) {
    // show the spinne
    return (
      <ButtonArray
        titles={
          showPrompting
            ? ["Thinking of next question..."]
            : ["Prompting disabled for this demo..."]
        }
        images={["fa-spinner faa-spin animated"]}
        actions={[null]}
        inline={true}
        fontAwesome={true}
        enlargeFirst={true}
        disabled={disabled}
        showSpinner={showSpinner}
        secondaryAnimation={"faa-float"}
      />
    );
  }

  let titleClass = [
    isLarge ? styles.largeRectangleButtonTitle : styles.rectangleButtonTitle
  ];

  if (isNavButton) {
    titleClass.push(styles.navRectangleButtonTitle);
  }

  if (subtitle === "") {
    titleClass.push(styles.singleTitle);
  }

  return (
    <div
      className={containerStyle}
      style={style}
      onClick={() => !disabled && !partiallyDisabled && onClick()}
    >
      <div className={titleClass.join(" ")}>
        {pulsatingCircle && <div className={styles.pulsatingCircle}> </div>}

        {pulsatingArrow &&
          !disabled && (
            <i
              className={["fa fa-angle-right", styles.pulsatingArrow].join(" ")}
            />
          )}
        {title}
      </div>

      {subtitle &&
        subtitle !== "" && (
          <div className={styles.rectangleButtonSubtitle}> {subtitle} </div>
        )}
    </div>
  );
}

export default RectangleButton;
