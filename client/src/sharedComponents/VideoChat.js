import PropTypes from "prop-types";
import React from "react";

import styles from "../GraderInterface/styles.css";

import { Button, ButtonGroup } from "react-bootstrap";

import { playSound, stopAudio } from "../StudentDashboard/audioPlayer.js";
import { PromptAudioOptions } from "../StudentDashboard/types";

import Reader from "../StudentDashboard/Reader";

import {
  fireflyBook,
  fpBook,
  library,
  initialState
} from "../StudentDashboard/state.js";
import {
  ReaderStateOptions,
  PauseTypeOptions,
  MicPermissionsStatusOptions,
  PromptOptions
} from "../StudentDashboard/types";

import CompModal from "../StudentDashboard/modals/CompModal";
import DoneModal from "../StudentDashboard/modals/DoneModal";
import PausedModal from "../StudentDashboard/modals/PausedModal";
import CompPausedModal from "../StudentDashboard/modals/CompPausedModal";
import ExitModal from "../StudentDashboard/modals/ExitModal";
import MicModal from "../StudentDashboard/modals/MicModal";
import PlaybackModal from "../StudentDashboard/modals/PlaybackModal";

import IntroOverlay from "../StudentDashboard/overlays/IntroOverlay";
import BlockedMicOverlay from "../StudentDashboard/overlays/BlockedMicOverlay";
import SubmittedOverlay from "../StudentDashboard/overlays/SubmittedOverlay";
import DemoSubmittedOverlay from "../StudentDashboard/overlays/DemoSubmittedOverlay";
import PermissionsOverlay from "../StudentDashboard/overlays/PermissionsOverlay";
import CountdownOverlay from "../StudentDashboard/overlays/CountdownOverlay";
import SpinnerOverlay from "../StudentDashboard/overlays/SpinnerOverlay";

import { sendEmail } from "../ReportsInterface/emailHelpers";

const Video = require("twilio-video");

import {
  log,
  detachParticipantTracks,
  detachTracks,
  attachParticipantTracks,
  attachTracks
} from "./twilio-video-utilities.js";

import PromptButtons from "./PromptButtons";

let showLogs;
let audioToggleButton;
let videoToggleButton;
let localVideo;
let localAudio;

let onToggleShowVideo;
let lastQuestionAudioFile;

let newReaderProps = initialState;

// let newReaderProps = {
//   pageNumber: 0,
//   numPages: fireflyBook.numPages,
//   book: fireflyBook,
//   questionNumber: 1,
//   readerState: ReaderStateOptions.playingBookIntro,
//   prompt: PromptOptions.awaitingPrompt,
//   pauseType: PauseTypeOptions.fromPauseButton,
//   hasRecordedSomething: false,
//   compRecordingURL: null,
//   micPermissionsStatus: MicPermissionsStatusOptions.awaiting,
//   currentSoundId: "no-sound",
//   currentModalId: "no-modal",
//   currentOverlayId: "no-overlay",
//   showSpinner: false,
//   countdownValue: -1,
//   showVolumeIndicator: true,
//   showSkipPrompt: false,
//   inComp: false,
//   inSpelling: false,
//   inOralReading: true,
//   isLiveDemo: false,
//   spellingAnswerGiven: false,
//   spellingQuestionNumber: 1,
//   assessmentID: null,
//   assessmentSubmitted: false,
//   studentName: "Demo Student",
//   spellingInput: ""
// };

const importantStateKeysToUpdateOnStart = [
  "inComp",
  "inSpelling",
  "inOralReading",
  "currentModalId",
  "currentOverlayId",
  "readerState",
  "hasLoggedIn"
];

// scope it up here
let dataTrack = new Video.LocalDataTrack({
  maxPacketLifeTime: null,
  maxRetransmits: null
});

let activeRoom;
let previewTracks;
let identity;
let roomName;

