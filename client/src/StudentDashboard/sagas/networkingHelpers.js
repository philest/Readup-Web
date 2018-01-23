// @flow
import RctOnR from "react-on-rails";
import axios from "axios";
import _forOwn from "lodash/forOwn";

import {
  updateStudent,
  getAssessmentData,
  updateAssessment,
  getAllStudents,
  getAllAssessments,
  getTeacher
} from "../../ReportsInterface/emailHelpers.js";

import { PromptOptions } from "../types";

import { spellingLibrary, library } from "../../sharedComponents/bookObjects";

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

  return axios.post(url, data, { timeout: 18000 }).then(res => {
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

export function getNumFiles(dir) {
  console.log("Okay, getting num files for...", dir);

  const params = { dir: dir };

  return axios
    .get(`/get_num_files`, {
      params: params,
      headers: RctOnR.authenticityHeaders()
    })
    .then(res => {
      return res.data;
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
      headers: RctOnR.authenticityHeaders(),
      timeout: 8500
    })
    .then(res => {
      return res;
    });
}

export function saveSpellingResponse(value, qNum, spellingGroupLibraryIdx) {
  // get spelling object
  // save it temporarily
  // push in a new response
  // get assessment ID
  // update assessment

  const assessmentID = getLastAssessmentID();
  assessmentID.then(id => {
    console.log("id: ", id);

    const assessment = getAssessmentData(id);

    assessment
      .then(assessment => {
        console.log("assessment: ", assessment);

        let scoredSpellingHolder = assessment.scored_spelling;

        if (!scoredSpellingHolder) {
          scoredSpellingHolder = spellingLibrary[spellingGroupLibraryIdx];
        }

        scoredSpellingHolder.responses[qNum - 1] = value;

        updateAssessment(
          {
            scored_spelling: scoredSpellingHolder
          },
          id
        );
      })
      .catch(function(err) {
        console.log(err);
      });
  });
}

export function getClass(userID) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        email: "somemockemail@email.com",
        repository: "http://github.com/username",
        userID: userID
      });
    }, 3000);
  });
}
