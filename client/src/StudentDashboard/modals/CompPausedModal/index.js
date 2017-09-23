import PropTypes from 'prop-types';
import React from 'react';

import styles from '../PausedModal/styles.css'
import commonStyles from '../commonstyles.css'
import compPausedStyles from './styles.css'


import ModalHeader from '../subcomponents/ModalHeader'
import RectangleButton from 'StudentDashboard/components/RectangleButton'
import ButtonArray from '../subcomponents/ButtonArray'

import BaseModal from '../BaseModal'

const THIS_MODAL_ID = 'modal-comp-paused'

export default class CompPausedModal extends React.Component {
  static propTypes = {
    onContinueClicked: PropTypes.func.isRequired,
    onStartOverClicked: PropTypes.func,  // TODO required?
    onDoneClicked: PropTypes.func,

    currentShowModal: PropTypes.string,
    modalType: PropTypes.string,
    showSpinner: PropTypes.bool,
    onExitLastQuestion: PropTypes.func,
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {  };
  }

  onStop = () => {
    console.log('here i am... onSTOP')
    this.props.onDoneClicked()

    setTimeout(
      this.props.onExitLastQuestion,
      1500)

  }


  render() {

    let firstIcons

    if (this.props.showSpinner) {
      firstIcons = 'fa-spinner fa-pulse'
    } else {
      firstIcons = 'fa-check'
    }


    return (
      <BaseModal title='Done with answer?' show={(this.props.currentShowModal === THIS_MODAL_ID)} modalType='info'>

        <div className={commonStyles.modalButtonArrayWrapper}>
          <ButtonArray
            titles={['Done', 'Say more']}
            images={[firstIcons, 'fa-play']}
            actions={[this.onStop, this.props.onContinueClicked]}
            enlargeFirst={true}
            fontAwesome={true}
            modalType={'info'}
            showSpinner={this.props.showSpinner}
          />
        </div>


      </BaseModal>


    );
  }
}
