import PropTypes from 'prop-types';
import React from 'react';
import css from './styles.css'
import styles from '../../styles.css'


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

    let accMetricClass = cx({
      goodMetric: this.getAccColor(this.props.number) == 'good',
      fairMetric: this.getAccColor(this.props.number) == 'fair',
      poorMetric: this.getAccColor(this.props.number) == 'poor',
      metricFigureLabel: true,
    });

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
    }

    return (

      <div className={styles.metricWrapper}>
        <div className={metricClass}>{ number }</div>
        <div className={styles.metricDescriptionLabel}>{ label }</div>
      </div>

    );
  }
}
