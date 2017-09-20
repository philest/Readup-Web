// @flow
import RctOnR from 'react-on-rails'
import axios from 'axios'
import _forOwn from 'lodash/forOwn'

import { updateStudent } from '../../ReportsInterface/emailHelpers.js'

import {
  PromptOptions,
} from '../types'


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

export function getS3Presign(assessmentId: number, isCompBlob: boolean): PresignObject {
  console.log("\n\n\n\n\n\n", assessmentId)
  // get s3 presign
  const  params = {
    _: Date.now(),
    assessment_id: assessmentId,
    is_comp_blob: isCompBlob,
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
  const fileName = "recording.webm";

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




export function getStudentPromptStatus(studentID) {
  console.log("Okay, getting student data...");

    return axios.get(`/students/${studentID}`, {
      headers: RctOnR.authenticityHeaders(),
    }).then(res => {
      return res.data.prompt_status
  })
}

export function  resetToAwaitingPrompt(studentID) {
  const params = { prompt_status: PromptOptions.awaitingPrompt }
  updateStudent(params, studentID)
}


// export function getStudentID() {
//     return axios.get(`/students/${studentID}`, {
//       headers: RctOnR.authenticityHeaders(),
//     }).then(res => {
//       return res.data.id
//     })
// }

export function getStudentCount() {

  return axios.get(`/auth/get_student_count`, {
      headers: RctOnR.authenticityHeaders(),
    }).then(res => {
    return res.data.student_count;
  })
}



