import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import ModalHeader from '../subcomponents/ModalHeader'
import ButtonArray from '../subcomponents/ButtonArray'
import RectangleButton from '../../RectangleButton'

export default class MicModal extends React.Component {
  static propTypes = {
    
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {  };
  }

  render() {
    return (
      <div className={styles.micModalContainer}>
        <div className={styles.micModalHeaderWrapper}>
          <ModalHeader title="Mic not working!" />
        </div>

        <div className={styles.micModalFixWrapper}>
          <h4 style={{fontWeight: 'bold'}}>How to fix</h4>
          <p> <span style={{fontWeight: 'bold'}}>1.</span> Plug it in!</p>
          <p> <span style={{fontWeight: 'bold'}}>2.</span> Speak up!</p>
        </div>

        <div className={styles.micModalStartOverButtonWrapper}>
          <RectangleButton 
            className={styles.micModalStartOverButton}
            title="Start over"
            style={{ width: 200, height: 65, backgroundColor: 'green' }}
          />
        </div>


      </div>

       
    );
  }
}
