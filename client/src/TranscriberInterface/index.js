import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

import { Button, ButtonGroup, Alert, OverlayTrigger, Popover, Modal } from 'react-bootstrap'

import FormattedMarkupText from '../sharedComponents/FormattedMarkupText'
import { newFireflyEvaluationText } from '../sharedComponents/fireflyMarkup'
import { updateScoredText, markScored, markUnscorable, updateFluencyScore, getFluencyScore} from '../ReportsInterface/emailHelpers'

import InfoBar from '../ReportsInterface/components/InfoBar'
import questionCSS from '../ReportsInterface/components/Metric/styles.css'
import reportStyles from '../ReportsInterface/styles.css'
import {getAssessmentSavedTimestamp} from '../ReportsInterface/emailHelpers.js'
import { playSoundAsync } from '../StudentDashboard/audioPlayer'


const popoverBottom = (
  <Popover id="popover-positioned-bottom" className={questionCSS.myPopover} title="Fluency Rubric, by Fountas & Pinnell">
 
    <strong>0 - Unsatisfactory fluency</strong>
    <ul>
    <li>Primarily word-by-word</li>
    <li>No expressive interpretation</li>
    <li>No appropriate stress or pausing</li>
    </ul>

     <strong>1 - Limited fluency</strong>
     <ul>
      <li>Primarily two-word phrases</li>
      <li>Almost no expressive interpretation</li>
      <li>Almost no appropriate pausing or stress</li>
     </ul>

     <strong>2 - Satisfactory fluency</strong>
     <ul>
    <li>Primarily three- or four-word phrases</li>
    <li>Some smooth, expressive interpretation </li>
    <li>Mostly appropriate stress and pausing</li>
     </ul>

    <strong>3 - Excellent fluency</strong>
    <ul>
    <li>Primarily larger, meaningful phrases</li>
    <li>Mostly smooth, expressive interpretation</li>
    <li>Pausing and stress guided by meaning</li>
    </ul>

  </Popover>
);



