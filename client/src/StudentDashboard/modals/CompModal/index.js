import PropTypes from 'prop-types';
import React from 'react';

import RectangleButton from '../../components/RectangleButton'

import styles from '../DoneModal/styles.css'
import myStyles from './styles.css'

import ButtonArray from '../subcomponents/ButtonArray'

import BaseModal from '../BaseModal'

import commonStyles from '../commonstyles.css'
import ModalHeader from '../subcomponents/ModalHeader'


import {
  ReaderStateOptions,
} from '../../types'

import { Modal, Panel } from 'react-bootstrap'



const THIS_MODAL_ID = 'modal-comp'

export default class CompModal extends React.Component {
  static propTypes = {
    onSeeBookClicked: PropTypes.func,
    onTurnInClicked: PropTypes.func,

    currentShowModal: PropTypes.string,
    onStartClicked: PropTypes.func,
    onStopClicked: PropTypes.func,
    onHearQuestionAgainClicked: PropTypes.func,
    close: PropTypes.func,
    disabled: PropTypes.bool,
    readerState: PropTypes.string,
    showSpinner: PropTypes.bool,
    question: PropTypes.object,
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      showModal: true,
    };
  }






  render() {


    let talkingAboutStartButton = this.props.readerState === ReaderStateOptions.talkingAboutStartButton
    let talkingAboutStopButton = this.props.readerState === ReaderStateOptions.talkingAboutStopButton

    let talkingAboutButtons = talkingAboutStartButton || talkingAboutStopButton

    let done = this.props.readerState === ReaderStateOptions.done
    let inProgress = this.props.readerState === ReaderStateOptions.inProgress


    let questionTitle = this.props.question.title
    let questionSubtitle = this.props.question.subtitle




    return (

        <Modal show={(this.props.currentShowModal === THIS_MODAL_ID)} onHide={this.props.close} className={myStyles.compModal}>
          <Modal.Header className={myStyles.compModalHeader}>
            <Modal.Title>{questionTitle}</Modal.Title>

            { questionSubtitle &&
              <Modal.Title className={myStyles.compSubTitle}>{questionSubtitle}</Modal.Title>
            }

          </Modal.Header>
          <Modal.Body className={myStyles.compModalBody}>
            { (!inProgress && !done && !talkingAboutStopButton) &&

              <RectangleButton
                title="Start"
                subtitle="record answer"
                style={{ width: 200, height: 70, backgroundColor: '#5cb85c', borderColor: '#4cae4c' }}
                className={myStyles.compRecordButton}
                pulsatingArrow={true}
                disabled={this.props.disabled && !talkingAboutStartButton}
                partiallyDisabled={talkingAboutStartButton}
                onClick={this.props.onStartClicked}
                showSpinner={this.props.showSpinner}
              />

            }

            { (inProgress || done || talkingAboutStopButton) &&
              <RectangleButton
                title='Stop'
                subtitle='recording'
                style={{ width: 200, height: 70, backgroundColor: '#982E2B' }}
                pulsatingArrow={true}
                partiallyDisabled={talkingAboutStopButton}
                disabled={this.props.disabled && !talkingAboutStopButton}
                onClick={this.props.onStopClicked}
                showSpinner={this.props.showSpinner}
              />
            }




            <ButtonArray
              titles={['See book', "Hear again"]}
              images={['fa-book', 'fa-volume-up obscure']}
              actions={[this.props.onSeeBookClicked, this.props.onHearQuestionAgainClicked]}
              inline={true}
              fontAwesome={true}
              enlargeFirst={true}
              disabled={this.props.disabled}
            />

          



          </Modal.Body>
        </Modal>


    );
  }
}
