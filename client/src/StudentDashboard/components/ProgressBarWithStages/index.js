import PropTypes from "prop-types";
import React from "react";
import styles from "./styles.css";

import { SectionOptions, FormatOptions } from "../../types";

import { ProgressBar } from "react-bootstrap";

export function getSectionsListFromFormat(format) {
  if (format === FormatOptions.standard) {
    return [
      SectionOptions.oralReadingFullBook,
      SectionOptions.compOralFirst,
      SectionOptions.spelling
    ];
  } else if (format === FormatOptions.stepFiveThroughEight) {
    return [
      SectionOptions.oralReadingPartialAtStart,
      SectionOptions.compOralFirst,
      SectionOptions.silentReadingPartialAtEnd,
      SectionOptions.compOralSecond,
      SectionOptions.spelling
    ];
  } else if (format === FormatOptions.stepNineThroughTwelve) {
    return [
      SectionOptions.silentReadingFullBook,
      SectionOptions.compWritten,
      SectionOptions.compOralFirst,
      SectionOptions.oralReadingPartialAtEnd,
      SectionOptions.spelling
    ];
  } else if (format === "SIGNUP") {
    return [
      "NAME_PAGE",
      "ADD_CLASS_PAGE",
      "ASSIGN_BOOKS_PAGE",
      "LINK_INFO_PAGE"
    ];
  } else {
    return false;
    console.log(`format ${format} not detected`);
  }
}

export function getLabel(section) {
  if (section === SectionOptions.oralReadingFullBook) {
    return "Reading";
  } else if (section === SectionOptions.oralReadingPartialAtStart) {
    return "Reading 1";
  } else if (section === SectionOptions.oralReadingPartialAtEnd) {
    return "Reading 2";
  } else if (section === SectionOptions.silentReadingFullBook) {
    return "Reading";
  } else if (section === SectionOptions.silentReadingPartialAtEnd) {
    return "Reading 2";
  } else if (section === SectionOptions.compOralFirst) {
    return "Talking";
  } else if (section === SectionOptions.compOralSecond) {
    return "Talking 2";
  } else if (section === SectionOptions.compWritten) {
    return "Writing";
  } else if (section === SectionOptions.spelling) {
    return "Spelling";
  } else if (section === "NAME_PAGE") {
    return "Names";
  } else if (section === "ADD_CLASS_PAGE") {
    return "Class";
  } else if (section === "ASSIGN_BOOKS_PAGE") {
    return "Books";
  } else if (section === "LINK_INFO_PAGE") {
    return "Start";
  } else {
    return section;
    console.log(`section ${format} not detected`);
  }
}

function grabFirstWord(phrase) {
  return phrase.split(" ")[0];
}

function getLabelArr(format, isSignup) {
  // if (isSignup) {
  //   return ["Names", "Class", "Books", "Start"];
  // }

  let sectionList = getSectionsListFromFormat(format);
  let labelArr = [];

  for (let i = 0; i < sectionList.length; i++) {
    let section = sectionList[i];

    labelArr.push(getLabel(section));
  }

  return labelArr;
}

function getProgressNum(currentSection, format) {
  if (currentSection === SectionOptions.finished) {
    return 95;
  }

  let sectionList = getSectionsListFromFormat(format);
  let numSections = sectionList.length;

  console.log(`format ${format}, currentSection ${currentSection}`);
  console.log(`sectionList ${sectionList}, numSections ${numSections}`);

  let idx = sectionList.indexOf(currentSection);

  if (idx < 0) {
    idx = 0; // Always start at a baby slice
  }

  let initalSlice = 1 / (numSections * 2) * 100;

  let percent = idx / numSections * 100;

  return percent + initalSlice;
}

export default class ProgressBarWithStages extends React.Component {
  static propTypes = {
    format: PropTypes.string,
    currentSection: PropTypes.string,
    isSignup: PropTypes.bool
  };

  renderLabels = (format, isSignup) => {
    let labelHTMLarr = [];

    let labelDataArr = getLabelArr(format, isSignup);

    for (let i = 0; i < labelDataArr.length; i++) {
      labelHTMLarr.push(
        <li key={i} className={styles.bullet}>
          {grabFirstWord(labelDataArr[i])}
        </li>
      );
    }

    return <ul className={styles.bulletList}>{labelHTMLarr}</ul>;
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {};
  }

  render() {
    const currentSection = this.props.currentSection;
    const format = this.props.format;
    const isSignup = this.props.isSignup;

    console.log("currentSection: ", currentSection);

    return (
      <div
        className={[
          this.props.isSignup ? styles.progress : styles.navProgress
        ].join(" ")}
      >
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
