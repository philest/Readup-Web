
import RecordRTC from 'recordrtc';

export default class Recorder {

	constructor() {
		this.rtcRecorder = null
		this.blobURL = null
		this.recording = false
	}

	static browserSupportsRecording() {
		return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia)
	}

	captureUserMedia(callback) {
		var params = { audio: true, video: false };

    navigator.getUserMedia(params, callback, (error) => {
      alert(JSON.stringify(error));
    });
	}

	initialize() {
		console.log('initialize Recorder -- requestUserMedia')
    this.captureUserMedia((stream) => {
      // this.setState({ src: window.URL.createObjectURL(stream) });
      // console.log('setting state', this.state)
      this.rtcRecorder = RecordRTC(stream, { type: 'audio', mimeType: 'audio/wav' });
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