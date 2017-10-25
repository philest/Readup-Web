import RecordRTC from "recordrtc";
import DetectRTC from "detectrtc";

import { sendEmail } from "../ReportsInterface/emailHelpers";

global.RecordRTC = RecordRTC;

class Recorder {
  constructor() {
    this.rtcRecorder = null;
    this.blobURL = null;
    this.recording = false;
  }

  /* eslint-disable */
  static browserSupportsRecording() {
    return !!(
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    );
  }
  /*eslint-enable */

  static hasRecordingPermissions(callback) {
    DetectRTC.load(function() {
      const hasPermissions = DetectRTC.isWebsiteHasMicrophonePermissions;
      callback(hasPermissions);
    });
  }

  captureUserMedia(callback) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(callback)
      .catch(function(error) {
        alert("Unable to access your microphone.");
        console.error(error);
        callback(null, error);
      });
  }

  startRecording = () => {
    const audio = (this.audio = document.createElement("audio"));
    document.body.appendChild(audio);

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
        audio.muted = true;
        audio.srcObject = stream;

        audio.play();

        try {
          this.rtcRecorder =
            this.rtcRecorder ||
            RecordRTC(stream, {
              recorderType: RecordRTC.StereoAudioRecorder,
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

  stopRecording = callback => {
    try {
      if (this.recording === true || this.rtcRecorder.state === "paused") {
        /* let tracks = this.stream.getTracks();

        tracks.forEach(function(track) {
          track.stop();
        })*/

        this.stream.stop();
        // this.audio.stop();
        this.audio.srcObject = null;
        this.rtcRecorder.stopRecording(() => {
          this.recording = false;
          this.blobURL = URL.createObjectURL(this.rtcRecorder.getBlob());
          callback && callback(this.blobURL);
        });
      } else {
        sendEmail(
          "startRecording",
          "startRecording never started",
          "philesterman@gmail.com"
        );
        console.log("startRecording ERROR: ", "startRecording");
        callback && callback("it broke");
      }
    } catch (err) {
      sendEmail(err, "stopRecording failed", "philesterman@gmail.com");
      console.log("stopRecording ERROR: ", err);
      callback && callback("it broke");
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
    var anchor = document.createElement("a");
    anchor.href = this.blobURL;
    anchor.target = "_blank";
    anchor.download = filename || "output.wav";
    anchor.click();
  }
}

global.Recorder = Recorder;
export default Recorder;
