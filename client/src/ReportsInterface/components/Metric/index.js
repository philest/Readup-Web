import PropTypes from 'prop-types';
import React from 'react';
import css from './styles.css'
import styles from '../../styles.css'
import { Popover, OverlayTrigger } from 'react-bootstrap'


import classNames from 'classnames/bind';

let cx = classNames.bind(styles);
let book 


const popoverBottom = (
  <Popover id="popover-positioned-bottom" className={css.myPopover} title="Fluency Rubric, by Fountas & Pinnell">
 
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





const fluencyLibrary = {
  0: {
    title: "Unsatisfactory fluency",
    details: (
              <div>
              <span className={styles.detail}>Primarily word-by-word</span>
              <span className={styles.detail}>No expressive interpretation</span>
              <span className={styles.detail}>No appropriate stress or pausing</span>
              </div> 
              ),
    },
  1: {
    title: "Limited fluency",
    details: (
              <div>
              <span className={styles.detail}>Primarily two-word phrases</span>
              <span className={styles.detail}>Almost no expressive interpretation</span>
              <span className={styles.detail}>Almost no appropriate pausing or stress</span>
              </div> 
              ),
   },
  2: {
    title: "Satisfactory fluency",
    details: (
              <div>
              <span className={styles.detail}>Primarily three- or four-word phrases</span>
              <span className={styles.detail}>Some smooth, expressive interpretation</span>
              <span className={styles.detail}>Mostly appropriate stress and pausing</span>
              </div> 
              ),
  },
 3: {
    title: "Excellent fluency",
    details: (
              <div>
              <span className={styles.detail}>Primarily larger, meaningful phrases</span>
              <span className={styles.detail}>Mostly smooth, expressive interpretation</span>
              <span className={styles.detail}>Pausing and stress guided by meaning</span>
              </div> 
              ),
  },

}





export default class Metric extends React.Component {
  static propTypes = {
    number: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    denominator: PropTypes.number,
    showDetails: PropTypes.bool,
    compSubtotals: PropTypes.array,
    isSample: PropTypes.bool,
    msvSubtotals: PropTypes.array,
  };

  static defaultProps = {
    showDetails: false
 }


  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes

  }


  renderCompDetails = () => {
    let detailArr = []

    for (let i = 0; i < this.props.compSubtotals.length; i++) {
      detailArr.push(
        <span key={i} className={styles.detail}>{this.props.compSubtotals[i][0]}: <span className={this.getGeneralColorClass(this.props.compSubtotals[i][2])}>{this.props.compSubtotals[i][1]}</span></span>
      )  
    }

    return detailArr
  }


  renderAccDetails = () => {
    let detailArr = [] 
    for (let i = 0; i < 3; i++) {
      detailArr.push(
        <span key={i} className={styles.detail}>{this.props.msvSubtotals[i][0]}:  <span className={this.getGeneralColorClass(this.props.msvSubtotals[i][2])}>{this.props.msvSubtotals[i][1]}%</span></span>
      )
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
    if (wcpm >= 25) {
      return 'good'
    } else if (wcpm >= 15) {
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



  renderFluencyPopover = () => {

    console.log(this.props.number)
    let fluencyPopover

      if (this.props.isSample) {

        fluencyPopover = (

          <Popover id="popover-positioned-bottom" title={"Satisfactory fluency"} className={[css.myPopover, css.compPopover].join(' ')}>
          <p>asdfsdfa</p>

          </Popover>
        );

      }
      else {
        fluencyPopover = (

          <Popover id="popover-positioned-bottom" title={fluencyLibrary[String(this.props.number)].title} className={[css.myPopover, css.compPopover].join(' ')}>
         
          <p>asdfsdfa</p>

          </Popover>
        );
      }

    return fluencyPopover
    
  }





  render() {


    const accPopover = (
      <Popover id="popover-positioned-bottom" title="Cues used" className={[css.myPopover, css.compPopover].join(' ')}>
     
        {this.props.isSample &&
          <div>
          <span className={styles.detail}>Meaning: <span className={styles.fairMetric}>30%</span></span>
          <span className={styles.detail}>Structure: <span className={styles.goodMetric}>66%</span></span>
          <span className={styles.detail}>Visual: <span className={styles.goodMetric}>40%</span></span>
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
     
        {this.props.isSample &&
          <div>
          <span className={styles.detail}>Retell: <span className={styles.goodMetric}>2/3</span></span>
          <span className={styles.detail}>Factual: <span className={styles.goodMetric}>1/1</span></span>
          <span className={styles.detail}>Inferential: <span className={styles.poorMetric}>0/2</span></span>
          <span className={styles.detail}>Critical Thinking: <span className={styles.goodMetric}>1/1</span></span>
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
    }

    return (

      <div className={styles.metricWrapper}>
        <div className={metricClass}>{ number }</div>

        { (!hasDetails || !this.props.showDetails) && 
           <div className={styles.metricDescriptionLabel}>{ label }</div>
        }

          { hasDetails && this.props.showDetails && 
            <OverlayTrigger trigger={['click']} rootClose  placement="bottom" overlay={popoverName}>
              <div style={{cursor: 'pointer'}} className={styles.metricDescriptionLabel}>{ label }
              <i className={["fa", "fa-caret-down", css.questionIcon].join(" ")} aria-hidden={"true"} />
              </div>

            </OverlayTrigger>
          }  


      </div>

    );
  }
}
