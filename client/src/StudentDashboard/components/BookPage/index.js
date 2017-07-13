import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css'

export default class BookPage extends React.Component {
  static propTypes = {
    pageNumber: PropTypes.number,
    textLines: PropTypes.arrayOf(PropTypes.string),
    imageURL: PropTypes.string,
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {  };
  }



  render() {

    const FormattedText = ({textLines}) => (
      <div className={styles.readerTextContainer}>
        {textLines.map(text => (
          <div className={styles.textParagraph} key={text}>{text}</div>
        ))}
      </div>
    ); 

    return (
      <div className={styles.readerContentContainer}>
        
        <img src={this.props.imageURL} className={styles.readerImage} />
        <FormattedText textLines={this.props.textLines} />
        <div className={styles.pageNumber}>{this.props.pageNumber}</div>

      </div>
    );
  }
}
