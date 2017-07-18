// @flow

import React from 'react';
import styles from './styles.css'

type props = {
  title: string,
  subtitle: string,
  onClick: Function,
  disabled: boolean,
  style: {},
};

function RectangleButton ({
  title = "",
  subtitle = "",
  onClick = function () { return null },
  disabled = false,
  style = {},
} : props) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={disabled ? styles.disabledButtonContainer : styles.rectangleButtonContainer}
      style={style}
      onClick={() => (!disabled && onClick())}
    >

      <div className={styles.rectangleButtonTitle}>
        {title}
      </div>

      {
        subtitle
        && (subtitle !== '')
        && <div className={styles.rectangleButtonSubtitle}> {subtitle} </div>
      }

    </div>
  )
}

export default RectangleButton

