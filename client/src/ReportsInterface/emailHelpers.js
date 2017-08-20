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
