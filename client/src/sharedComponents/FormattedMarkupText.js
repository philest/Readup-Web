import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import MarkupWord from '../sharedComponents/MarkupWord'

let wordsOnEachLine = [12, 13, 11, 11, 10, 9, 13, 10, 6]

function getMSVforWord(wordDict) {
 

    let msvForWord = ''

    if (wordDict.mTypeError) {
      msvForWord += 'M'
    }

    if (wordDict.sTypeError) {
      msvForWord += 'S'
    }

    if (wordDict.vTypeError) {
      msvForWord += 'V'
    }

    return msvForWord

}

function getLineStartIdx(lineNum) {

  let total = 0

  for (let i = 0; i < (lineNum - 1); i++) {
    total += wordsOnEachLine[i]
  }

  return (total - 1)


}



function wordHasError(wordDict) {

  return (wordDict.wordDeleted || wordDict.substituteWord || wordDict.addAfterWord)

}

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




  // paragraph one only
  // first sentence only 
  getMSVarr(lineIdx, paraIdx) {
    let paragraph = this.props.paragraphs[0]

    let MSVarr = []

    let lineStartIdx = getLineStartIdx(lineIdx + 1)

    let lineEndIdx = lineStartIdx + wordsOnEachLine[lineIdx]

    let msvForWord

    paragraph.words.forEach(function(wordDict, wordIdx) {
      
      if (wordIdx < lineEndIdx && wordIdx > lineStartIdx) {
        if (wordHasError(wordDict) !== null) {
          msvForWord = getMSVforWord(wordDict)
          MSVarr.push(msvForWord)
        }
      }

    })

    return MSVarr

  }


  renderOneMSV(lineNum) {


    let MSVarr = this.getMSVarr(lineNum - 1, 0)

    const htmlMSVarr = []

    for (let i = 0; i < MSVarr.length; i++) {

      if (MSVarr[i] === '') {
        htmlMSVarr.push(<span key={i} className={[styles.msv, styles.emptyMSV].join(' ')}>{"—"}</span>
        )
      }
      else {
        htmlMSVarr.push(<span key={i} className={styles.msv}>{MSVarr[i]}</span>
        )
      }
    }

    return (
      <div className={styles.rightBlockContainer}>
        <span className={styles.lineNum}>{lineNum}</span>
        <div className={styles.rightBlock}>
          <div className={styles.msvContainer}>
            {
              htmlMSVarr
            }
          </div>

        </div>
      </div>
    )
  }

  render() {

    const endPindex = this.props.endParagraphIndex //shorthands for ease
    const endWindex = this.props.endWordIndex


    return (

      <div>

      { this.props.isSample &&
        <div className={styles.rightSide}>
         
         {
            this.renderOneMSV(1)
         }


          <br/>

         {
            this.renderOneMSV(2)
         }

          <br/>

         {
            this.renderOneMSV(3)
         }


          <br/>

         {
            this.renderOneMSV(4)
         }


          <br/>

        {
            this.renderOneMSV(5)
         }

          <br/>

         {
            this.renderOneMSV(6)
         }

          <br/>

         {
            this.renderOneMSV(7)
         }


          <br/>

         {
            this.renderOneMSV(8)
         }


          <br/>

         {
            this.renderOneMSV(9)
         }

        </div> 
      }

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