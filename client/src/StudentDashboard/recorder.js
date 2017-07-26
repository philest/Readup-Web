
import RecordRTC from 'recordrtc'
import DetectRTC from 'detectrtc'

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
  }

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

      // { audio: 'true', mimeType: 'audio/webm' }  <-- smaller filesize
      this.rtcRecorder = RecordRTC(stream, { recorderType: RecordRTC.StereoAudioRecorder, mimeType: 'audio/wav' });
      callback && callback(null)

    });
  }

  reset = () => {
    if (this.recording) {
      this.stopRecording()
    }
    this.rtcRecorder.reset()
  }

  startRecording = () => {
    this.captureUserMedia((stream) => {
    	this.rtcRecorder.startRecording()
      this.recording = true
    });
  }

  stopRecording = (callback) => {
    this.rtcRecorder.stopRecording(() => {
      this.recording = false
      this.blobURL = URL.createObjectURL(this.rtcRecorder.getBlob())
      callback && callback(this.blobURL)
    })
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