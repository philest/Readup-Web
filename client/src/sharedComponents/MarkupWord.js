import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'


export default class MarkupWord extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    isSpace: PropTypes.bool,
    strikethrough: PropTypes.bool,
    wordAbove: PropTypes.string,
    paragraphIndex: PropTypes.number,
    wordIndex: PropTypes.number,
    isEndWord: PropTypes.bool,
    grayedOut: PropTypes.bool,

    isInteractive: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
  };
  static defaultProps = {
    isSpace: false,
    isEndWord: false,
    isInteractive: false,
    strikethrough: false,
    grayedOut: false,
    wordAbove: null,
  };

  constructor(props) {
    super(props)
    this.state = { highlighted: false }
    // console.log('CONSTRUCT')
  }

  _onMouseEnter = () => {
    if (!this.props.isInteractive) {
    	return
    }
    this.props.onMouseEnter(this.props.paragraphIndex, this.props.wordIndex, this.props.isSpace)
  }

  _onMouseLeave = () => {
  	if (!this.props.isInteractive) {
    	return
    }
    this.props.onMouseLeave(this.props.paragraphIndex, this.props.wordIndex, this.props.isSpace)
  }

  render() {
    

    let wordClassNameString = this.props.isInteractive ? styles.textWord : styles.textWordNoHover
    if (this.props.strikethrough) {
      wordClassNameString += (' ' + styles.strikethrough)
    }
    if (this.props.grayedOut) {
      wordClassNameString += (' ' + styles.grayedOut)    
    }

    return (
      <span className={styles.wordWrapper}>

        { this.props.isInteractive && 
          <span className={wordClassNameString} onMouseEnter={this._onMouseEnter} onMouseLeave={this._onMouseLeave}>
            {this.props.isSpace && '\u00A0\u00A0\u00A0'}
            {!this.props.isSpace && this.props.text}
          </span>
        }

        { !this.props.isInteractive && 
          <span className={wordClassNameString}>
            {this.props.isSpace && '\u00A0' }
            {!this.props.isSpace && this.props.text }
          </span>
        }

        { this.props.wordAbove && this.props.wordAbove !== '' &&
          <span className={this.props.isSpace ? styles.wordAboveSpace : styles.wordAbove}>
            {this.props.wordAbove}
            {this.props.isSpace &&
              <i className={["fa fa-chevron-up", styles.addChevron].join(' ')} aria-hidden={"true"}></i>
            }
          </span>
        }

        { this.props.isEndWord &&
          <span className={styles.endingSlashes}>
            //
          </span>
        }

      </span>
    );
  }
}
