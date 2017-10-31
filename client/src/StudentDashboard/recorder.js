import RecordRTC from "recordrtc";
import DetectRTC from "detectrtc";

import isSafari from "./isSafari";
import { sendEmail } from "../ReportsInterface/emailHelpers";

const emptyFn = () => {};

class Recorder {
  constructor() {
    this.rtcRecorder = null;
    this.blobURL = null;
    this.recording = false;
  }

  /* eslint-disable */
  static browserSupportsRecording() {
    return (
      !!(
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
      ) && !isSafari
    ); // disable Safari because autoplaying does not work
  }
  /*eslint-enable */

  static hasRecordingPermissions(callback) {
    DetectRTC.load(function() {
      const hasPermissions = DetectRTC.isWebsiteHasMicrophonePermissions;
      callback(hasPermissions);
    });
  }

  captureUserMedia(callback) {
    if (this.stream) {
      callback(this.stream);
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(callback)
      .catch(function(error) {
        alert("Unable to access your microphone.");
        console.error(error);
        callback(null, error);
      });
  }

  initialize(callback) {
    return true;
  }

  startRecording = () => {
    try {
      this.captureUserMedia((stream, error) => {
        if (error) {
          console.log("error capturing user media (in startRecording)!!");
          sendEmail(
            error,
            "error capturing user media (in startRecording)",
            "philesterman@gmail.com"
          );
          return;
        }

        this.stream = stream;

        try {
          this.rtcRecorder = RecordRTC(stream, {
            recorderType: isSafari
              ? RecordRTC.StereoAudioRecorder
              : RecordRTC.MediaStreamRecorder,
            type: "audio",
            mimeType: "audio/webm"
          });
          this.rtcRecorder.startRecording();
          this.recording = true;
        } catch (err) {
          try {
            sendEmail(
              err,
              "inner startRecording failed",
              "philesterman@gmail.com"
            );
            console.log("inner startRecording ERROR: ", err);
          } catch (err2) {
            console.log(
              "inner startRecording ERROR and sendEmail failed: ",
              err2
            );
          }
        }
      });
    } catch (err) {
      sendEmail(err, "startRecording failed", "philesterman@gmail.com");
      console.log("startRecording ERROR: ", err);
    }
  };

  stopRecording = (callback = emptyFn) => {
    try {
      if (this.recording === true || this.rtcRecorder.state === "paused") {
        this.rtcRecorder.stopRecording(() => {
          this.recording = false;
          this.blobURL = URL.createObjectURL(this.rtcRecorder.getBlob());
          callback(this.blobURL);
        });
      } else {
        sendEmail(
          "startRecording",
          "startRecording never started",
          "philesterman@gmail.com"
        );
        console.log("startRecording ERROR: ", "startRecording");
        callback("it broke");
      }
    } catch (err) {
      sendEmail(err, "stopRecording failed", "philesterman@gmail.com");
      console.log("stopRecording ERROR: ", err);
      callback("it broke");
    }
  };

  reset = () => {
    if (this.recording) {
      this.stopRecording();
    }

    if (this.rtcRecorder) {
      this.rtcRecorder.reset();
    }
  };

  pauseRecording = () => {
    this.rtcRecorder.pauseRecording();
    this.recording = false;
  };

  resumeRecording = () => {
    this.rtcRecorder.resumeRecording();
    this.recording = true;
  };

  isRecording = () => {
    return this.recording;
  };

  getBlob = () => {
    return this.rtcRecorder.getBlob();
  };

  getBlobURL = () => {
    return this.blobURL;
  };

  forceDownloadRecording(filename) {
    console.log(this.getBlobURL());
    const anchor = document.createElement("a");
    anchor.href = this.blobURL;
    anchor.target = "_blank";
    anchor.download = filename || "output.wav";
    anchor.click();
  }
}

export default Recorder;
