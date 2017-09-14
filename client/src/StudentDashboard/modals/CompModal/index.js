import PropTypes from 'prop-types';
import React from 'react';

import RectangleButton from '../../components/RectangleButton'

import styles from '../DoneModal/styles.css'
import myStyles from './styles.css'

import ButtonArray from '../subcomponents/ButtonArray'

import BaseModal from '../BaseModal'

import {
  ReaderStateOptions,
} from '../../types'



const THIS_MODAL_ID = 'modal-comp'

export default class CompModal extends React.Component {
  static propTypes = {
    onSeeBookClicked: PropTypes.func,
    onTurnInClicked: PropTypes.func,

    currentShowModal: PropTypes.string,
    onStartClicked: PropTypes.func,
    onStopClicked: PropTypes.func,
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

          { this.props.readerState !== ReaderStateOptions.inProgress &&

            <RectangleButton
              title='Start'
              subtitle='read and record'
              style={{ width: 200, height: 70, backgroundColor: '#249C44', marginLeft: 50, marginTop: 50 }}
              className={myStyles.compRecordButton}
              pulsatingArrow={true}
              disabled={this.props.disabled}
              onClick={this.props.onStartClicked}
            />

          }

          { this.props.readerState === ReaderStateOptions.inProgress &&
            <RectangleButton
              title='Stop'
              subtitle='recording'
              style={{ width: 200, height: 70, backgroundColor: '#982E2B' }}
              pulsatingArrow={true}
              disabled={this.props.disabled}
              onClick={this.props.onStopClicked}
            />
          }



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
