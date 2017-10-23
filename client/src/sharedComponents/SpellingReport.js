import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'


import { Popover, OverlayTrigger } from 'react-bootstrap'



export default class CompReport extends React.Component {
  static propTypes = {
    spellingObj: PropTypes.object.isRequired,
    isInteractive: PropTypes.bool,
  };
  static defaultProps = {
    isInteractive: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      spellingObj: this.props.spellingObj,
      showSkippedWords: false,
    }
  }


  toggleShowSkippedWords = () => {
    this.setState({ showSkippedWords: !this.state.showSkippedWords })
  }



  toggleSpellingError = (sectionNum, wordIdx) => {

    if (!this.isStatusGradable(wordIdx)) {
      console.log(sectionNum)
      console.log(wordIdx)
      return 
    }

    let stateHolder = this.state.spellingObj 

    let arr = stateHolder.sections[String(sectionNum)].statusArr

    arr[wordIdx] = !arr[wordIdx]

    this.setState({ spellingObj: stateHolder })
  }



  isStatusGradable(wordIdx) {
    // is there an error + it's interactive? 
    return (this.state.spellingObj.words[wordIdx] !== this.state.spellingObj.responses[wordIdx] && this.props.isInteractive)
  }


  componentWillMount() {
    console.log('spellingObj: ', this.state.spellingObj)
  }



  renderWordColumn = (words, numResponses) => {
    let arr = []
    let skippedArr = [] 

    for (let i = 0, len = words.length; i < len; i++) {
      if (i < numResponses) {
        arr.push(<li className={styles.listElt} key={i}>{words[i]}</li>)
      }
      else { // it's a skipped word 
        skippedArr.push(<li className={[styles.listElt, styles.skippedWord].join(' ')} key={i}>{words[i]}</li>)
      }

    }

    if (this.state.showSkippedWords) {
      arr = arr.concat(skippedArr)
    }


    return (<div className={styles.fullColumn}>
              <h4 className={styles.columnTitle}>Words</h4>
              <ol className={[styles.unstyledList, styles.numberedList].join(' ')} > {arr} </ol>
            </div>)
  }

  renderResponsesColumn = (words, responses) => {
    let arr = []

    for (let i = 0, len = responses.length; i < len; i++) {
      arr.push(<li className={[styles.listElt, styles.studentResponse, (words[i] === responses[i] ? styles.goodMetric : ([styles.fairMetric, styles.wrong].join(' ')) ) ].join(' ')} key={i}>{responses[i]}</li>)
    }

    return (<div className={styles.fullColumn}>
              <h4 className={styles.columnTitle}>Student Responses</h4>
              <ol className={styles.unstyledList} > {arr} </ol>
            </div>)
  }


  getSymbol = (data, sectionNum, wordIdx) => {
    if (data === true) {
      return (<i onClick={ () => this.toggleSpellingError(sectionNum, wordIdx)} className={['fa fa-check', styles.goodMetric, (this.isStatusGradable(wordIdx) ? styles.clickable : '')].join(' ')} />)
    }

    if (data === null || data === 'NO_VALUE') {
      return (<span className={styles.emptyPhonetics}>{"—"}</span>)
    }

    if (data === false) {
      return (<i onClick={ () => this.toggleSpellingError(sectionNum, wordIdx)} className={['fa fa-times', styles.fairMetric, (this.isStatusGradable(wordIdx) ? styles.clickable : '')].join(' ')} />)
    }
  }

  renderPhoneticColumn = (statusArr, title, sectionNum, numResponses) => {
    let arr = []

    for (let i = 0, len = statusArr.length; i < len; i++) {
      if (i < numResponses) {
        arr.push(<li className={styles.listElt} key={i}>{this.getSymbol(statusArr[i], sectionNum, i)}</li>)
      }
    }

    return (<div className={styles.fullColumn}>
              <h4 className={styles.columnTitle}>{title}</h4>
              <ol className={styles.unstyledList} > {arr} </ol>
            </div>)

  }

  renderSections = () => {
    let arr = []

    for (let i = 1, len = this.state.spellingObj.numSections; i <= len; i++) {
      arr.push(this.renderPhoneticColumn(this.state.spellingObj.sections[String(i)].statusArr, this.state.spellingObj.sections[i].title, i, this.state.spellingObj.responses.length))
    }

    return arr 
  }


  render() {

    const popoverTop = (
      <Popover id="popover-positioned-top">
        <strong>Sorry!</strong> Rescoring developmental spelling is disabled for this demo.
      </Popover>
    );


    return (

      <div>

        <div className={styles.colsWrapper}>

          {
            this.renderWordColumn(this.state.spellingObj.words, this.state.spellingObj.responses.length)
          }

          {
            this.renderResponsesColumn(this.state.spellingObj.words, this.state.spellingObj.responses)
          }

          {
            this.renderSections()
          }          
        </div>


      { !this.state.showSkippedWords && (this.state.spellingObj.responses.length !== this.state.spellingObj.words.length) &&
        <span className={styles.toggleText} onClick={this.toggleShowSkippedWords}> See skipped words <i className={"fa fa-caret-down " + styles.caret} aria-hidden="true"></i>
        </span>
      }
      { this.state.showSkippedWords && (this.state.spellingObj.responses.length !== this.state.spellingObj.words.length) &&
        <span className={styles.toggleText} onClick={this.toggleShowSkippedWords}>Hide skipped words <i className={"fa fa-caret-up " + styles.caret} aria-hidden="true"></i>
        </span>
      }

      { !this.props.isInteractive &&
        <OverlayTrigger rootClose trigger="click" placement="top" overlay={popoverTop}>
          <span onClick={this.onShowRescoreModal} styles={{ marginLeft: 0 }} className={styles.spellingRescore}>Give a different score</span>
        </OverlayTrigger> 
      }


      </div>

    )
  }
}
