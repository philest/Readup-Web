import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import MarkupWord from '../sharedComponents/MarkupWord'


export default class FormattedMarkupText extends React.Component {
  static propTypes = {
    paragraphs: PropTypes.arrayOf(PropTypes.string).isRequired,
    endParagraphIndex: PropTypes.number,
    endWordIndex: PropTypes.number,
    isInteractive: PropTypes.bool,
    onMouseEnterWord: PropTypes.func,
    onMouseLeaveWord: PropTypes.func,
  };

  static defaultProps = {
    isInteractive: false,
  };

  constructor(props) {
    super(props)
    console.log('CONSTRUCT')
    console.log(props)
    // console.log('CONSTRUCT')
  }

  render() {

    const endPindex = this.props.endParagraphIndex //shorthands for ease
    const endWindex = this.props.endWordIndex


    return (
      <div className={styles.textContainer}>

        {this.props.paragraphs.map((paragraph, pIndex) => (
          <div className={styles.textParagraph} key={paragraph.key}>

            {paragraph.words.map((wordDict, wIndex) => (

              <span key={paragraph.key + wIndex} className={styles.wordAndSpaceWrapper}>
                <MarkupWord
                  text={wordDict.word}
                  isSpace={false}
                  isEndWord={(pIndex === endPindex && wIndex === endWindex)}
                  grayedOut={(pIndex > endPindex || (pIndex == endPindex && wIndex > endWindex))}
                  strikethrough={wordDict.wordDeleted}
                  wordAbove={wordDict.substituteWord}
                  paragraphIndex={pIndex}
                  wordIndex={wIndex}
                  isInteractive={this.props.isInteractive}
                  onMouseEnter={this.props.onMouseEnterWord}
                  onMouseLeave={this.props.onMouseLeaveWord}
                  key={paragraph.key + '_' + pIndex + '_' + wIndex}
                />

                <MarkupWord
                  text={'SPACE'}
                  isSpace={true}
                  wordAbove={wordDict.addAfterWord}
                  paragraphIndex={pIndex}
                  wordIndex={wIndex}
                  isInteractive={this.props.isInteractive}
                  onMouseEnter={this.props.onMouseEnterWord}
                  onMouseLeave={this.props.onMouseLeaveWord}
                  key={paragraph.key + '_' + pIndex + '_' + wIndex + '_space'}
                />
              </span>
            ))}

          </div>
        ))}
      </div>

    );
  }
}