import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import ModalHeader from '../subcomponents/ModalHeader'
import ButtonArray from '../subcomponents/ButtonArray'

export default class DoneModal extends React.Component {
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
      <div className={styles.doneModalContainer}>
        <div className={styles.doneModalHeaderWrapper}>
          <ModalHeader title="You're Done!" />
        </div>
        
        <div className={styles.doneModalButtonWrapper}>
          <ButtonArray
            titles={['Hear it', 'Turn it in']}
            images={['', '']} 
          />
        </div>


      </div>

       
    );
  }
}
