import PropTypes from 'prop-types';
import React from 'react';

import RectangleButton from '../../components/RectangleButton'

import styles from '../DoneModal/styles.css'
import myStyles from './styles.css'

import ButtonArray from '../subcomponents/ButtonArray'

import BaseModal from '../BaseModal'

import commonStyles from '../commonstyles.css'
import ModalHeader from '../subcomponents/ModalHeader'

import { playSound, playSoundAsync } from '../../audioPlayer.js'

import {
  ReaderStateOptions,
  PromptOptions,
  PromptTextOptions,
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
    close: PropTypes.func,
    disabled: PropTypes.bool,
    readerState: PropTypes.string,
    showSpinner: PropTypes.bool,
    question: PropTypes.object,
    includeDelay: PropTypes.bool,
    prompt: PropTypes.string,
    onExitLastQuestion: PropTypes.func,
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


  playQuestion = () => {

    if (this.props.readerState === ReaderStateOptions.playingBookIntro) {

      if (this.props.includeDelay) {
        setTimeout(playSound,
                   6500,
                   this.props.question.audioSrc)
      }
      else {
        playSound(this.props.question.audioSrc)
      }
    
    }

  }

  onHearQuestionAgainClicked = () => {

    if (!this.props.disabled) {
      playSoundAsync(this.props.question.audioSrc)
    }

  }

  onStop = () => {
    console.log('here i am... onSTOP')
    this.props.onStopClicked()

    setTimeout(
      this.props.onExitLastQuestion,
      2000)

  }

  render() {


    const talkingAboutStartButton = this.props.readerState === ReaderStateOptions.talkingAboutStartButton
    const talkingAboutStopButton = this.props.readerState === ReaderStateOptions.talkingAboutStopButton

    const talkingAboutButtons = talkingAboutStartButton || talkingAboutStopButton

    const done = this.props.readerState === ReaderStateOptions.done
    const inProgress = this.props.readerState === ReaderStateOptions.inProgress


    let title
    let subtitle

    if (this.props.question) {
      if (this.props.prompt === PromptOptions.awaitingPrompt) {
        title = this.props.question.title
        subtitle = this.props.question.subtitle
      } else {
        title = PromptTextOptions[this.props.prompt]
      }
    }




    return (

        <Modal onEntering={this.playQuestion} show={(this.props.currentShowModal === THIS_MODAL_ID)} onHide={this.props.close} className={myStyles.compModal}>
          <Modal.Header className={myStyles.compModalHeader}>
            <Modal.Title>{title}</Modal.Title>

            { subtitle &&
              <Modal.Title className={myStyles.compSubTitle}>{subtitle}</Modal.Title>
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
                onClick={this.onStop}
                showSpinner={this.props.showSpinner}
              />
            }




            <ButtonArray
              titles={['See book', "Hear again"]}
              images={['fa-book', 'fa-volume-up obscure']}
              actions={[this.props.onSeeBookClicked, this.onHearQuestionAgainClicked]}
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
