// @flow
import RctOnR from 'react-on-rails'
import axios from 'axios'
import _forOwn from 'lodash/forOwn'


export function sendEmail(subject, message, recipient) {
  console.log([message, recipient].join(' '));

  // TODO make the POST request to our server to send email
  const params = {
    subject: subject,
    message: message,
    recipient: recipient,
  }

  return axios.get('/reports/email_submit', {
      params,
      headers: RctOnR.authenticityHeaders(),
    }).then(res => {
      return res
      console.log(res);
      console.log("yay!");
  })
}

export function updateScoredText(json_scored_text) {
  console.log("Okay, updating the scored text...");

  // TODO make the POST request to our server to send email
  const params = {
    json_scored_text: json_scored_text,
  }

  return axios.get('/reports/email_submit', {
      params,
      headers: RctOnR.authenticityHeaders(),
    }).then(res => {
      return res
      console.log(res);
      console.log("yay!");
  })
}

export function getScoredText() {
  console.log("Okay, getting the scored text...");

  // TODO make the POST request to our server to send email
  const params = {
    get_scored_text: true,
  }

  return axios.get('/reports/email_submit', {
      params,
      headers: RctOnR.authenticityHeaders(),
    }).then(res => {
    return res.data;
  })
}




// HELPERS FOR METRICS 

export function getTotalWordsInText(evaluationTextData) {

    let wordCount = 0
    const numParagraphs = evaluationTextData.paragraphs.length
    for (let i = 0; i < numParagraphs; i++) {
      wordCount += evaluationTextData.paragraphs[i].words.length;
    }

    console.log(wordCount)
    return wordCount
}

export function getTotalWordsRead(evaluationTextData) {

    let wordCount = 0
    const endPindex = evaluationTextData.readingEndIndex.paragraphIndex
    const endWindex = evaluationTextData.readingEndIndex.wordIndex


    const numParagraphs = evaluationTextData.paragraphs.length
    for (let i = 0; i < numParagraphs; i++) {
      if (i < endPindex) {
        wordCount += evaluationTextData.paragraphs[i].words.length;
      }
      else if (i === endPindex){
        wordCount += (endWindex + 1)
      }
    }

    return wordCount
}

export function getTotalWordsReadCorrectly(evaluationTextData) {

    let wordCount = 0
    const endPindex = evaluationTextData.readingEndIndex.paragraphIndex
    const endWindex = evaluationTextData.readingEndIndex.wordIndex


    const numParagraphs = evaluationTextData.paragraphs.length
    for (let i = 0; i < numParagraphs; i++) {
      if (i < endPindex) {
        let wordsArr =  evaluationTextData.paragraphs[i].words
        for (let k = 0; k < wordsArr.length; k++) {
          if (wordsArr[k].wordDeleted == false && !wordsArr[k].substituteWord){
            wordCount++
          }
        }
      }
      else if (i === endPindex){
        let wordsArr =  evaluationTextData.paragraphs[i].words
        for (let k = 0; k < endWindex; k++) {
          if (wordsArr[k].wordDeleted == false && !wordsArr[k].substituteWord){
            wordCount++
          }
        }
      }
    }

    return wordCount
}

export function getAccuracy(evaluationTextData) {
  return Math.round(100 * (getTotalWordsReadCorrectly(evaluationTextData) / getTotalWordsRead(evaluationTextData)))
}

export function getWCPM(evaluationTextData) {
  return 121
}

export function getColorOfAccuracy(accuracy) {
  return "poorMetric"
}