// Successfully connected!
export function roomJoined(room) {
  window.room = activeRoom = room;

  log("Joined as '" + identity + "'");

  log("RoomSID: " + room.sid);

  // add the dataTrack after the room is joined
  room.localParticipant.publishTrack(dataTrack);

  while (room.localParticipant.dataTracks.size <= 0) {
    // try readding it if it did not connect
    room.localParticipant.publishTrack(dataTrack);
  }

  if (localAudio && room.localParticipant.audioTracks.size <= 0) {
    sendEmail(
      "The audio track failed to activate",
      "The audio track failed to activate",
      "philesterman@gmail.com"
    );
  }

  if (localVideo && room.localParticipant.videoTracks.size <= 0) {
    sendEmail(
      "The video track failed to activate",
      "The video track failed to activate",
      "philesterman@gmail.com"
    );
  }

  // If it's the grader, notify the student that they need to give a full state
  // update to the grader

  if (identity.toLowerCase().includes("grader")) {
    setTimeout(() => {
      console.log("Telling the student to send us all state...");
      dataTrack.send("SEND-ALL-STATE"); // indicator that they should send all state=
    }, 5000);
  }

  // document.getElementById("button-join").style.display = "none";
  // document.getElementById("button-leave").style.display = "inline";

  // Attach LocalParticipant's Tracks, if not already attached.
  var previewContainer = document.getElementById("local-media");

  if (previewContainer && !previewContainer.querySelector("video")) {
    attachParticipantTracks(room.localParticipant, previewContainer);
  }

  // Attach the Tracks of the Room's Participants.
  room.participants.forEach(function(participant) {
    log("Already in Room: '" + participant.identity + "'");
    var previewContainer = document.getElementById("remote-media");
    attachParticipantTracks(participant, previewContainer);
  });

  // When a Participant joins the Room, log the event.
  room.on("participantConnected", function(participant) {
    log("Joining: '" + participant.identity + "'");
  });

  // When a Participant adds a Track, attach it to the DOM.
  room.on(
    "trackAdded",
    function(track, participant) {
      log(participant.identity + " added track: " + track.kind);
      var previewContainer = document.getElementById("remote-media");

      if (track.kind === "data") {
        track.on("message", data => {
          console.log("getting a data track message");
          // console.log(data);

          if (data.includes("SEND-ALL-STATE")) {
            console.log(data);
            console.log("got a message to send over all state");
            this.sendAllPropsIndividually(this.props.readerProps);
          } else if (data.includes("VIDEO")) {
            onToggleShowVideo();
          } else if (data.includes("PROMPT")) {
            let promptNum = parseInt(data.substring(data.length - 1)); // grab the last character

            console.log(PromptAudioOptions);
            console.log(promptNum);
            console.log(
              PromptAudioOptions[Object.keys(PromptAudioOptions)[promptNum - 1]]
            );

            if (promptNum < 5) {
              playSound(
                PromptAudioOptions[
                  Object.keys(PromptAudioOptions)[promptNum - 1]
                ]
              );
            } else if (promptNum === 5) {
              // a repeat prompt
              playSound(lastQuestionAudioFile);
            } else {
              stopAudio();
            }
          } else {
            console.log("WE GOT THE PROPSSSS...");
            let obj = JSON.parse(data);

            let key = Object.keys(obj);
            let val = obj[key];

            console.log(obj);

            let myNewReaderProps = newReaderProps;
            myNewReaderProps[key] = val;
            this.setState({ newReaderProps: myNewReaderProps });

            console.log(`okay, update state to key: ${key} and val: ${val}`);
            console.log("New val: ", this.state.newReaderProps[key]);
          }
        });
      }

      attachTracks([track], previewContainer);
    }.bind(this)
  );

  // When a Participant removes a Track, detach it from the DOM.
  room.on("trackRemoved", function(track, participant) {
    log(participant.identity + " removed track: " + track.kind);
    detachTracks([track]);
  });

  // When a Participant leaves the Room, detach its Tracks.
  room.on("participantDisconnected", function(participant) {
    log("Participant '" + participant.identity + "' left the room");
    detachParticipantTracks(participant);
  });

  // Once the LocalParticipant leaves the room, detach the Tracks
  // of all Participants, including that of the LocalParticipant.
  room.on("disconnected", function() {
    log("Left");
    if (previewTracks) {
      previewTracks.forEach(function(track) {
        track.stop();
      });
    }
    detachParticipantTracks(room.localParticipant);
    room.participants.forEach(detachParticipantTracks);
    activeRoom = null;
    console.log("disconnected from room");
    // document.getElementById("button-join").style.display = "inline";
    // document.getElementById("button-leave").style.display = "none";
  });

  // start on mute for the grader
  if (audioToggleButton) {
    room.localParticipant.audioTracks.forEach(function(audioTrack, key, map) {
      console.log("muting this users audio");
      audioTrack.disable();
    });
  }

  if (videoToggleButton) {
    room.localParticipant.videoTracks.forEach(function(videoTrack, key, map) {
      console.log("muting this users video");
      videoTrack.disable();
    });
  }

  if (audioToggleButton) {
    document.getElementById("audio-toggle-off").onclick = function() {
      room.localParticipant.audioTracks.forEach(function(audioTrack, key, map) {
        console.log("muting this users audio");
        audioTrack.disable();
      });
    };

    document.getElementById("audio-toggle-on").onclick = function() {
      room.localParticipant.audioTracks.forEach(function(audioTrack, key, map) {
        console.log("enabling this users audio");
        audioTrack.enable();
      });
    };
  }

  if (videoToggleButton) {
    document.getElementById("video-toggle-off").onclick = function() {
      dataTrack.send("VIDEO-OFF");

      room.localParticipant.videoTracks.forEach(function(videoTrack, key, map) {
        console.log("muting this users video");
        videoTrack.disable();
      });
    };

    document.getElementById("video-toggle-on").onclick = function() {
      dataTrack.send("VIDEO-ON");

      room.localParticipant.videoTracks.forEach(function(videoTrack, key, map) {
        console.log("enabling this users video");
        videoTrack.enable();
      });
    };
  }
}

