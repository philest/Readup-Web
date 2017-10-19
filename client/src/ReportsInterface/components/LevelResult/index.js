import PropTypes from 'prop-types';
import React from 'react';
import css from './styles.css'
import styles from '../../styles.css'


import { Panel } from 'react-bootstrap'
import { bootstrapUtils } from 'react-bootstrap/lib/utils';

bootstrapUtils.addStyle(Panel, 'myDanger');
bootstrapUtils.addStyle(Panel, 'myWarning');
bootstrapUtils.addStyle(Panel, 'mySuccess');





export default class LevelResult extends React.Component {
  static propTypes = {
    difficulty: PropTypes.string.isRequired,
    currentLevel: PropTypes.string,
    levelFound: PropTypes.bool,
    reassess: PropTypes.bool,
    didEndEarly: PropTypes.bool,
    yellowColorOverride: PropTypes.bool,
    assessmentBrand: PropTypes.string,
    userID: PropTypes.number,
  };

  static defaultProps = {
    levelFound: false,
    reassess: false,
    yellowColorOverride: false,
    assessmentBrand: "FP",
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

  getClass() {
   
    if (this.props.reassess === true || this.props.didEndEarly || this.props.yellowColorOverride) {
      return "myWarning"
    } else if (this.props.difficulty === 'Frustrational') {
      // trying warning to be more friendly
      return "myWarning"
    } else  {
      return "mySuccess"
    }

  }

  translateToSTEP(FPdifficulty) {
    if (FPdifficulty === 'Frustrational') {
      return 'Did not achieve'
    } else {
      return "Just Achieved"
    }
  }


  render() {




    let nextStepMsg
    let title
    let STEPdiffficulty = this.translateToSTEP(this.props.difficulty)
    let titleNormal

    let titleNormalFP = (
      <h2><span>{this.props.difficulty}</span> {" at Level " + this.props.currentLevel}</h2>
    );

    let titleNormalSTEP = (
      <h2><span>{ STEPdiffficulty }<span>{ " STEP " + this.props.currentLevel }</span></span> </h2>
    )


    let titleNoFinish = (
      <h2><span>{"Did not finish reading"}</span></h2>
    );


    if (this.props.assessmentBrand === 'FP') {
      titleNormal = titleNormalFP
    } else {
      titleNormal = titleNormalSTEP
    }


    if (this.props.didEndEarly && this.props.difficulty !== 'Frustrational') {
      title = titleNoFinish
    } else {
      title = titleNormal // allow Frustrational to override did end early
    }






    return (

      <div>
        <style type="text/css">{`
        .panel-myDanger, .panel-myWarning, .panel-mySuccess  {
          margin-top: 14px;
          margin-left: -12px;
        }

        .panel-myDanger h2, .panel-myWarning h2, .panel-mySuccess h2 {
          font-size: 1.6em;
        }

        .panel .panel-heading .panel-title span {
          font-weight: bold
        }

        .panel-myDanger div.panel-heading, .panel-myWarning div.panel-heading, .panel-mySuccess div.panel-heading {
          padding: 15px 15px 15px 14px;
        }

        .panel-myDanger .panel-body, .panel-myWarning .panel-body, .panel-mySuccess .panel-body {
          padding: 8px 15px 8px 17px;

        }



        .panel-myDanger div.panel-heading {

          color: #a94442;
          background-color: #f2dede;
          border-color: #ebccd1;
        }

        .panel-myDanger {

          border-color: #ebccd1;
        }


        .panel-myWarning div.panel-heading {

          color: #8a6d3b;
          background-color: #fcf8e3;
          border-color: #faebcc;
        }

        .panel-myWarning {

          border-color: #faebcc;
          min-width: 294px;
     
        }


        .panel-mySuccess div.panel-heading {

          color: #3c763d;
          background-color: #dff0d8;
          border-color: #d6e9c6;
        }

        .panel-mySuccess {

          border-color: #d6e9c6;
        }

        .panel-myWarning div.panel-heading {
          min-width: 280px;
        }

        .panel-mySuccess {
          max-width: 300px;
          min-width: 245px;
        }


        `}</style>
        <Panel header={title} bsStyle={this.getClass()}>

          <div onClick={this.props.onAssignClicked} className={styles.playbookTrigger}>
            Assign {this.props.nextStepMsg}
            <i className={'fa fa-arrow-right'} style={{ marginLeft: 6 }} />
          </div>


          { 
            <div onClick={this.props.onPlaybookClicked} className={[styles.playbookTrigger, styles.strategiesTrigger].join(' ')}>
              See strategies
              <img className={styles.icon} src="/images/playbook-blue.svg" alt="Playbook icon blue" />
            </div>
          } 


        </Panel>

      </div>






    );
  }
}
