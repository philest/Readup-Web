import PropTypes from 'prop-types';
import React from 'react';
import css from './styles.css'
import styles from '../../styles.css'
import { Modal, Popover, OverlayTrigger } from 'react-bootstrap'


import classNames from 'classnames/bind';

let cx = classNames.bind(styles);
let book 





const fluencyLibrary = {
  0: {
    title: "Unsatisfactory fluency",
    details: (
              <div className={styles.fluencyDetails}>
                <span className={styles.detail}>Primarily word-by-word</span>
                <span className={styles.detail}>No expressive interpretation</span>
                <span className={styles.detail}>No appropriate stress or pausing</span>
              </div> 
              ),
    },
  1: {
    title: "Limited fluency",
    details: (
              <div className={styles.fluencyDetails}>
                <span className={styles.detail}>Primarily two-word phrases</span>
                <span className={styles.detail}>Almost no expressive interpretation</span>
                <span className={styles.detail}>Almost no appropriate pausing or stress</span>
              </div> 
              ),
   },
  2: {
    title: "Satisfactory fluency",
    details: (
              <div className={styles.fluencyDetails}>
                <span className={styles.detail}>Primarily three- or four-word phrases</span>
                <span className={styles.detail}>Some smooth, expressive interpretation</span>
                <span className={styles.detail}>Mostly appropriate stress and pausing</span>
              </div> 
              ),
  },
 3: {
    title: "Excellent fluency",
    details: (
              <div className={styles.fluencyDetails}>
                <span className={styles.detail}>Primarily larger, meaningful phrases</span>
                <span className={styles.detail}>Mostly smooth, expressive interpretation</span>
                <span className={styles.detail}>Pausing and stress guided by meaning</span>
              </div> 
              ),
  },

}

const playbookDict = {

  visual:  <span key={1} className={styles.detail}> <span className={styles.poorMetric}>Visual Cues (Accuracy):  </span>Build self-monitoring based on checking first letters and pictures</span> ,
  structure:  <span key={2}  className={styles.detail}> <span className={styles.poorMetric}>Structure cues (Accuracy):  </span>Build self-monitoring based on checking if the sentence sounds right</span>,
  meaning:  <span key={3}  className={styles.detail}> <span className={styles.poorMetric}>Meaning cues (Accuracy):  </span>Build self-monitoring based on checking if the sentence makes sense</span>,
  inferential: <span  key={4} className={styles.detail}> <span className={styles.fairMetric}>Inferential Comp:  </span>Focus on solving inferential questions by checking back at the text</span>, 
  factual: <span key={5}  className={styles.detail}> <span className={styles.fairMetric}>Factual Comp:  </span>Focus on solving factual questions by practicing retelling texts</span>, 
  critical: <span  key={6} className={styles.detail}> <span className={styles.fairMetric}>Critical Thinking:  </span>Focus on solving critical thinking questions by making and checking predictions about the text</span>, 
  fluency:  <span key={7} className={styles.detail}> <span className={styles.fairMetric}>Fluency:  </span>Practice with high frequency words to build recognition</span>,
  criticalthinking: <span key={8}  className={styles.detail}> <span className={styles.fairMetric}>Comp:  </span>Focus on solving critical thinking questions by making and checking predictions about the text</span>, 
  nothing: <span key={9}  className={styles.detail}> No moves added yet. Check back soon!</span>,
}

let movesSet = new Set();





export default class Metric extends React.Component {
  static propTypes = {
    number: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    denominator: PropTypes.number,
    showDetails: PropTypes.bool,
    compSubtotals: PropTypes.array,
    isSample: PropTypes.bool,
    msvSubtotals: PropTypes.array,
    showPlaybook: PropTypes.bool,
    onPlaybookClose: PropTypes.func,
    brand: PropTypes.string,
  };