// Leave Room.
export function leaveRoomIfJoined() {
  if (activeRoom) {
    activeRoom.disconnect();
  }
}

export default class VideoChat extends React.Component {
  static propTypes = {
    identity: PropTypes.string,
    assessmentID: PropTypes.number.isRequired,
    room: PropTypes.string,
    logs: PropTypes.bool,
    pictureInPicture: PropTypes.bool,
    audioToggleButton: PropTypes.bool,
    videoToggleButton: PropTypes.bool,
    localVideo: PropTypes.bool,
    localAudio: PropTypes.bool,
    studentDash: PropTypes.bool,
    lastQuestionAudioFile: PropTypes.string,
    screenshotDataURL: PropTypes.string,
    isWithinGrader: PropTypes.bool
  };

  static defaultProps = {
    identity: "student",
    logs: false,
    pictureInPicture: true,
    audioToggleButton: false,
    videoToggleButton: false,
    localVideo: true,
    localAudio: true,
    studentDash: false,
    isWithinGrader: true
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);
    this.state = {
      localAudioEnabled: !this.props.audioToggleButton, // If there's a toggle button, start on mute (grader)
      localVideoEnabled: !this.props.videoToggleButton,
      showVideo: !this.props.studentDash, // Hide the video for students, until told to
      newReaderProps: newReaderProps
    };

