import PropTypes from 'prop-types';
import React from 'react';
import css from './styles.css'
import styles from '../../styles.css'
import { Popover, OverlayTrigger } from 'react-bootstrap'


import classNames from 'classnames/bind';

let cx = classNames.bind(styles);



export default class Metric extends React.Component {
  static propTypes = {
    number: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  };

  static defaultProps = {
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




  getAccColor(acc) {
    
    if (acc >= 90) {
      return 'good'
    } else if (acc >= 85) {
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


  getCompColor(comp) {
    if (comp >= 8) {
      return 'good'
    } else if (comp >= 5) {
      return 'fair'
    } else {
      return 'poor'
    }

  }




  render() {

const popoverBottom = (
  <Popover id="popover-positioned-bottom" className={css.myPopover} title="Fluency Rubric, by Fountas & Pinnell">
 
    <strong>1 - Unsatisfactory fluency</strong>
    <ul>
    <li>Primarily word-by-word</li>
    <li>No expressive interpretation</li>
    <li>No appropriate stress or pausing</li>
    </ul>

     <strong>2 - Limited fluency</strong>
     <ul>
      <li>Primarily two-word phrases</li>
      <li>Almost no expressive interpretation</li>
      <li>Almost no appropriate pausing or stress</li>
     </ul>

     <strong>3 - Satisfactory fluency</strong>
     <ul>
    <li>Primarily three- or four-word phrases</li>
    <li>Some smooth, expressive interpretation </li>
    <li>Mostly appropriate stress and pausing</li>
     </ul>

    <strong>4 - Excellent fluency</strong>
    <ul>
    <li>Mostly smooth, expressive interpretation</li>
    <li>Pausing and stress guided by meaning</li>
    <li>Only a few slowdowns </li>
    </ul>

  </Popover>
);

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
      goodMetric: this.getCompColor(this.props.number) == 'good',
      fairMetric: this.getCompColor(this.props.number) == 'fair',
      poorMetric: this.getCompColor(this.props.number) == 'poor',
      metricFigureLabel: true,
    });


    const label = this.props.label
    let number = this.props.number


    let metricClass
    let hasPopover = false 

    switch (label) {
      case 'Accuracy':
        metricClass = accMetricClass;
        number = (number.toString() + "%")

        break;
      case 'WCPM':
        metricClass = WCMPMetricClass;
        break
      case 'Comp.':
        metricClass = compMetricClass;
        number = (number.toString() + "/9")
        break
      case 'Fluency':
        metricClass = fluencyMetricClass;
        number = (number.toString() + "/4")
        hasPopover = true
        break
    }

    return (

      <div className={styles.metricWrapper}>
        <div className={metricClass}>{ number }</div>
        <div className={styles.metricDescriptionLabel}>{ label }
          { hasPopover && 

          <OverlayTrigger trigger={['click']} rootClose  placement="bottom" overlay={popoverBottom}>
            <i className={["fa", "fa-question-circle", css.questionIcon].join(" ")} aria-hidden={"true"} />
          </OverlayTrigger>
          }
        </div>
      </div>

    );
  }
}
