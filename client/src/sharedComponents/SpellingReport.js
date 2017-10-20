import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'





export default class SpellingReport extends React.Component {
  static propTypes = {
    spellingObj: PropTypes.object.isRequired,
  };
  static defaultProps = {
  };

  constructor(props) {
    super(props)
    this.state = {
      spellingObj: this.props.spellingObj 
    }
  }

  toggleSpellingError = (sectionNum, wordIdx) => {

    let stateHolder = this.state.spellingObj 

    let arr = stateHolder.sections[String(sectionNum)].statusArr

    arr[wordIdx] = !arr[wordIdx]

    this.setState({ spellingObj: stateHolder })
  }



  componentWillMount() {
    console.log('spellingObj: ', this.state.spellingObj)
  }


  renderColumnTitles = (titles) => {
    let arr = []

    for (let i = 0, len = titles.length; i < len; i++) {
      arr.push(<h4 className={styles.columnTitle}>{titles[i]}</h4>)
    }

    return arr

  }


  isCorrectSpelling(word, response) {
    return word === response 
  }


  renderWordColumn = (words) => {
    let arr = []

    for (let i = 0, len = words.length; i < len; i++) {
      arr.push(<li className={styles.listElt} key={i}>{words[i]}</li>)
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
      return (<i onClick={ () => this.toggleSpellingError(sectionNum, wordIdx)} className={['fa fa-check', styles.goodMetric, styles.clickable].join(' ')} />)
    }

    if (data === null) {
      return (<span className={styles.emptyPhonetics}>{"—"}</span>)
    }

    if (data === false) {
      return (<i onClick={ () => this.toggleSpellingError(sectionNum, wordIdx)} className={['fa fa-times', styles.fairMetric, styles.clickable].join(' ')} />)
    }
  }

  renderPhoneticColumn = (statusArr, title, sectionNum) => {
    let arr = []

    for (let i = 0, len = statusArr.length; i < len; i++) {
      arr.push(<li className={styles.listElt} key={i}>{this.getSymbol(statusArr[i], sectionNum, i)}</li>)
    }

    return (<div className={styles.fullColumn}>
              <h4 className={styles.columnTitle}>{title}</h4>
              <ol className={styles.unstyledList} > {arr} </ol>
            </div>)

  }

  renderSections = () => {
    let arr = []

    for (let i = 1, len = this.state.spellingObj.numSections; i <= len; i++) {
      arr.push(this.renderPhoneticColumn(this.state.spellingObj.sections[String(i)].statusArr, this.state.spellingObj.sections[i].title, i))
    }

    return arr 
  }


  render() {


    return (

      <div>

        <div className={styles.colsWrapper}>

          {
            this.renderWordColumn(this.state.spellingObj.words)
          }

          {
            this.renderResponsesColumn(this.state.spellingObj.words, this.state.spellingObj.responses)
          }

          {
            this.renderSections()
          }
        </div>

      </div>

    )
  }
}
