import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import { Popover, OverlayTrigger } from 'react-bootstrap'

import MarkupWord from '../sharedComponents/MarkupWord'
// import { nickLines, sampleLines } from '../sharedComponents/MarkupWord'



let nickBookLines = [[11, 9], [10, 8], [11, 11, 2], [10, 7], [9,8], [15,13,6], [11,9,4], [10,9], [9,11,1], [8,5]]
let stepBookLines = [[7], [9, 2], [9, 1], [10], [13, 9], [11, 4]]
let sampleBookLines = [[12, 13, 11, 11, 10, 9, 13, 10, 6]]


let bookLines

let isMSVgraded


export function wasMSVgraded(paragraphs) {

  let result = false

  paragraphs.forEach( function(paragraph, paraIdx) {

    paragraph.words.forEach(function(wordDict, wordIdx) {
      
        if (wordHasError(wordDict) !== null) {
          let msvForWord = getMSVforWord(wordDict)
          if (msvForWord !== '') {
            result = true
          }
        }
    })
  })

  return result 

}



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

function getLineStartIdx(lineNum, lineLengthsArr) {

  let total = 0

  for (let i = 0; i < (lineNum - 1); i++) {
    total += lineLengthsArr[i]
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
    showSeeMore: PropTypes.bool,
    showMSV: PropTypes.bool,
    bookKey: PropTypes.string, 
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




  getMSVarr(lineIdx, paraIdx, lineLengthsArr) {
    let paragraph = this.props.paragraphs[paraIdx]

    let MSVarr = []

    let lineStartIdx = getLineStartIdx(lineIdx + 1, lineLengthsArr)

    let lineEndIdx = lineStartIdx + lineLengthsArr[lineIdx]

    let msvForWord

    paragraph.words.forEach(function(wordDict, wordIdx) {
      
      if (wordIdx <= lineEndIdx && wordIdx > lineStartIdx) {
        if (wordHasError(wordDict) !== null) {
          msvForWord = getMSVforWord(wordDict)
          MSVarr.push(msvForWord)
        }
      }

    })

    return MSVarr

  }

  renderMSVbook(bookLinesArr) {
    let paraArr = [] 

    let lineCounter = 1; 


    for (let i = 0; i < bookLinesArr.length; i++) {

      if (i <= this.props.endParagraphIndex) {
        paraArr.push(
          <div key={lineCounter} className={styles.msvPara}>
           {this.renderMSVparagraph(i, bookLinesArr[i], lineCounter)}
          </div>
        )
      }

      lineCounter += bookLinesArr[i].length
    }

    return paraArr
  }

  renderMSVparagraph(paraIdx, lineLengthsArr, lineCounter) {
    let arr = []

    for (let i = 0; i < lineLengthsArr.length; i++) {

      arr.push(
        <div key={lineCounter} >
          {
          this.renderMSVline(i + 1, paraIdx, lineLengthsArr, lineCounter)
          }
          <br />
        </div>,
      )

      lineCounter += 1 

    }

    return arr

  }


  renderMSVline(lineNum, paraIdx, lineLengthsArr, lineCounter) {


    let MSVarr = this.getMSVarr(lineNum - 1, paraIdx, lineLengthsArr)

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
        <span className={styles.lineNum}>{lineCounter}</span>
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


  componentWillMount() {

    console.log('mounting MSV?')

    if (this.props.isSample) {
      console.log('setting book lines to sample')
      bookLines = sampleBookLines
    }
    else if (this.props.bookKey === 'nick') {
      bookLines = nickBookLines
    }
    else if  (this.props.bookKey === 'step') {
      console.log('found STEP book in MSV')
      bookLines = stepBookLines
    }


    isMSVgraded = wasMSVgraded(this.props.paragraphs)

  }

  render() {

    const popoverTop = (
      <Popover id="popover-positioned-top">
        <strong>Sorry!</strong> Rescoring the running record is disabled for this demo.
      </Popover>
    );



    const endPindex = this.props.endParagraphIndex //shorthands for ease
    const endWindex = this.props.endWordIndex

    return (

      <div>

      { this.props.showMSV &&
        <div className={styles.rightSide}>
         
        { (isMSVgraded || this.props.isInteractive)  &&
          this.renderMSVbook(bookLines)
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
        <span className={styles.toggleText} onClick={this.toggleHideUnread}> See silent reading <i className={"fa fa-caret-down " + styles.caret} aria-hidden="true"></i>
        </span>
      }
      { !this.state.hideUnread && this.props.showSeeMore &&
        <span className={styles.toggleText} onClick={this.toggleHideUnread}> Hide silent reading <i className={"fa fa-caret-up " + styles.caret} aria-hidden="true"></i>
        </span>
      }

      { !this.props.isInteractive &&
        <OverlayTrigger rootClose trigger="click" placement="top" overlay={popoverTop}>
          <span onClick={this.onShowRescoreModal} className={styles.spellingRescore}>Give a different score</span>
        </OverlayTrigger> 
      }

      </div>


      </div>

    );
  }
}