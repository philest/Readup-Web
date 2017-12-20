import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

import { SectionOptions, FormatOptions, Format } from "../../types";
import { SKIPPED_SECTIONS_IN_WARMUP_LIST } from '../../sagas/index'

export function getSectionsListFromFormat(format) {
  if (format === FormatOptions.standard) {
    return [
      SectionOptions.oralReadingFullBook,
      SectionOptions.compOralFirst,
      SectionOptions.spelling
      ]
    };
  } else if (format === FormatOptions.stepFiveThroughEight) {
    return [
      SectionOptions.oralReadingPartialAtStart,
      SectionOptions.compOralFirst,
      SectionOptions.silentReadingPartialAtEnd,
      SectionOptions.compOralSecond,
      SectionOptions.spelling
    ]
  } else if (format === FormatOptions.stepNineThroughTwelve) {
    return [
      SectionOptions.silentReadingFullBook,
      SectionOptions.compWritten,
      SectionOptions.compOralFirst,
      SectionOptions.oralReadingPartialAtEnd,
      SectionOptions.spelling
    ]
  } else {
    return false;
    console.log(`format ${format} not detected`);
  }
}

export function getLabel(section) {

  if (section === SectionOptions.oralReadingFullBook) {
    return 'Reading'
  } else if (section === SectionOptions.oralReadingPartialAtStart) {
    return 'Reading 1'
  } else if (section === SectionOptions.oralReadingPartialAtEnd) {
    return 'Reading 2'
  } else if (section === SectionOptions.silentReadingFullBook) {
    return 'Reading'
  } else if (section === SectionOptions.silentReadingPartialAtEnd) {
    return 'Reading 2'
  } else if (section === SectionOptions.compOralFirst) {
    return 'Questions'
  } else if (section === SectionOptions.compOralSecond) {
    return 'Questions 2'
  } else if (section === SectionOptions.compWritten) {
    return 'Writing'
  } else if (section === SectionOptions.spelling) {
    return 'Spelling'
  } else {
    yield clog("WARN: Did not detect a section called :", section);
  }
}

function getLabelArr(format, isSignup) {

  if (isSignup) {
    return ['Names', 'Class', 'Books', 'Start']
  }

  let sectionList = getSectionsListFromFormat(format)
  let labelArr = [] 

  for (let i = 0; i < sectionList.length; i++) {
    let section = sectionList[i]

    if !(SKIPPED_SECTIONS_IN_WARMUP_LIST.includes(section) {
      labelArr.push(getLabel(section))
    }
  
  }

  return labelArr

} 

function getProgressNum(currentSection, format) {

  let sectionList = getSectionsListFromFormat(format)
  let numSections = sectionList.length

  let idx = sectionList.indexOf(currentSection);

  let percent =  (idx / numSections) * 100 

  return percent
}



export default class ProgressBar extends React.Component {
  static propTypes = {
    format: PropTypes.string,
    currentSection: PropTypes.string,
    isSignup: PropTypes.bool,
  };

  renderLabels = (format, isSignup) => {
    let labelHTMLarr = []

    let labelDataArr = getLabelArr(format, isSignup)

    for (let i = 0; i < labelDataArr.length; i++) {
      labelHTMLarr.push(
        <li className={styles.bullet}>{labelDataArr[i]}</li>
      )
    }

    return <ul className={styles.bulletList}>{labelHTMLarr}</ul>


  }

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {};
  }

  render() {
    let currentSection = this.props.currentSection
    let format = this.props.format
    let isSignup = this.props.isSignup

    return (
      <div className={styles.progress}>
        {this.renderLabels(format, isSignup)}
        <ProgressBar
          className={styles.myProgress}
          bsStyle="success"
          now={getProgressNum(currentSection, format)}
        />
      </div>
    );
  }
}
