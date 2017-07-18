
import RecordRTC from 'recordrtc'
import DetectRTC from 'detectrtc'

export default class Recorder {

	constructor() {
		this.rtcRecorder = null
		this.blobURL = null
		this.recording = false

    console.log('browserr:::  ' + JSON.stringify(DetectRTC.browser))

    this.initialize()
	}

	static browserSupportsRecording() {
		return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia)
	}

  static hasRecordingPermissions(callback) {
    DetectRTC.load(function() {
      console.log('LOADED')
      const has = DetectRTC.isWebsiteHasMicrophonePermissions
      console.log("DUZZZZ has?? " + has)
      callback(has)
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

	initialize(callback) {
		console.log('initialize Recorder -- requestUserMedia')
    this.captureUserMedia((stream, error) => {
      // this.setState({ src: window.URL.createObjectURL(stream) });
      // console.log('setting state', this.state)
      if (error) {
        return callback && callback(error)
      }

      this.rtcRecorder = RecordRTC(stream, { type: 'audio', mimeType: 'audio/wav' });
      callback && callback(null)

      
    });
	}

  reset() {
    if (this.recording) {
      this.stopRecording()
    }
    this.rtcRecorder.reset()
  }

	startRecording() {
		this.captureUserMedia((stream) => {
    	this.rtcRecorder.startRecording()
      this.recording = true
    });
	}

	stopRecording() {
		this.rtcRecorder.stopRecording(() => {
      this.recording = false
      this.blobURL = URL.createObjectURL(this.rtcRecorder.getBlob())
		})
	}

	pauseRecording() {
    this.rtcRecorder.pauseRecording()
    this.recording = false
	}

	resumeRecording() {
    this.rtcRecorder.resumeRecording()
    this.recording = true
	}

	getBlob() {
    return this.rtcRecorder.getBlob()
	}

	getBlobURL() {
    return this.blobURL
	}

  forceDownloadRecording(filename) {
    var anchor = document.createElement('a')
    anchor.href = this.blobURL
    anchor.target = '_blank';
    anchor.download = filename || 'output.wav';
    anchor.click();
  }

}