
import RecordRTC from 'recordrtc'
import DetectRTC from 'detectrtc'

import { sendEmail } from '../ReportsInterface/emailHelpers'


export default class Recorder {

  constructor() {
    this.rtcRecorder = null
    this.blobURL = null
    this.recording = false
  }

  /* eslint-disable */
  static browserSupportsRecording() {
    return !!(
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    )
  }
  /*eslint-enable */

  static hasRecordingPermissions(callback) {
    DetectRTC.load(function() {
      const hasPermissions = DetectRTC.isWebsiteHasMicrophonePermissions
      callback(hasPermissions)
    })
  }

  captureUserMedia(callback) {
    var params = { audio: true, video: false };

    navigator.getUserMedia(params, callback, (error) => {
      // alert(JSON.stringify(error));
      console.log('USER MEDIA ERROR::   ' + JSON.stringify(error))
      callback(null, error)
    });
  };

  initialize = (callback) => {

    if (!!this.rtcRecorder) {
      console.log('Attempted to initialize an already initialized recorder but that\'s expected')
      return
    }

    console.log('initialize Recorder -- requestUserMedia')
    this.captureUserMedia((stream, error) => {
      if (error) {
        console.log('!!errror capturing user media!!')
        return callback && callback(error)
      }

      // TODO: detect if system can play webms

      // <-- smaller filesize
      // this.rtcRecorder = RecordRTC(stream, { recorderType: RecordRTC.StereoAudioRecorder, bitsPerSecond: 30000, numberOfAudioChannels: 1, mimeType: 'audio/wav' });
  
      try {

        this.rtcRecorder = RecordRTC(stream,  { audio: 'true', mimeType: 'audio/webm', checkForInactiveTracks: 'true' });
        callback && callback(null)
        return true
      } catch (err) {
        sendEmail(err, "captureMedia inner startRecording failed", "philesterman@gmail.com")
        console.log("captureMedia inner startRecording ERROR: ", err)
        callback && callback(null)
        return true
      }


    });
  };

  reset = () => {
    if (this.recording) {
      this.stopRecording()
    }
    this.rtcRecorder.reset()
  }

  startRecording = () => {

    try {
    this.captureUserMedia((stream) => {
      try {
    	this.rtcRecorder.startRecording()
      this.recording = true
      } catch (err) {
        sendEmail(err, "inner startRecording failed", "philesterman@gmail.com")
        console.log("inner startRecording ERROR: ", err)
      }

    });
    } catch (err) {
      sendEmail(err, "startRecording failed", "philesterman@gmail.com")
      console.log("startRecording ERROR: ", err)
    }

  }

  stopRecording = (callback) => {
    try {
      if (this.recording === true || this.rtcRecorder.state === "paused") {
        this.rtcRecorder.stopRecording(() => {
          this.recording = false
          this.blobURL = URL.createObjectURL(this.rtcRecorder.getBlob())
          callback && callback(this.blobURL)
        })
      }
      else {
        sendEmail('startRecording', "startRecording never started", "philesterman@gmail.com")
        console.log("startRecording ERROR: ", 'startRecording')
        callback && callback('it broke')
      }
    } catch (err) {
      sendEmail(err, "stopRecording failed", "philesterman@gmail.com")
      console.log("stopRecording ERROR: ", err)
      callback && callback('it broke')
    }
  }


  pauseRecording = () => {
    this.rtcRecorder.pauseRecording()
    this.recording = false
  }

  resumeRecording = () => {
    this.rtcRecorder.resumeRecording()
    this.recording = true
  }

  isRecording = () => {
    return this.recording
  }

  getBlob = () => {
    return this.rtcRecorder.getBlob()
  };

  getBlobURL = () => {
    return this.blobURL
  }

  forceDownloadRecording(filename) {
    console.log(this.getBlobURL())
    var anchor = document.createElement('a')
    anchor.href = this.blobURL
    anchor.target = '_blank';
    anchor.download = filename || 'output.wav';
    anchor.click();
  }

}