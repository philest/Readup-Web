// @flow
import RctOnR from "react-on-rails";
import axios from "axios";
import _forOwn from "lodash/forOwn";

import {
  updateStudent,
  getAssessmentData
} from "../../ReportsInterface/emailHelpers.js";

import { PromptOptions } from "../types";

type PresignObject = {
  url: string,
  fields: {}
};

type AssessmentId = number;

export function requestNewAssessment(bookKey: string): AssessmentId {
  return axios
    .get("assessment", {
      params: {
        book_key: bookKey
      },
      headers: RctOnR.authenticityHeaders()
    })
    .then(res => {
      return res.data.assessment_id;
    });
}

export function getS3Presign(
  assessmentId: number,
  isCompBlob: boolean
): PresignObject {
  console.log("\n\n\n\n\n\n", assessmentId);
  // get s3 presign
  const params = {
    _: Date.now(),
    assessment_id: assessmentId,
    is_comp_blob: isCompBlob
  };

  return axios
    .get("/aws_presign", {
      params,
      headers: RctOnR.authenticityHeaders()
    })
    .then(res => {
      console.log("got presign.");
      return res.data;
    });
}

export function sendAudioToS3(
  blob,
  presign: PresignObject,
  isCompBlob: boolean,
  questionNum: number
) {
  const { fields, url } = presign;
  const data = new FormData(); // eslint-disable-line
  let fileName;

  if (!isCompBlob) {
    fileName = "recording.webm";
  } else {
    fileName = ["question", String(questionNum), ".webm"].join("");
  }

  console.log("sendAudio", presign, blob);

  // set the s3 fields into the form data
  _forOwn(fields, (value, key) => data.set(key, value));
  data.append("file", blob, fileName);

  return axios.post(url, data).then(res => {
    return res;
    console.log(res);
    console.log("yay!");
  });
}

export function getStudentPromptStatus(studentID) {
  console.log("Okay, getting student data...");

  return axios
    .get(`/students/${studentID}`, {
      headers: RctOnR.authenticityHeaders()
    })
    .then(res => {
      return res.data.prompt_status;
    });
}

export function resetToAwaitingPrompt(studentID) {
  const params = { prompt_status: PromptOptions.awaitingPrompt };
  updateStudent(params, studentID);
}

// export function getStudentID() {
//     return axios.get(`/students/${studentID}`, {
//       headers: RctOnR.authenticityHeaders(),
//     }).then(res => {
//       return res.data.id
//     })
// }

export function getLastStudentID() {
  return axios
    .get(`/auth/get_last_student_id`, {
      headers: RctOnR.authenticityHeaders()
    })
    .then(res => {
      return res.data.student_id;
    });
}

export function getLastAssessmentID() {
  return axios
    .get(`/auth/get_last_assessment_id`, {
      headers: RctOnR.authenticityHeaders()
    })
    .then(res => {
      return res.data.assessment_id;
    });
}

export function getIsLiveDemo() {
  console.log("Okay, getting live demo...");

  return axios
    .get(`/auth/get_is_live_demo`, {
      headers: RctOnR.authenticityHeaders()
    })
    .then(res => {
      return res.data.is_live_demo;
    })
    .catch(err => {
      console.log(err);
      return false;
    });
}

export function markCompleted(assessmentID) {
  setTimeout(() => {
    return false;
  }, 5000);

  console.log("Okay, marking it as completed...");

  // PHIL TODO refactor to a POST request to our server to send email
  const params = {
    completed: true
  };

  return axios
    .patch(`/assessments/${assessmentID}`, {
      params,
      headers: RctOnR.authenticityHeaders()
    })
    .then(res => {
      return res;
    });
}
