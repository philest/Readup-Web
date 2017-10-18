import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'


// const words = ['shaking', 'bagged', 'batter', 'running', 'bitter', 'hiking', 'tennis', 'gripped', 'warning', 'dinner', 'retain', 'happen', 'explode', 'disturb', 'review', 'survive', 'explain', 'return', 'complain', 'boring']
// const responses = ['shaking', 'bagged', 'batter', 'running', 'bitter', 'hiking', 'tennis', 'gripped', 'warning', 'dinner', 'retain', 'happen', 'explode', 'disturb', 'review', 'survive', 'explain', 'return', 'complain', 'boring']

const words = ['shaking', 'bagged', 'batter']
const responses = ['shaking', 'bagged', 'batter']
const titles = ['Words', 'Student Responses', '-ed/ing Endings', 'Doubling at Syllable Juncture', 'Long-Vowel Two-syllable Words', 'R-Controlled Two-Syllable Words' ]


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


  render() {


    return (

      <div> 
        <div className={styles.titleWrapper}>
          {

            this.renderColumnTitles(titles)
          }
        </div>

        {
          this.renderWordRows(words, responses)
        }

      </div>

    )
  }
}