export default class TranscriberInterface extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired, // this is passed from the Rails view
  };


  constructor(props, _railsContext) {
    super(props);
    this.state = { 
      evaluationTextData: JSON.parse(this.props.scoredText),
      highlightedParagraphIndex: null,
      highlightedWordIndex: null,
      highlightedIsSpace: null,
      showSubmitAlert: false,
      showSaveAlert: false,
      fluencyScore: null,
      hasSavedRecently: false,
      hasSeenAlert: this.props.seenUpdatePrior,
      showReadyForReviewModal: false,
      lastSaved: this.props.whenFirstSaved,
      prevLastSaved: this.props.whenFirstSaved,
    }
        this.tick = this.tick.bind(this);

        this.tick2 = this.tick2.bind(this);

  }

  componentWillMount() {
    document.addEventListener("keydown", this._handleKeyDown);

    // TODO refactor this into a controller prop 
    getFluencyScore(this.props.assessmentID).then(res => {
    this.setState({ fluencyScore: res })
    })

  }


  componentDidMount() {
    this.interval = setInterval(this.tick, 2000);
    this.interval2 = setInterval(this.tick2, 6000);

  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
    clearInterval(this.interval);
    clearInterval(this.interval2);

  }


  tick() {



      const isUpdated = this.assessmentSavedThisSession(this.props.assessmentID)
      const hasSavedRecently = this.state.hasSavedRecently
      const hasSeenAlert = this.state.hasSeenAlert

      console.log(`hasSavedRecently is ${hasSavedRecently}`)

      if (isUpdated && !hasSavedRecently && !hasSeenAlert) {
        playSoundAsync('/audio/complete.mp3')
        this.setState({ showReadyForReviewModal: true,
                        hasSeenAlert: true,
                      })
      }

  }

  tick2() {
    this.setState({ hasSavedRecently: false })
  }

  assessmentSavedThisSession(id) {

    let res = getAssessmentSavedTimestamp(id)
    res.then(res => {
      this.setState({ lastSaved: res })
    })


    let prevLastSaved = this.state.prevLastSaved
    let lastSaved = this.state.lastSaved

    console.log(`prevLastSaved is ${prevLastSaved}`)
    console.log(`lastSaved is ${lastSaved}`)


    if (prevLastSaved !== lastSaved) { // their timestamps are different
    console.log(`so an update!!!`)
      this.setState({ prevLastSaved: lastSaved })
      return true
    } else {
    console.log(`so nothing,,,`)

      return false
    }
  }



  _handleKeyDown = (event) => {

    // audio playback keys
    if (event.code === 'Space') {
      if (this.refs.audioPlayer.paused) {
        this.refs.audioPlayer.play()
      }
      else {
        this.refs.audioPlayer.pause()
      }
      
      event.preventDefault();
    }
    else if (event.code === 'ArrowLeft') {
      if (this.refs.audioPlayer.currentTime < 2) {
        this.refs.audioPlayer.currentTime = 0;
      }
      else {
        this.refs.audioPlayer.currentTime -= 2;
      }
    }
    else if (event.code === 'ArrowRight') {
      if (this.refs.audioPlayer.currentTime > this.refs.audioPlayer.duration - 2) {
        this.refs.audioPlayer.currentTime = this.refs.audioPlayer.duration
      }
      else {
        this.refs.audioPlayer.currentTime += 2;
      }
    }

    // grading keys
    // first ensure we have selected indices
    if (this.state.highlightedParagraphIndex == null || this.state.highlightedWordIndex == null) {
      return
    }

    var evaluationTextData = this.state.evaluationTextData


    if (event.code === 'KeyA') {

      const addText = window.prompt('Enter the added word')

      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].addAfterWord = addText


      this.setState({evaluationTextData: evaluationTextData})
    }
    else if (event.code === 'KeyS' && !this.state.highlightedIsSpace) {

      const subText = window.prompt('Enter the substituted word')

      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].substituteWord = subText
      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].wordDeleted = (subText != '')

      this.setState({evaluationTextData: evaluationTextData})
    }
    else if (event.code === 'KeyD' && !this.state.highlightedIsSpace) {
      // toggle
      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].wordDeleted = !evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].wordDeleted

      // kill any substitutions
      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].substituteWord = null

      
      this.setState({evaluationTextData: evaluationTextData})
    }
    else if (event.code === 'KeyD' && this.state.highlightedIsSpace) {
      // kill additions 
      evaluationTextData.paragraphs[this.state.highlightedParagraphIndex].words[this.state.highlightedWordIndex].addAfterWord = null
    }


    else if (event.code === 'KeyE') {
      // toggle
      if (this.state.highlightedParagraphIndex == evaluationTextData.readingEndIndex.paragraphIndex && this.state.highlightedWordIndex == evaluationTextData.readingEndIndex.wordIndex) {
        evaluationTextData.readingEndIndex.paragraphIndex = 9999
        evaluationTextData.readingEndIndex.wordIndex = 9999
      }
      else {
        evaluationTextData.readingEndIndex.paragraphIndex = this.state.highlightedParagraphIndex
        evaluationTextData.readingEndIndex.wordIndex = this.state.highlightedWordIndex
      }
      
     
     this.setState({evaluationTextData: evaluationTextData})
    }

    
  }


  _onMouseEnterWord = (paragraphIndex, wordIndex, isSpace) => {

    this.setState({
      highlightedParagraphIndex: paragraphIndex,
      highlightedWordIndex: wordIndex,
      highlightedIsSpace: isSpace,
    })

  }

  _onMouseLeaveWord = (paragraphIndex, wordIndex, isSpace) => {
    // TODO
    // is it possible for there to be a race condition where onMouseEnter of the target element is called before onMouseLeave of the previous element?
    // In that case, we'd accidentally null out the just selected here
    // Haven't observed that, but could eliminate below just to be safe
    this.setState({
      highlightedParagraphIndex: null,
      highlightedWordIndex: null,
      highlightedIsSpace: null,
    })
  }

  onFluencyScoreZeroClicked = () => {
    console.log('here i am 0')
    this.setState({fluencyScore: 0})
  }
  

  onFluencyScoreOneClicked = () => {
    console.log('here i am 1')
    this.setState({fluencyScore: 1})

  }

  onFluencyScoreTwoClicked = () => {
    console.log('here i am 2')
    this.setState({fluencyScore: 2})

  }

  onFluencyScoreThreeClicked = () => {
    console.log('here i am 3')
    this.setState({fluencyScore: 3})
  }




  onSubmitClicked = () => {
    updateScoredText(this.state.evaluationTextData, this.props.assessmentID);
    updateFluencyScore(this.state.fluencyScore, this.props.assessmentID)
    markScored(this.props.assessmentID)
    this.setState({showSubmitAlert: true})
  }


  onSaveClicked = () => {
    updateScoredText(this.state.evaluationTextData, this.props.assessmentID);
    updateFluencyScore(this.state.fluencyScore, this.props.assessmentID)
    this.setState({ hasSavedRecently: true,
                    showSaveAlert: true })
  }


  onUnscorableClicked = () => {
    markUnscorable(this.props.assessmentID);
    console.log("Done marking?")
    this.setState({showSubmitAlert: true})
  }


  handleAlertDismiss = () => {
    this.setState({showSubmitAlert: false,
                   showSaveAlert: false
                 })
  }

  render() {


    return (

      <div>
              <InfoBar
          title={ "Grading view"}
          extraInfo={"Your grading will be sent upon submit"}
          withScorer={false}
        />


      <div className={styles.transcriberContainer}>



        <div className={styles.gradingViewLabel}>Grading View</div>

        <div className={styles.nameHeading}>
          {this.props.name}'s Demo
        </div>
        <div className={styles.emailHeading}>
          {this.props.email}
        </div>
        <div className={styles.emailHeading}>
          {this.props.createdAt}
        </div>



        <audio controls ref={"audioPlayer"} className={styles.audioElement}>
          <source src={this.props.recordingURL} />
          <p>Playback not supported</p>
        </audio>
        
        


        <div className={styles.markupContainer}>
          <div className={styles.bookInfo}>
            <span className={styles.bookTitleHeading}>
              {this.props.bookTitle}
            </span>
            <span className={styles.bookLevelHeading}>
              {"Level " + this.props.bookLevel}
            </span>
          </div>


          <FormattedMarkupText
            paragraphs={this.state.evaluationTextData.paragraphs}
            endParagraphIndex={this.state.evaluationTextData.readingEndIndex.paragraphIndex}
            endWordIndex={this.state.evaluationTextData.readingEndIndex.wordIndex}
            isInteractive
            onMouseEnterWord={this._onMouseEnterWord}
            onMouseLeaveWord={this._onMouseLeaveWord}
            bookLevel={this.props.bookLevel}
          />



        </div>

        <div className={styles.fluencyContainer}>
          <div className={styles.bookInfo}>
            <span className={styles.bookTitleHeading}>
              Fluency Score
            </span>
            <span className={styles.bookLevelHeading}>
              Assign a score using the rubric 
              <OverlayTrigger defaultOverlayShown={true} trigger={['click']}   placement="bottom" overlay={popoverBottom}>
                <i className={["fa", "fa-question-circle", styles.questionIcon].join(" ")} aria-hidden={"true"} />
              </OverlayTrigger>

            </span>
          </div>
        </div> 


        <ButtonGroup className={styles.fluencyButtonGroup}>
          <Button active={this.state.fluencyScore === 0} href="#" onClick={this.onFluencyScoreZeroClicked}><strong>0</strong> - Unsatisfactory</Button>
          <Button active={this.state.fluencyScore === 1} href="#" onClick={this.onFluencyScoreOneClicked}><strong>1</strong> - Limited</Button>
          <Button active={this.state.fluencyScore === 2} href="#" onClick={this.onFluencyScoreTwoClicked}><strong>2</strong> - Satifscatory</Button>
          <Button active={this.state.fluencyScore === 3} href="#" onClick={this.onFluencyScoreThreeClicked}><strong>3</strong> - Excellent</Button>
        </ButtonGroup>


        <Button
          className={styles.submitButton}
          bsStyle={'primary'}
          bsSize={'large'}
          onClick={this.onSubmitClicked}
        >
          Submit
        </Button>

        <Button
          className={styles.unscorableButton}
          bsStyle={'default'}
          bsSize={'small'}
          active={this.state.hasSavedRecently}
          onClick={this.onSaveClicked}
        >
          Save edits
        </Button>


        <Button
          className={styles.unscorableButton}
          bsStyle={'danger'}
          bsSize={'small'}
          onClick={this.onUnscorableClicked}
        >
          Unscorable
        </Button>

       
       {this.state.showSubmitAlert &&
        <div className={styles.alertSuccess}>
          <Alert bsStyle="success" onDismiss={this.handleAlertDismiss}>
            <strong>Great!</strong> you can see the scored report <a target="_blank" href={`/reports/${this.props.userID}`}>here</a>.
          </Alert>
        </div>
      }

       {this.state.showSaveAlert &&
        <div className={styles.alertSuccess}>
          <Alert bsStyle="info" onDismiss={this.handleAlertDismiss}>
            <strong>Great!</strong> your partner was notified and sent all your edits.
          </Alert>
        </div>
      }


        <style type="text/css">{'.modal-backdrop.in { opacity: 0.7; } '}</style>
        <Modal show={this.state.showReadyForReviewModal} dialogClassName={reportStyles.modalSmall}>
          <Modal.Header>
            <Modal.Title bsClass={[reportStyles.pricingModalTitle, reportStyles.readyModalTitle].join(' ')}>
              Ready for review! 
            </Modal.Title>
          </Modal.Header>
          <Modal.Body bsClass={reportStyles.readyModalBody}>

            <div className={reportStyles.pricingFormWrapper}>
               <i className={["fa", "fa-check", reportStyles.readyCheck, reportStyles.pulse].join(" ")} aria-hidden={"true"} />
            </div>


              <a href={`/transcribe/${this.props.userID}/?seen_update_prior=true`}>
                <Button
                  className={[reportStyles.pricingFormButton, reportStyles.seeYourReportButton].join(' ')}
                  bsStyle={'success'}
                >
                  See report
                </Button>
              </a>

          </Modal.Body>
        </Modal>


        <div className={styles.Instructions}> 
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <hr/>

          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div><strong style={{fontSize: 18 + "px"}}>Training</strong></div>
          <div>&nbsp;</div>
          <div>For practice, create a scorer account on Literably and use their transcription training <a target="_blank" href="https://www.google.com/search?q=literably+scorer+sign+up&oq=literably+scorer+sign+up&aqs=chrome..69i57j69i60.2508j0j7&sourceid=chrome&ie=UTF-8">here</a></div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div><strong style={{fontSize: 18 + "px"}}>Instructions</strong></div>
          <div>&nbsp;</div>
          <div>To control the audio, use the following shortcuts:</div>
          <div>&nbsp;</div>
          <div><strong>Space</strong>: &nbsp;Sstart or stop the playback</div>
          <div><strong>Left Arrow</strong>: Go back 2 seconds&nbsp;</div>
          <div><strong>Right arrow</strong>: Go forward 2 seconds&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>As you listen, change the text by hovering over a word or a space and using one of these shortcuts:</div>
          <div>&nbsp;</div>
          <div><strong>A</strong>: Add</div>
          <div><strong>S</strong>:&nbsp;Substitute</div>
          <div><strong>D</strong>: Delete</div>
          <div><strong>E</strong>: End&nbsp;</div>
          <div>&nbsp;</div>
          <div>In more detail&hellip;</div>
          <div>&nbsp;</div>
          <div><strong>A</strong>: add a word</div>
          <div><strong>S</strong>:&nbsp;substitute a word that was misread</div>
          <div><strong>D</strong>: delete a word that was never read (or delete a previous edit)</div>
          <div><strong>E</strong>: end the grading where the student stopped reading.&nbsp;</div>
          <div>&nbsp;</div> 
          <div>&nbsp;</div> 
          <div><span style={{fontSize: 18 + "px"}}><strong>How to transcribe non-words</strong></span></div>
          <div>&nbsp;</div>
          <div>
          <div>When the reader says a non-word, you should transcribe the sounds phonetically. You may be unfamiliar with phonemes and phonetic transcription. A "phoneme" is the smallest unit of human speech - like "ch" or "b." All words are made up of phonemes. For example, the word "shin" has three phonemes: "sh" "i" and "n."</div>
          <div>&nbsp;</div>
          <div>We've adopted&nbsp;the phoneme chart below. You should study the phonemes and their spellings carefully. You may want to print the phoneme chart for reference. We've also prepared a&nbsp;video below&nbsp;to teach you the phoneme sounds and spellings.&nbsp;You must use these phonemes to transcribe non-words uttered; <strong>transcribing what you hear in a way that "looks right," but does not match the phonemes in the chart, is not acceptable.</strong></div>
          <div>&nbsp;</div>
          <div>When transcribing a non-word, you will simply string together the appropriate phoneme spellings. For example, if a child says "b" "l" "i-" "k," you should write "blik."</div>
          <div>&nbsp;</div>
          <div>Two clarifications:</div>
          <div>&nbsp;</div>
          <div>1. Sometimes, your phonetically transcribed non-word will coincidentally have the same spelling as a real word with a different pronunciation. In these case, just add a hyphen "-" to indicate that the spelling should be interpreted phonetically. For example, if you hear "i-" followed by "s," you should write "is-", "-is" or "i-s," because "is" will be interpreted as the word "is," which is pronounced "iz". Similarly, if you hear an "i-" phoneme all by itself, you should write "i-" not "i," because "i" will be interpreted as the word "I," which is pronounced "ie".</div>
          <div>&nbsp;</div>
          <div>2. Because there is some overlap between phonetic spellings (e.g. "e" and "ee"), there will be times when the same phonetic transcription could be interpreted in multiple ways. For example, the non-word "keer" could be interpreted as "k" "ee" "r" or as "k" "e" "e" "r." Our parser starts at the left and prioritizes two-letter phonemes ("ee") over one-letter phonemes ("e"), so "keer" will be interpreted as "k" "ee" "r." As a result, if you hear "k" "e" "e" "r," you should be sure to separate the&nbsp;e's&nbsp;using hyphens. You could write "k-e-e-r" "ke-er" "k-e-er" or "k-e-er." All that matters here is that the&nbsp;e's&nbsp;are separated.&nbsp;</div>
          </div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <hr/>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>          
          <embed src="https://s3-us-west-2.amazonaws.com/readup-now/website/Phonemes_Chart.pdf" width="600" height="575" display="inlineBlock" type='application/pdf'/>
          <iframe width="560" height="315" display="inlineBlock" src="https://www.youtube.com/embed/ulQC7LlpfE8?start=8" frameBorder="0" allowFullScreen></iframe>
       </div>


      </div>
      </div>
    );
  }
}
