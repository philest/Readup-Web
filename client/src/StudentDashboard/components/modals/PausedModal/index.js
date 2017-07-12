import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import ModalHeader from '../subcomponents/ModalHeader'
import RectangleButton from '../../RectangleButton'
import ButtonArray from '../subcomponents/ButtonArray'

export default class PausedModal extends React.Component {
  static propTypes = {
    titles: PropTypes.arrayOf(PropTypes.string).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
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
      <div className={styles.pausedModalContainer}>
        <div className={styles.pausedModalHeaderWrapper}>
          <ModalHeader title="Paused" />
        </div>

        <div className={styles.pausedModalContinueButtonWrapper}>
          <RectangleButton 
            className={styles.pausedModalContinueButton}
            title="Continue!"
            style={{ width: 200, height: 65, backgroundColor: 'green' }}
          />
        </div>
        
        <div className={styles.pausedModalButtonArrayWrapper}>
          <ButtonArray
            titles={['Start over', 'Turn it in']}
            images={['', '']} 
          />
        </div>


      </div>

       
    );
  }
}
