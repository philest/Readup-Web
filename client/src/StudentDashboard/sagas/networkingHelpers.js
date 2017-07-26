// @flow
import RctOnR from 'react-on-rails'
import axios from 'axios'
import _forOwn from 'lodash/forOwn'

type PresignObject = {
  url: string,
  fields: {},
};

type AssessmentId = number;


export function requestNewAssessment(bookKey: string): AssessmentId {
  return axios.get('assessment',  {
    params: {
      book_key: bookKey,
    },
    headers: RctOnR.authenticityHeaders(),
  })
    .then(res => {
      return res.data.assessment_id
    })
}

export function getS3Presign(assessmentId: number): PresignObject {
  console.log("\n\n\n\n\n\n", assessmentId)
  // get s3 presign
  const  params = {
    _: Date.now(),
    assessment_id: assessmentId,
  }

  return axios.get('/aws_presign', {
    params,
    headers: RctOnR.authenticityHeaders(),
  })
    .then(res => {
      console.log("got presign.");
      return res.data
    })
}


export function sendAudioToS3(blob, presign: PresignObject) {

  const { fields, url } = presign
  const data = new FormData(); // eslint-disable-line
  const fileName = "hello_there.wav";

  console.log('sendAudio', presign, blob)

  // set the s3 fields into the form data
  _forOwn(fields, (value, key) => data.set(key, value))
  data.append("file", blob, fileName);

  return axios.post(url, data)
    .then(res => {
      return res
      console.log(res);
      console.log("yay!");
    })
}