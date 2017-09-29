import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import MarkupWord from '../sharedComponents/MarkupWord'


export default class FormattedMarkupText extends React.Component {
  static propTypes = {
    paragraphs: PropTypes.arrayOf(PropTypes.object).isRequired,
    endParagraphIndex: PropTypes.number,
    endWordIndex: PropTypes.number,
    isInteractive: PropTypes.bool,
    onMouseEnterWord: PropTypes.func,
    onMouseLeaveWord: PropTypes.func,
    bookLevel: PropTypes.string,
    isSample: PropTypes.bool,
    showSeeMore: PropTypes.bool
  };
  static defaultProps = {
    isInteractive: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      hideUnread: true,
    }


    console.log('CONSTRUCT')
    console.log(props)
    // console.log('CONSTRUCT')
  }

  toggleHideUnread = () => {
    this.setState({hideUnread: !this.state.hideUnread})
  }

  render() {

    const endPindex = this.props.endParagraphIndex //shorthands for ease
    const endWindex = this.props.endWordIndex


    return (

      <div>

      <div className={styles.rightSide}>
       
        <div className={styles.rightBlockContainer}>
          <span className={styles.lineNum}>1</span>
          <div className={styles.rightBlock}>
            <span className={styles.msv}>MSV</span>
          </div>
        </div>

        <br/>

        <div className={styles.rightBlockContainer}>
           <span className={styles.lineNum}>1</span>

          <div className={styles.rightBlock}>
            <span className={styles.msv}>MSV</span>
          </div>
        </div>

      </div>

      <div className={(this.props.bookLevel >= "I") ? styles.textContainerLarge : styles.textContainer}>

        {this.props.paragraphs.map((paragraph, pIndex) => (
          <div className={(pIndex > endPindex) ? styles.textParagraphGrayedOut: styles.textParagraph} key={paragraph.key} style={{display: ((pIndex > endPindex) && this.state.hideUnread)  ? "none" : "block"}}>

            {paragraph.words.map((wordDict, wIndex) => (

              <span key={paragraph.key + wIndex} className={styles.wordAndSpaceWrapper}>
                <MarkupWord 
                  text={wordDict.word}
                  isSpace={false}
                  isEndWord={(pIndex == endPindex && wIndex == endWindex)}
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

      { this.state.hideUnread && this.props.showSeeMore &&
        <span className={styles.toggleText} onClick={this.toggleHideUnread}> See more <i className={"fa fa-caret-down " + styles.caret} aria-hidden="true"></i>
        </span>
      }
      { !this.state.hideUnread && this.props.showSeeMore &&
        <span className={styles.toggleText} onClick={this.toggleHideUnread}> See Less <i className={"fa fa-caret-up " + styles.caret} aria-hidden="true"></i>
 </span>
      }

      </div>


      </div>

    );
  }
}