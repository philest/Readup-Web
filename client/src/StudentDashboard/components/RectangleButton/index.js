// @flow

import React from 'react';
import styles from './styles.css'

import ButtonArray from '../../modals/subcomponents/ButtonArray'

type props = {
  title: string,
  subtitle: string,
  onClick: Function,
  disabled: boolean,
  pulsatingArrow: boolean,
  partiallyDisabled: boolean,
  style: {},
  showSpinner: boolean,
  id: string,
};

function RectangleButton ({
  title = "",
  subtitle = "",
  onClick = function () { return null },
  disabled = false,
  partiallyDisabled = false,
  pulsatingArrow = false,
  style = {},
  showSpinner = false,
  id = "",

} : props) {


  let containerStyle

  if (disabled) {
    containerStyle = styles.disabledButtonContainer
  } else if (partiallyDisabled) {
    containerStyle = styles.partiallyDisabledButtonContainer
  } else {
    containerStyle = styles.rectangleButtonContainer
  }

  let isNavButton = (id === 'navigation-button')


  if (showSpinner) {
    // show the spinne
    return (

          <ButtonArray
            titles={['Thinking of next question...']}
            images={['fa-spinner faa-spin animated']}
            actions={[null]}
            inline={true}
            fontAwesome={true}
            enlargeFirst={true}
            disabled={disabled}
            showSpinner={showSpinner}
            secondaryAnimation={"faa-float"}
          />
    )

  }





  return (
    <div
      className={containerStyle}
      style={style}
      onClick={() => ((!disabled && !partiallyDisabled) && onClick())}
    >

      
      <div className={isNavButton ? styles.navRectangleButtonTitle : styles.rectangleButtonTitle}>
        { pulsatingArrow 
          && !disabled
          && <i className={['fa fa-angle-right', styles.pulsatingArrow].join(' ')}></i>
        }
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

