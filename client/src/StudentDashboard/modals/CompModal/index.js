import PropTypes from 'prop-types';
import React from 'react';
import styles from '../DoneModal/styles.css'

import ModalHeader from '../subcomponents/ModalHeader'
import ButtonArray from '../subcomponents/ButtonArray'

import BaseModal from '../BaseModal'

const THIS_MODAL_ID = 'modal-comp'

export default class CompModal extends React.Component {
  static propTypes = {
    onSeeBookClicked: PropTypes.func,
    onTurnInClicked: PropTypes.func,

    currentShowModal: PropTypes.string,
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
       <BaseModal title="Comprehension!" show={(this.props.currentShowModal === THIS_MODAL_ID)}>
        <div className={styles.doneModalButtonWrapper}>
          <ButtonArray
            titles={['test1', 'test2']}
            images={['/images/dashboard/finish-icon-green.png', '/images/dashboard/hear-it-icon.png']}
            actions={[this.props.onTurnInClicked, this.props.onSeeBookClicked]}
            enlargeFirst={true}
          />
        </div>
      </BaseModal>
    );
  }
}