    roomJoined = roomJoined.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.readerProps && !this.props.isWithinGrader) {
      for (var key in nextProps.readerProps) {
        if (nextProps.readerProps.hasOwnProperty(key)) {
          if (nextProps.readerProps[key] !== this.props.readerProps[key]) {
            console.log(
              `The ${key} key is different: It was ${this.props.readerProps[
                key
              ]} and now its ${nextProps.readerProps[key]}`
            );

            console.log("studentDash just updated a reader prop...");
            console.log(nextProps.readerProps[key]);

            let obj = {};
            obj[key] = nextProps.readerProps[key];
            console.log(obj);

            dataTrack.send(JSON.stringify(obj));
          }
        }
      }
    }
  }

  sendAllPropsIndividually(readerProps) {
    if (!this.props.isWithinGrader) {
      for (var key in newReaderProps) {
        //only iterate through the keys in initial state
        if (
          readerProps.hasOwnProperty(key) &&
          importantStateKeysToUpdateOnStart.includes(key)
        ) {
          //if its an important state key
          console.log(`The ${key} key  was ${this.props.readerProps[key]}`);

          console.log(
            "studentDash just updated a reader prop (sendAllPropsIndividually)..."
          );
          console.log(readerProps[key]);

          let obj = {};
          obj[key] = readerProps[key];
          console.log(obj);

          dataTrack.send(JSON.stringify(obj));
        }
      }
    }
  }

  onToggleAudioClicked = () => {
    console.log("here in audio toggle..");
    this.setState({ localAudioEnabled: !this.state.localAudioEnabled });
  };

  onToggleVideoClicked = () => {
    console.log("here in video toggle..");
    this.setState({ localVideoEnabled: !this.state.localVideoEnabled });
  };

  onToggleShowVideo = () => {
    console.log("here in SHOW video toggle.");
    this.setState({ showVideo: !this.state.showVideo });
  };

  sendPromptDataMessage = promptNumber => {
    console.log(`clicked immediate prompt ${promptNumber}`);
    dataTrack.send(`PROMPT-${promptNumber}`);
  };

  componentDidMount() {
    showLogs = this.props.logs;
    audioToggleButton = this.props.audioToggleButton;
    videoToggleButton = this.props.videoToggleButton;
    localAudio = this.props.localAudio;
    localVideo = this.props.localVideo;

    onToggleShowVideo = this.onToggleShowVideo;
    lastQuestionAudioFile = this.props.lastQuestionAudioFile;

    const Video = require("twilio-video");

    console.log("IT LOADED");

    this.setUpTracks();
  }

  setUpTracks = () => {
    // When we are about to transition away from this page, disconnect
    // from the room, if joined.
    window.addEventListener("beforeunload", leaveRoomIfJoined);

    // // scope it up here
    // var dataTrack = new Video.LocalDataTrack();

    // Obtain a token from the server in order to connect to the Room.
    $.getJSON(
      `/token?identity=${this.props.identity}&room=${this.props.room}`,
      function(data) {
        identity = data.identity;

        // document.getElementById("room-controls").style.display = "block";

        // console.log(data);
        // console.log(room);
        // console.log(identity);

        // attempt at autojoin
        roomName = data.room; //temporarily hardcode

        if (!roomName) {
          alert("Please enter a room name.");
          return;
        }

        log("Joining room '" + roomName + "'...");
        var connectOptions = {
          name: roomName,
          video: localVideo,
          audio: localAudio
          // logLevel: "debug"
        };

        if (previewTracks) {
          connectOptions.tracks = previewTracks;
        }

        // Join the Room with the token from the server and the
        // LocalParticipant's Tracks.

        Video.connect(data.token, connectOptions).then(roomJoined, function(
          error
        ) {
          log("Could not connect to Twilio: " + error.message);
        });
      }
    );
  };

  render() {
    return (
      <div>
        <style>
          {`
        @import url(https://fonts.googleapis.com/css?family=Share+Tech+Mono);



div#remote-media {
  height: 43%;
  width: 100%;
  background-color: #fff;
  text-align: center;
  margin: auto;
}

div#remote-media video {
    /* border: 1px solid #272726; */
    margin: ${this.props.studentDash ? "1em" : "4.4em 2em"} ;
    /* height: 70%; */
    max-width: 27% !important;
    background-color: #0c1f2d;
    background-repeat: no-repeat;
    position: fixed;
    width: ${this.props.studentDash ? "185px" : "270px"};
    float: right;
    right: 0px;
    z-index: 999;
    display: ${this.state.showVideo ? "block" : "none"}
}


div#controls {
  padding: 3em;
  max-width: 1200px;
  margin: 0 auto;
}

div#controls div {
  float: left;
}

div#controls div#room-controls,
div#controls div#preview {
  width: 16em;
  margin: 0 1.5em;
  text-align: center;
}

div#controls p.instructions {
  text-align: left;
  margin-bottom: 1em;
  font-family: Helvetica-LightOblique, Helvetica, sans-serif;
  font-style: oblique;
  font-size: 1.25em;
  color: #777776;
}

div#controls button {
  width: 15em;
  height: 2.5em;
  margin-top: 1.75em;
  border-radius: 1em;
  font-family: "Helvetica Light", Helvetica, sans-serif;
  font-size: 0.8em;
  font-weight: lighter;
  outline: 0;
}

div#controls div#room-controls input {
  font-family: Helvetica-LightOblique, Helvetica, sans-serif;
  font-style: oblique;
  font-size: 1em;
}

div#controls button:active {
  position: relative;
  top: 1px;
}

div#controls div#preview div#local-media {
  width: 270px;
  height: 202px;
  border: 1px solid #cececc;
  box-sizing: border-box;
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjgwcHgiIGhlaWdodD0iODBweCIgdmlld0JveD0iMCAwIDgwIDgwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4zLjEgKDEyMDAyKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5GaWxsIDUxICsgRmlsbCA1MjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPgogICAgICAgIDxnIGlkPSJjdW1tYWNrIiBza2V0Y2g6dHlwZT0iTVNMYXllckdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTU5LjAwMDAwMCwgLTE3NDYuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgIDxnIGlkPSJGaWxsLTUxLSstRmlsbC01MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTU5LjAwMDAwMCwgMTc0Ni4wMDAwMDApIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zOS42ODYsMC43MyBDMTcuODUsMC43MyAwLjA4NSwxOC41IDAuMDg1LDQwLjMzIEMwLjA4NSw2Mi4xNyAxNy44NSw3OS45MyAzOS42ODYsNzkuOTMgQzYxLjUyMiw3OS45MyA3OS4yODcsNjIuMTcgNzkuMjg3LDQwLjMzIEM3OS4yODcsMTguNSA2MS41MjIsMC43MyAzOS42ODYsMC43MyBMMzkuNjg2LDAuNzMgWiBNMzkuNjg2LDEuNzMgQzYxLjAwNSwxLjczIDc4LjI4NywxOS4wMiA3OC4yODcsNDAuMzMgQzc4LjI4Nyw2MS42NSA2MS4wMDUsNzguOTMgMzkuNjg2LDc4LjkzIEMxOC4zNjcsNzguOTMgMS4wODUsNjEuNjUgMS4wODUsNDAuMzMgQzEuMDg1LDE5LjAyIDE4LjM2NywxLjczIDM5LjY4NiwxLjczIEwzOS42ODYsMS43MyBaIiBpZD0iRmlsbC01MSI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTQ3Ljk2LDUzLjMzNSBMNDcuOTYsNTIuODM1IEwyMC4wOTMsNTIuODM1IEwyMC4wOTMsMjcuODI1IEw0Ny40NiwyNy44MjUgTDQ3LjQ2LDM4LjI1NSBMNTkuMjc5LDMwLjgwNSBMNTkuMjc5LDQ5Ljg1NSBMNDcuNDYsNDIuNDA1IEw0Ny40Niw1My4zMzUgTDQ3Ljk2LDUzLjMzNSBMNDcuOTYsNTIuODM1IEw0Ny45Niw1My4zMzUgTDQ4LjQ2LDUzLjMzNSBMNDguNDYsNDQuMjE1IEw2MC4yNzksNTEuNjY1IEw2MC4yNzksMjguOTk1IEw0OC40NiwzNi40NDUgTDQ4LjQ2LDI2LjgyNSBMMTkuMDkzLDI2LjgyNSBMMTkuMDkzLDUzLjgzNSBMNDguNDYsNTMuODM1IEw0OC40Niw1My4zMzUgTDQ3Ljk2LDUzLjMzNSIgaWQ9IkZpbGwtNTIiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
  background-position: center;
  background-repeat: no-repeat;
  margin: 0 auto;

    width: 100px;
    height: 75px;
    position: fixed;
    right: 36px;
    top: 49px;


}

div#controls div#preview div#local-media video {
  max-width: 100%;
  max-height: 100%;
  border: none;
}

div#controls div#preview button#button-preview {
  background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE3cHgiIGhlaWdodD0iMTJweCIgdmlld0JveD0iMCAwIDE3IDEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4zLjEgKDEyMDAyKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5GaWxsIDM0PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9ImN1bW1hY2siIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMjUuMDAwMDAwLCAtMTkwOS4wMDAwMDApIiBmaWxsPSIjMEEwQjA5Ij4KICAgICAgICAgICAgPHBhdGggZD0iTTEzNi40NzEsMTkxOS44NyBMMTM2LjQ3MSwxOTE5LjYyIEwxMjUuNzY3LDE5MTkuNjIgTDEyNS43NjcsMTkxMC4wOCBMMTM2LjIyMSwxOTEwLjA4IEwxMzYuMjIxLDE5MTQuMTUgTDE0MC43ODUsMTkxMS4yNyBMMTQwLjc4NSwxOTE4LjQyIEwxMzYuMjIxLDE5MTUuNTUgTDEzNi4yMjEsMTkxOS44NyBMMTM2LjQ3MSwxOTE5Ljg3IEwxMzYuNDcxLDE5MTkuNjIgTDEzNi40NzEsMTkxOS44NyBMMTM2LjcyMSwxOTE5Ljg3IEwxMzYuNzIxLDE5MTYuNDUgTDE0MS4yODUsMTkxOS4zMyBMMTQxLjI4NSwxOTEwLjM3IEwxMzYuNzIxLDE5MTMuMjQgTDEzNi43MjEsMTkwOS41OCBMMTI1LjI2NywxOTA5LjU4IEwxMjUuMjY3LDE5MjAuMTIgTDEzNi43MjEsMTkyMC4xMiBMMTM2LjcyMSwxOTE5Ljg3IEwxMzYuNDcxLDE5MTkuODciIGlkPSJGaWxsLTM0IiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=)1em center no-repeat #fff;
  border: none;
  padding-left: 1.5em;
}

div#controls div#log {
  border: 1px solid #686865;
}

div#controls div#room-controls {
  display: none;
}

div#controls div#room-controls input {
  width: 100%;
  height: 2.5em;
  padding: 0.5em;
  display: block;
}

div#controls div#room-controls button {
  color: #fff;
  background: 0 0;
  border: 1px solid #686865;
}

div#controls div#room-controls button#button-leave {
  display: none;
}

div#controls div#log {
  width: 35%;
  height: 9.5em;
  margin-top: 2.75em;
  text-align: left;
  padding: 1.5em;
  float: right;
  overflow-y: scroll;

    position: fixed;
    right: 10px;
    top: 230px;
    background-color: white;

}


div#controls div#screencast {
    width: 35%;
    height: 14.5em;
    margin-top: 2.75em;
    text-align: left;
    padding: 1.5em;
    float: right;
    overflow-y: scroll;
    position: fixed;
    right: 10px;
    top: 370px;
    background-color: grey;
}



div#controls div#log p {
  color: #686865;
  font-family: "Share Tech Mono", "Courier New", Courier, fixed-width;
  font-size: 1.25em;
  line-height: 1.25em;
  margin-left: 1em;
  text-indent: -1.25em;
  width: 90%;
}

#audio-toggle {
}

#reader-container {
  height: 100vh;
}

#reader-container > div{
    position: relative;
    z-index: -1;
    width: 100%;
}

#audio-toggle-on:hover, #audio-toggle-off:hover {
  transform: translateY(0px);
}

`}
        </style>
        <div id="remote-media" />
        <div id="controls">
          {this.props.pictureInPicture && (
            <div id="preview">
              <div id="local-media" />
            </div>
          )}

          {this.props.audioToggleButton && (
            <Button
              style={{
                visibility: this.state.localAudioEnabled ? "visible" : "hidden"
              }}
              id="audio-toggle-off"
              onClick={this.onToggleAudioClicked}
            >
              Turn off your Audio
            </Button>
          )}
          {this.props.audioToggleButton && (
            <Button
              style={{
                visibility: !this.state.localAudioEnabled ? "visible" : "hidden"
              }}
              id="audio-toggle-on"
              onClick={this.onToggleAudioClicked}
            >
              Turn on your Audio
            </Button>
          )}

          {this.props.videoToggleButton && (
            <Button
              style={{
                visibility: this.state.localVideoEnabled ? "visible" : "hidden"
              }}
              id="video-toggle-off"
              onClick={this.onToggleVideoClicked}
            >
              Turn off your video
            </Button>
          )}
          {this.props.videoToggleButton && (
            <Button
              style={{
                visibility: !this.state.localVideoEnabled ? "visible" : "hidden"
              }}
              id="video-toggle-on"
              onClick={this.onToggleVideoClicked}
            >
              Turn on your video
            </Button>
          )}

          {!this.props.studentDash && (
            <PromptButtons
              immediate={true}
              sendPromptDataMessage={this.sendPromptDataMessage}
            />
          )}

          {this.props.logs && (
            <div id="log" style={{ visibility: "visible" }} />
          )}
        </div>
        {this.props.logs && (
          <div>
            <div>
              <PausedModal
                currentShowModal={this.state.newReaderProps.currentShowModal}
                showSpinner={this.state.newReaderProps.showSpinner}
              />

              <CompPausedModal
                currentShowModal={this.state.newReaderProps.currentShowModal}
                showSpinner={this.state.newReaderProps.showSpinner}
              />

              <ExitModal
                startedRecording={
                  this.state.newReaderProps.hasRecordedSomething
                }
                onExitAndUploadClicked={
                  this.state.newReaderProps.exitAndUploadRecording
                }
                onExitNoUploadClicked={this.state.newReaderProps.quitAssessment}
                currentShowModal={this.state.newReaderProps.currentShowModal}
              />

              <PlaybackModal
                audioSrc={this.state.newReaderProps.recordingURL}
                compAudioSrc={this.state.newReaderProps.compRecordingURL}
                currentShowModal={this.state.newReaderProps.currentShowModal}
                showSpinner={this.state.newReaderProps.showSpinner}
              />

              <DoneModal
                currentShowModal={this.state.newReaderProps.currentShowModal}
                showSpinner={this.state.newReaderProps.showSpinner}
                showCheck={this.state.newReaderProps.assessmentSubmitted}
              />

              <CompModal
                currentShowModal={this.state.newReaderProps.currentShowModal}
                readerState={this.state.newReaderProps.readerState}
                disabled={
                  this.state.newReaderProps.readerState ===
                    ReaderStateOptions.playingBookIntro ||
                  this.state.newReaderProps.readerState ===
                    ReaderStateOptions.talkingAboutStartButton ||
                  this.state.newReaderProps.readerState ===
                    ReaderStateOptions.talkingAboutStopButton ||
                  this.state.newReaderProps.readerState ===
                    ReaderStateOptions.talkingAboutSeeBook
                }
                showSpinner={this.state.newReaderProps.showSpinner}
                showPrompting={this.state.newReaderProps.isLiveDemo}
                question={
                  this.state.newReaderProps.book.questions[
                    this.state.newReaderProps.questionNumber
                  ]
                }
                includeDelay={this.state.newReaderProps.questionNumber === 1}
                prompt={this.state.newReaderProps.prompt}
              />
            </div>
            <div>
              <BlockedMicOverlay
                currentShowOverlay={
                  this.state.newReaderProps.currentShowOverlay
                }
              />

              <SubmittedOverlay
                currentShowOverlay={
                  this.state.newReaderProps.currentShowOverlay
                }
              />

              <PermissionsOverlay
                currentShowOverlay={
                  this.state.newReaderProps.currentShowOverlay
                }
                onArrowClicked={
                  this.state.newReaderProps.onPermisionsArrowClicked
                }
              />

              <DemoSubmittedOverlay
                currentShowOverlay={
                  this.state.newReaderProps.currentShowOverlay
                }
                studentName={this.state.newReaderProps.studentName}
              />

              {this.state.newReaderProps.readerState ===
                ReaderStateOptions.countdownToStart && (
                <CountdownOverlay
                  countdownValue={this.state.newReaderProps.countdownValue}
                />
              )}

              <SpinnerOverlay
                showPrompting={this.state.newReaderProps.isLiveDemo}
                currentShowOverlay={
                  this.state.newReaderProps.currentShowOverlay
                }
                text={"Spinner message goes here"}
                isLoadingUpload={this.state.newReaderProps.showSpinner}
              />
            </div>
            <div id="reader-container">
              <Reader
                pageNumber={this.state.newReaderProps.pageNumber}
                numPages={this.state.newReaderProps.numPages}
                questionNumber={this.state.newReaderProps.questionNumber}
                readerState={this.state.newReaderProps.readerState}
                pauseType={this.state.newReaderProps.pauseType}
                hasRecordedSomething={
                  this.state.newReaderProps.hasRecordedSomething
                }
                micPermissionsStatus={
                  this.state.newReaderProps.micPermissionsStatus
                }
                currentSoundId={this.state.newReaderProps.currentSoundId}
                currentModalId={this.state.newReaderProps.currentModalId}
                currentOverlayId={this.state.newReaderProps.currentOverlayId}
                currentShowOverlay={
                  this.state.newReaderProps.currentShowOverlay
                }
                showSpinner={this.state.newReaderProps.showSpinner}
                countdownValue={this.state.newReaderProps.countdownValue}
                showVolumeIndicator={
                  this.state.newReaderProps.showVolumeIndicator
                }
                showSkipPrompt={this.state.newReaderProps.showSkipPrompt}
                inComp={this.state.newReaderProps.inComp}
                inSpelling={this.state.newReaderProps.inSpelling}
                inOralReading={this.state.newReaderProps.inOralReading}
                isLiveDemo={this.state.newReaderProps.isLiveDemo}
                spellingAnswerGiven={
                  this.state.newReaderProps.spellingAnswerGiven
                }
                spellingQuestionNumber={
                  this.state.newReaderProps.spellingQuestionNumber
                }
                assessmentID={this.state.newReaderProps.assessmentID}
                assessmentSubmitted={
                  this.state.newReaderProps.assessmentSubmitted
                }
                studentName={this.state.newReaderProps.studentName}
                coverImageURL={this.props.book.coverImage}
                book={this.props.book}
                spellingInput={this.state.newReaderProps.spellingInput}
                isWithinGrader={true}
                hasLoggedIn={this.state.newReaderProps.hasLoggedIn}
                studentName={this.state.newReaderProps.studentName}
              />
            </div>
            ); };
          </div>
        )}

        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js" />
      </div>
    );
  }
}
