import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'


const words = ['shaking', 'bagged', 'batter', 'running', 'bitter', 'hiking', 'tennis', 'gripped', 'warning', 'dinner', 'retain', 'happen', 'explode', 'disturb', 'review', 'survive', 'explain', 'return', 'complain', 'boring']
const responses = ['shaking', 'bagged', 'bater', 'running', 'bitter', 'hiking', 'tennis', 'gripped', 'warning', 'dinner', 'retane', 'happen', 'explode', 'disturb', 'review', 'survive', 'explane', 'return', 'complain', 'boring']

const titles = ['Words', 'Student Responses', '-ed/ing Endings', 'Doubling at Syllable Juncture', 'Long-Vowel Two-syllable Words', 'R-Controlled Two-Syllable Words']

const isSpelledCorrectlyArr = [true, true, false, true, true, true, true, true, true, true, false, true, true, true, true, true, false, true, true, true]


const endings = [true, true, null, false, null, true, null, true, null, null, null, null, null, null, null, null, null, null, null, null]

const doubling = [null, null, true, null, true, null, true, null, null, true, null, true, null, null, null, null, null, null, null, null]

const long = [null, null, null, null, null, null, null, null, null, null, false, null, true, null, true, null, false, null, true, null]


const rControlled = [null, null, null, null, null, null, null, null, true, null, null, null, null, true, null, true, null, true, null, true]




export default class SpellingReport extends React.Component {
  static propTypes = {
  };
  static defaultProps = {
  };

  constructor(props) {
    super(props)
    this.state = {
    }
  }


  renderRow = () => {


  }


  renderColumnTitles = (titles) => {
    let arr = []

    for (let i = 0, len = titles.length; i < len; i++) {
      arr.push(<h4 className={styles.columnTitle}>{titles[i]}</h4>)
    }

    return arr

  }




  renderWordColumn = (words, colNum) => {
    let arr = []

    for (let i = 0, len = words.length; i < len; i++) {
      arr.push(<li className={styles.listElt} key={i}>{words[i]}</li>)
    }

    return (<div className={styles.fullColumn}>
              <h4 className={styles.columnTitle}>{titles[colNum - 1]}</h4>
              <ol className={[styles.unstyledList, styles.numberedList].join(' ')} > {arr} </ol>
            </div>)
  }

  renderResponsesColumn = (responses, isSpelledCorrectlyArr) => {
    let arr = []

    for (let i = 0, len = responses.length; i < len; i++) {
      arr.push(<li className={[styles.listElt, styles.studentResponse, (isSpelledCorrectlyArr[i] ? styles.goodMetric : ([styles.fairMetric, styles.wrong].join(' ')) ) ].join(' ')} key={i}>{responses[i]}</li>)
    }

    return (<div className={styles.fullColumn}>
              <h4 className={styles.columnTitle}>{titles[1]}</h4>
              <ol className={styles.unstyledList} > {arr} </ol>
            </div>)
  }


  getSymbol = (data) => {
    if (data === true) {
      return (<i className={['fa fa-check', styles.goodMetric].join(' ')} />)
    }

    if (data === null) {
      return (<span className={styles.emptyPhonetics}>{"—"}</span>)
    }

    if (data === false) {
      return (<i className={['fa fa-times', styles.fairMetric].join(' ')} />)
    }
  }

  renderPhoneticColumn = (phonetics, colNum) => {
    let arr = []

    for (let i = 0, len = phonetics.length; i < len; i++) {
      arr.push(<li className={styles.listElt} key={i}>{this.getSymbol(phonetics[i])}</li>)
    }

    return (<div className={styles.fullColumn}>
              <h4 className={styles.columnTitle}>{titles[colNum - 1]}</h4>
              <ol className={styles.unstyledList} > {arr} </ol>
            </div>)

  }


  render() {


    return (

      <div>

        <div className={styles.colsWrapper}>

          {
            this.renderWordColumn(words, 1)
          }

          {
            this.renderResponsesColumn(responses, isSpelledCorrectlyArr)
          }

          {
            this.renderPhoneticColumn(endings, 3)
          }

          {
            this.renderPhoneticColumn(doubling, 4)
          }

          {
            this.renderPhoneticColumn(long, 5)
          }

          {
            this.renderPhoneticColumn(rControlled, 6)
          }
        </div>

      </div>

    )
  }
}
