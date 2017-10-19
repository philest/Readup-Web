import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'


// const words = ['shaking', 'bagged', 'batter', 'running', 'bitter', 'hiking', 'tennis', 'gripped', 'warning', 'dinner', 'retain', 'happen', 'explode', 'disturb', 'review', 'survive', 'explain', 'return', 'complain', 'boring']
// const responses = ['shaking', 'bagged', 'batter', 'running', 'bitter', 'hiking', 'tennis', 'gripped', 'warning', 'dinner', 'retain', 'happen', 'explode', 'disturb', 'review', 'survive', 'explain', 'return', 'complain', 'boring']

const words = ['shaking', 'bagged', 'batter']
const responses = ['shaking', 'bagged', 'battir']
const titles = ['Words', 'Student Responses', '-ed/ing Endings', 'Doubling at Syllable Juncture', 'Long-Vowel Two-syllable Words', 'R-Controlled Two-Syllable Words' ]

const endings = [true, true, null]
const doubling = [false, false, null]
const long = [true, null, false]
const rControlled = [false, true, true]

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

  renderWordRows = (words, responses) => {
    let arr = []

    for (let i = 0, len = words.length; i < len; i++) {
      arr.push(
        <div className={styles.titleWrapper}>
          <h4 className={styles.columnTitle}>{words[i]}</h4>
          <h4 className={styles.columnTitle}>{responses[i]}</h4>
          <h4 className={styles.columnTitle}>{'x'}</h4>
          <h4 className={styles.columnTitle}>{'x'}</h4>
          <h4 className={styles.columnTitle}>{'x'}</h4>
          <h4 className={styles.columnTitle}>{'x'}</h4>

        </div>
      )
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
              <ol className={styles.unstyledList} > {arr} </ol>
            </div>)
  }

  renderResponsesColumn = (responses) => {
    let arr = []

    for (let i = 0, len = responses.length; i < len; i++) {
      arr.push(<li className={styles.listElt} key={i}>{responses[i]}</li>)
    }

    return (<div className={styles.fullColumn}>
              <h4 className={styles.columnTitle}>{titles[1]}</h4>
              <ol className={styles.unstyledList} > {arr} </ol>
            </div>)
  }


  renderResponsesColumn = (responses) => {
    let arr = []

    for (let i = 0, len = responses.length; i < len; i++) {
      arr.push(<li className={styles.listElt} key={i}>{responses[i]}</li>)
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
            this.renderResponsesColumn(responses)
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