  static defaultProps = {
    showDetails: false,
    brand: 'FP',
 }


  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
    }
    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes

  }





  renderCompDetails = () => {
    let detailArr = []

    for (let i = 0; i < this.props.compSubtotals.length; i++) {
      detailArr.push(
        <span key={i} className={styles.detail}>{this.props.compSubtotals[i][0]}: <span className={this.getGeneralColorClass(this.props.compSubtotals[i][2])}>{this.props.compSubtotals[i][1]}</span></span>
      )  
 
      if (this.getGeneralColorClass(this.props.compSubtotals[i][2]) !== styles.goodMetric) {
        movesSet.add(playbookDict[String(this.props.compSubtotals[i][0]).replace(/ /g,'').toLowerCase()])
        console.log(`just added ${String(this.props.compSubtotals[i][0])}`)
      }


    }

    return detailArr
  }


  renderAccDetails = () => {
    let detailArr = [] 
    for (let i = 0; i < 3; i++) {
      detailArr.push(
        <span key={i} className={styles.detail}>{this.props.msvSubtotals[i][0]}:  <span className={this.getGeneralColorClass(this.props.msvSubtotals[i][2])}>{this.props.msvSubtotals[i][3]}</span></span>
      )

      if (this.props.showDetails && this.getGeneralColorClass(this.props.msvSubtotals[i][2]) !== styles.goodMetric) {
        movesSet.add(playbookDict[String(this.props.msvSubtotals[i][0]).toLowerCase()])
        console.log(`just added ${String(this.props.msvSubtotals[i][0])}`)
      }


    }

    return detailArr
  }


  getGeneralColorClass = (percent) => {
    let genColorClass = cx({
      goodMetric: percent >= .66,
      fairMetric: percent < .66 && percent >= .5, 
      poorMetric: percent < .5,
    });


    return genColorClass
  }




  componentWillMount() {
    book = this.props.book

    if (this.props.label === 'Fluency' && this.props.number <= 2) {
        movesSet.add(playbookDict['fluency'])
         console.log(`just added fluency`)
    }
  }

  getAccColor(acc) {
    
    if (acc >= 95) {
      return 'good'
    } else if (acc >= 89) {
      return 'fair'
    } else {
      return 'poor'
    }

  }

  getFluencyColor(score) {

    if (score >= 3) {
      return 'good'
    } else if (score >= 2) {
      return 'fair'
    } else {
      return 'poor'
    }

  }

  getWCPMColor(wcpm) {
    if (wcpm >= 51) {
      return 'good'
    } else if (wcpm >= 30) {
      return 'fair'
    } else {
      return 'poor'
    }

  }


  getCompColor(comp, denominator) {

    if (denominator === 9) {

      if (comp >= 8) {
        return 'good'
      } else if (comp >= 5) {
        return 'fair'
      } else {
        return 'poor'
      }
    } else if (denominator === 3) {

      if (comp >= 2) {
        return 'good'
      } else if (comp >= 1) {
        return 'fair'
      } else {
        return 'poor'
      }
    } else if (denominator === 6) {

      if (comp >= 4) {
        return 'good'
      } else if (comp >= 3) {
        return 'fair'
      } else {
        return 'poor'
      }

    }



  }




  renderMovesSet = () => {

      console.log('hereeee')
    if (movesSet.size > 0) {
      return movesSet
    }
    else {
      return playbookDict.nothing
    }
  }




  render() {


    const accPopover = (
      <Popover id="popover-positioned-bottom" title="MSV cues used" className={[css.myPopover, css.compPopover].join(' ')}>
     
        {this.props.isSample &&
          <div>
          <span className={styles.detail}>Meaning: <span className={styles.fairMetric}>5/15</span></span>
          <span className={styles.detail}>Structure: <span className={styles.goodMetric}>10/15</span></span>
          <span className={styles.detail}>Visual: <span className={styles.goodMetric}>6/15</span></span>
          <hr className={styles.myHr}/>
          <span className={styles.detail}>Self-corrected: <span className={styles.fairMetric}>20%</span></span>
          </div>
        }

        {!this.props.isSample && this.props.label === 'Accuracy' &&

          this.renderAccDetails()
        }

      </Popover>
    );



    const lastPopover = (
      <Popover id="popover-positioned-bottom" title="Breakdown" className={[css.myPopover, css.compPopover].join(' ')}>
     
        {this.props.isSample && this.props.brand === 'STEP' &&
          <div>
          <span className={styles.detail}>Retell: <span className={styles.goodMetric}>2/3</span></span>
          <span className={styles.detail}>Factual: <span className={styles.goodMetric}>1/1</span></span>
          <span className={styles.detail}>Inferential: <span className={styles.poorMetric}>0/2</span></span>
          <span className={styles.detail}>Critical Thinking: <span className={styles.goodMetric}>1/1</span></span>
          </div>
        }


        {this.props.isSample && this.props.brand === 'FP' &&
          <div>
          <span className={styles.detail}>Retell: <span className={styles.goodMetric}>2/3</span></span>
          <span className={styles.detail}>Within the Text: <span className={styles.fairMetric}>1/2</span></span>
          <span className={styles.detail}>Beyond the Text: <span className={styles.fairMetric}>1/2</span></span>
          </div>
        }


     
        {!this.props.isSample && this.props.label === 'Comp.' &&
          <div>
          {
            this.renderCompDetails()
          }
          </div>
        }

      </Popover>
    );



    const spellingPopover = (
      <Popover id="popover-positioned-bottom" title="Breakdown" className={[css.myPopover, css.compPopover].join(' ')}>
     


       {this.props.isSample &&
          <div>
          <span className={styles.detail}>-ed/ing Endings: <span className={styles.fairMetric}>4/5</span></span>
          <span className={styles.detail}>Doubling at Syllable Juncture: <span className={styles.goodMetric}>5/5</span></span>
          <span className={styles.detail}>Long-Vowel Two-Syllable Words: <span className={styles.fairMetric}>3/5</span></span>
          <span className={styles.detail}>R-Controlled Two-Syllable Words: <span className={styles.goodMetric}>5/4</span></span>
          </div>
        }

     
        {!this.props.isSample && this.props.label === 'Comp.' &&
          <div>
          {
            this.renderCompDetails()
          }
          </div>
        }

      </Popover>
    );





    let fluencyPopover = (
        <Popover id="popover-positioned-bottom" title={(this.props.label === 'Fluency') ? fluencyLibrary[String(this.props.number)].title : ''} className={[css.myPopover, css.compPopover].join(' ')}>
          {(this.props.label === 'Fluency') ? fluencyLibrary[String(this.props.number)].details : ''}
        </Popover>
    )






    let accMetricClass = cx({
      goodMetric: this.getAccColor(this.props.number) == 'good',
      fairMetric: this.getAccColor(this.props.number) == 'fair',
      poorMetric: this.getAccColor(this.props.number) == 'poor',
      metricFigureLabel: true,
    });

    let fluencyMetricClass = cx({
      goodMetric: this.getFluencyColor(this.props.number) == 'good',
      fairMetric: this.getFluencyColor(this.props.number) == 'fair',
      poorMetric: this.getFluencyColor(this.props.number) == 'poor',
      metricFigureLabel: true,
    })


    let WCMPMetricClass = cx({
      goodMetric: this.getWCPMColor(this.props.number) == 'good',
      fairMetric: this.getWCPMColor(this.props.number) == 'fair',
      poorMetric: this.getWCPMColor(this.props.number) == 'poor',
      metricFigureLabel: true,
    });

    let compMetricClass = cx({
      goodMetric: this.getCompColor(this.props.number, this.props.denominator) == 'good',
      fairMetric: this.getCompColor(this.props.number, this.props.denominator) == 'fair',
      poorMetric: this.getCompColor(this.props.number, this.props.denominator) == 'poor',
      metricFigureLabel: true,
    });

    let spellingMetricClass = cx({
        goodMetric: true,
        metricFigureLabel: true,

      // goodMetric: this.getCompColor(this.props.number, this.props.denominator) == 'good',
      // fairMetric: this.getCompColor(this.props.number, this.props.denominator) == 'fair',
      // poorMetric: this.getCompColor(this.props.number, this.props.denominator) == 'poor',
    });



    const label = this.props.label
    let number = this.props.number


    let metricClass
    let hasPopover = false 
    let hasDetails = false
    let popoverName 

    switch (label) {
      case 'Accuracy':
        metricClass = accMetricClass;
        number = (number.toString() + "%")

        hasDetails = true
        popoverName = accPopover

        break;
      case 'Words/Min':
        metricClass = WCMPMetricClass;
        hasDetails = false 
        break
      case 'Comp.':
        metricClass = compMetricClass;
        number = (number.toString() + ("/" + this.props.denominator.toString()))
        hasDetails = true 
        popoverName = lastPopover
        break
      case 'Fluency':
        metricClass = fluencyMetricClass;
        number = (number.toString() + "/" +  this.props.denominator.toString())
        // hasPopover = true
        hasDetails = true 
        popoverName = fluencyPopover
        break

      case 'Spelling': 
        metricClass = spellingMetricClass;
        number = (number.toString() + ("/" + this.props.denominator.toString()))
        hasDetails = true 
        popoverName = spellingPopover
        break
    }

    return (

      <div className={[styles.metricWrapper].join(' ')}>
        <div className={metricClass}>{ number }</div>

        { (!hasDetails || !this.props.showDetails) && 
           <div className={styles.metricDescriptionLabel}>{ label }</div>
        }

          { hasDetails && this.props.showDetails && 
            <OverlayTrigger className={styles.metricTrigger} rootClose  placement="bottom" overlay={popoverName}>
              <div style={{cursor: 'pointer'}} className={[styles.metricDescriptionLabel, styles.metricLabelWithDetails].join(' ')}>{ label }
              <i className={["fa", "fa-caret-down", css.questionIcon].join(" ")} aria-hidden={"true"} />
              </div>

            </OverlayTrigger>
          }  


       <style type="text/css">{'.modal-backdrop.in { opacity: 0.6; } '}</style>
        <Modal dialogClassName={styles.modalLg}  show={this.props.showPlaybook}   onHide={this.props.onPlaybookClose} >
          <Modal.Header bsClass={[styles.playbookModalHeader, 'modal-header'].join(' ')} closeButton>
            <Modal.Title>
              Some next instructional moves
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

          {this.props.isSample &&
            <div className={styles.playbookMoves}>
            <span className={styles.detail}> <span className={styles.poorMetric}>Visual cues (Accuracy):  </span>Build self-monitoring based on checking first letters and pictures</span>
            <span className={styles.detail}> <span className={styles.poorMetric}>Structure cues (Accuracy):  </span>Build self-monitoring based on checking if the sentence sounds right</span>
            <span className={styles.detail}> <span className={styles.fairMetric}>Inferential Comp:  </span>Focus on solving inferential questions by checking back at the text</span>
            <span className={styles.detail}> <span className={styles.fairMetric}>Fluency:  </span>Practice with high frequency words to build recognition</span>
            </div>
          }

          {!this.props.isSample && 
            <div className={styles.playbookMoves}>
              { movesSet.size > 0 &&
                movesSet 
               }
               {movesSet.size === 0 &&
                playbookDict.nothing
               } 

            </div>
          }

          </Modal.Body>
        </Modal>


      </div>

    );
  }
}
