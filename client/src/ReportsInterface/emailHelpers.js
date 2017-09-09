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



export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}



export function updateScoredText(JSONScoredText, assessmentID) {
  console.log("Okay, updating the scored text...");

  // PHIL TODO refactor to a POST request to our server to send email
  const params = {
    JSONScoredText: JSONScoredText,
  }

    return axios.patch(`/assessments/${assessmentID}`, {
      params,
      headers: RctOnR.authenticityHeaders(),
    }).then(res => {
      return res
  })
}



export function updateFluencyScore(fluencyScore, assessmentID) {
  console.log("Okay, updating the fluency score...");

  // PHIL TODO refactor to a POST request to our server to send email
  const params = {
    fluencyScore: fluencyScore,
  }

    return axios.patch(`/assessments/${assessmentID}`, {
      params,
      headers: RctOnR.authenticityHeaders(),
    }).then(res => {
      return res
  })
}

export function getFluencyScore(assessmentID) {
  console.log("Okay, updating the fluency score...");

    return axios.get(`/assessments/${assessmentID}`, {
      headers: RctOnR.authenticityHeaders(),
    }).then(res => {
      return res.data.fluency_score
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


export function updateUserEmail(email, id) {

  // TODO make the POST request to our server to send email
  const params = {
    // email: email,
      email: email,
  }

  return axios.patch(`/users/${id}`, {
      params,
      headers: RctOnR.authenticityHeaders(),
    }).then(res => {
      return res
      console.log(res);
      console.log("yay!");
  })
}

export function getAssessmentUpdateTimestamp(id) {

  return axios.get(`/assessments/${id}`, {
      headers: RctOnR.authenticityHeaders(),
    }).then(res => {
      let d 
      d = res.data.updated_at
      d = new Date(d)
      d = d.getTime() // convert into ms since 1970 for equality with Rails date
      return d
  })


}


export function markUnscorable(id) {

  const params = {
      unscorable: true,
  }
    return axios.patch(`/assessments/${id}`, {
      params,
      headers: RctOnR.authenticityHeaders(),
    }).then(res => {
      return res
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
        for (let k = 0; k <= endWindex; k++) {
          if (wordsArr[k].wordDeleted == false && !wordsArr[k].substituteWord){
            wordCount++
          }
        }
      }
    }

    return wordCount
}

  // TODO: THIS IS NOT GENERALIZABLE
  // Only tells you if ended paragraph early
export function didEndEarly(evaluationTextData) {
    const endPindex = evaluationTextData.readingEndIndex.paragraphIndex
    const numParagraphs = evaluationTextData.paragraphs.length

    if (numParagraphs > endPindex) {
      return true
    }
    else {
      return false
    }

}


export function getAccuracy(evaluationTextData) {
  return Math.round(100 * (getTotalWordsReadCorrectly(evaluationTextData) / getTotalWordsRead(evaluationTextData)))
}

export function getWCPM(evaluationTextData) {
  return 47
}

export function getColorOfAccuracy(accuracy) {
  return "poorMetric"
}




