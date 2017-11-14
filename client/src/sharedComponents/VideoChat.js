import PropTypes from "prop-types";
import React from "react";

import styles from "../GraderInterface/styles.css";

import { Button, ButtonGroup } from "react-bootstrap";

import { playSound } from "../StudentDashboard/audioPlayer.js";
import { PromptAudioOptions } from "../StudentDashboard/types";

const Video = require("twilio-video");

let showLogs;
let hide;
let audioToggleButton;
let videoToggleButton;
let localVideo;
let localAudio;

let onToggleShowVideo;
let lastQuestionAudioFile;

let dataURL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAKBueIx4ZKCMgoy0qqC+8P//8Nzc8P//////////////////////////////////////////////////////////2wBDAaq0tPDS8P//////////////////////////////////////////////////////////////////////////////wAARCAFoBPkDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAECAwT/xAAuEAEBAAIBAwMEAgEDBQEAAAAAAQIRIQMSMTJBUSJCYXETgZEzsfAjQ1KhwdH/xAAWAQEBAQAAAAAAAAAAAAAAAAAAAQL/xAAcEQEBAQADAQEBAAAAAAAAAAAAAREhMUESYQL/2gAMAwEAAhEDEQA/AOYCoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAv2xF+2IQqoAgqAKAKptEBdusmPbjL5vu4u2pJjbfEBnGaysu+EmOWU3GsL3XK34Szu6eOvbyCZY3GyfJcMpzY1n6sFl/wCrZvgGJjbNyM651rlveulxfdbZM8LfgGb07Jtjh2u8bbqSfLiDpj244bs3uplh9eo1jO/pyb5lNz+Wz5mgYy6dxm+LGrhbjj2z25S4XHG7y/pcrZMOQYxx+rVlWYzsyvvK6f8Ae/pn7Mv2DNw1hL7n8eV50t56c/C536cZ+AYxwuV1PYywuPnw6dPXbZxtM+MZNSfiAzOnlZviftmyy6rvfq1ZJf8A45Z/VlaKwLo0JqACgAAoCCgiCgIKAgoCCgLj4qLPFRAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxxuV1EdOj67+gS9LKT2Yd8ZMN5d24TGdu5jLbzyiuA7XCfyTU4s8GWMuFupLPgRxb/jy7tcb1trLtw1j27/Lf/dv6/8AorhJu6hlO26q4f6k/bpqd2ds3r/8VHEdb259O2Y6scgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAW+mIv2xCFABANmxRbr2TheARF1+QEXZygLsAANICgAAAKgCiAigKAAAACBUFQNgAgoACgAACApsEXdAE3RUA2bUAnio1PFZFAAAAAAAAAAAAAAAAAACTd1BvperfxLQZu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";

// scope it up here
var dataTrack = new Video.LocalDataTrack();

export default class VideoChat extends React.Component {
  static propTypes = {
    identity: PropTypes.string,
    assessmentID: PropTypes.number.isRequired,
    room: PropTypes.string,
    logs: PropTypes.bool,
    pictureInPicture: PropTypes.bool,
    hide: PropTypes.bool,
    audioToggleButton: PropTypes.bool,
    videoToggleButton: PropTypes.bool,
    localVideo: PropTypes.bool,
    localAudio: PropTypes.bool,
    studentDash: PropTypes.bool,
    lastQuestionAudioFile: PropTypes.string,
    screenshotDataURL: PropTypes.string
  };

  static defaultProps = {
    identity: "student",
    logs: false,
    pictureInPicture: true,
    hide: false,
    audioToggleButton: false,
    videoToggleButton: false,
    localVideo: true,
    localAudio: true,
    studentDash: false
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
      gotScreenshot: dataURL
    };
  }

  componentDidUpdate(nextProps) {
    console.log(nextProps);
    console.log(nextProps.screenshotDataURL);
    console.log("here in did update..");

    if (nextProps.screenshotDataURL) {
      console.log("Sending a new screenshot over data track...");
      dataTrack.send(nextProps.screenshotDataURL);
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

  onPromptClicked = (promptNumber, isImmediate) => {
    console.log("clicked immediate prompt ");
    dataTrack.send(`PROMPT-${promptNumber}`);

    // let promptStatus = PromptOptions[promptNumber];
    // const params = { prompt_status: promptStatus };

    // if (!isImmediate) {
    //   updateStudent(params, this.props.studentID);
    // }

    // this.setState({ showPromptAlert: true });
    // setTimeout(() => {
    //   this.setState({ showPromptAlert: false });
    // }, 2500);
  };

  componentDidMount() {
    showLogs = this.props.logs;
    hide = this.props.hide;
    audioToggleButton = this.props.audioToggleButton;
    videoToggleButton = this.props.videoToggleButton;
    localAudio = this.props.localAudio;
    localVideo = this.props.localVideo;

    onToggleShowVideo = this.onToggleShowVideo;
    lastQuestionAudioFile = this.props.lastQuestionAudioFile;

    const Video = require("twilio-video");

    console.log("IT LOADED");

    var activeRoom;
    var previewTracks;
    var identity;
    var roomName;

    // Attach the Tracks to the DOM.
    function attachTracks(tracks, container) {
      tracks.forEach(function(track) {
        if (track.kind !== "data") {
          container.appendChild(track.attach());
        }
      });
    }

    // Attach the Participant's Tracks to the DOM.
    function attachParticipantTracks(participant, container) {
      var tracks = Array.from(participant.tracks.values());
      attachTracks(tracks, container);
    }

    // Detach the Tracks from the DOM.
    function detachTracks(tracks) {
      tracks.forEach(function(track) {
        track.detach().forEach(function(detachedElement) {
          detachedElement.remove();
        });
      });
    }

    // Detach the Participant's Tracks from the DOM.
    function detachParticipantTracks(participant) {
      var tracks = Array.from(participant.tracks.values());
      detachTracks(tracks);
    }

    // When we are about to transition away from this page, disconnect
    // from the room, if joined.
    window.addEventListener("beforeunload", leaveRoomIfJoined);

    /**
     * Setup a LocalAudioTrack and LocalVideoTrack to render to a <video> element.
     * @param {HTMLVideoElement} video
     * @returns {Promise<Array<LocalAudioTrack|LocalVideoTrack>>} audioAndVideoTrack
     */
    async function setupLocalAudioAndVideoTracks(video) {
      const audioAndVideoTrack = await createLocalTracks();
      audioAndVideoTrack.forEach(track => track.attach(video));
      return audioAndVideoTrack;
    }

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

        // // Bind button to join Room.
        // document.getElementById("button-join").onclick = function() {
        //   roomName = document.getElementById("room-name").value;
        //   if (!roomName) {
        //     alert("Please enter a room name.");
        //     return;
        //   }

        //   log("Joining room '" + roomName + "'...");
        //   var connectOptions = {
        //     name: roomName,
        //     logLevel: "debug"
        //   };

        //   if (previewTracks) {
        //     connectOptions.tracks = previewTracks;
        //   }

        //   // Join the Room with the token from the server and the
        //   // LocalParticipant's Tracks.

        //   Video.connect(data.token, connectOptions).then(roomJoined, function(
        //     error
        //   ) {
        //     log("Could not connect to Twilio: " + error.message);
        //   });
        // };

        // // Bind button to leave Room.
        // document.getElementById("button-leave").onclick = function() {
        //   log("Leaving room...");
        //   activeRoom.disconnect();
        // };
      }
    );

    // Successfully connected!
    function roomJoined(room) {
      window.room = activeRoom = room;

      log("Joined as '" + identity + "'");

      log("RoomSID: " + room.sid);

      // add the dataTrack after the room is joined
      room.localParticipant.publishTrack(dataTrack);

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
      room.on("trackAdded", function(track, participant) {
        log(participant.identity + " added track: " + track.kind);
        var previewContainer = document.getElementById("remote-media");

        if (track.kind === "data") {
          track.on("message", data => {
            console.log("getting a data track message");
            console.log(data);
            if (data.includes("VIDEO")) {
              onToggleShowVideo();
            }

            if (data.includes("jpeg")) {
              console.log("just got a new screenshot...");
              $("img")[0].src = data;

              // this.setState({
              //             gotScreenshot: data
              //         });
              //     }.bind(this)
            }

            if (data.includes("PROMPT")) {
              let promptNum = parseInt(data.substring(data.length - 1)); // grab the last character

              console.log(PromptAudioOptions);
              console.log(promptNum);
              console.log(
                PromptAudioOptions[
                  Object.keys(PromptAudioOptions)[promptNum - 1]
                ]
              );

              if (promptNum < 5) {
                playSound(
                  PromptAudioOptions[
                    Object.keys(PromptAudioOptions)[promptNum - 1]
                  ]
                );
              } else {
                // a repeat prompt
                playSound(lastQuestionAudioFile);
              }
            }
          });
        }

        attachTracks([track], previewContainer);
      });

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
        document.getElementById("button-join").style.display = "inline";
        document.getElementById("button-leave").style.display = "none";
      });

      // start on mute for the grader
      if (audioToggleButton) {
        room.localParticipant.audioTracks.forEach(function(
          audioTrack,
          key,
          map
        ) {
          console.log("muting this users audio");
          audioTrack.disable();
        });
      }

      if (videoToggleButton) {
        room.localParticipant.videoTracks.forEach(function(
          videoTrack,
          key,
          map
        ) {
          console.log("muting this users video");
          videoTrack.disable();
        });
      }

      if (audioToggleButton) {
        document.getElementById("audio-toggle-off").onclick = function() {
          room.localParticipant.audioTracks.forEach(function(
            audioTrack,
            key,
            map
          ) {
            console.log("muting this users audio");
            audioTrack.disable();
          });
        };

        document.getElementById("audio-toggle-on").onclick = function() {
          room.localParticipant.audioTracks.forEach(function(
            audioTrack,
            key,
            map
          ) {
            console.log("enabling this users audio");
            audioTrack.enable();
          });
        };
      }

      if (videoToggleButton) {
        document.getElementById("video-toggle-off").onclick = function() {
          dataTrack.send("VIDEO-OFF");

          room.localParticipant.videoTracks.forEach(function(
            videoTrack,
            key,
            map
          ) {
            console.log("muting this users video");
            videoTrack.disable();
          });
        };

        document.getElementById("video-toggle-on").onclick = function() {
          dataTrack.send("VIDEO-ON");

          room.localParticipant.videoTracks.forEach(function(
            videoTrack,
            key,
            map
          ) {
            console.log("enabling this users video");
            videoTrack.enable();
          });
        };
      }
    }

    // // Preview LocalParticipant's Tracks.
    // document.getElementById("button-preview").onclick = function() {
    //   console.log("I CLICKED IT PREVIEW");
    //   var localTracksPromise = previewTracks
    //     ? Promise.resolve(previewTracks)
    //     : Video.createLocalTracks();

    //   localTracksPromise.then(
    //     function(tracks) {
    //       window.previewTracks = previewTracks = tracks;
    //       var previewContainer = document.getElementById("local-media");
    //       if (!previewContainer.querySelector("video")) {
    //         attachTracks(tracks, previewContainer);
    //       }
    //     },
    //     function(error) {
    //       console.error("Unable to access local media", error);
    //       log("Unable to access Camera and Microphone");
    //     }
    //   );
    // };

    // Activity log.
    function log(message) {
      if (!showLogs) {
        return;
      }

      var logDiv = document.getElementById("log");
      logDiv.innerHTML += "<p>&gt;&nbsp;" + message + "</p>";
      logDiv.scrollTop = logDiv.scrollHeight;
    }

    // Leave Room.
    function leaveRoomIfJoined() {
      if (activeRoom) {
        activeRoom.disconnect();
      }
    }
  }

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
            <div className={[styles.compPromptContainer, styles.block]}>
              <h4>Immediate, Live Prompts</h4>
              <ButtonGroup
                className={[
                  styles.fluencyButtonGroup,
                  styles.promptButtonGroup
                ].join(" ")}
              >
                <Button href="#" onClick={() => this.onPromptClicked(1, true)}>
                  Tell some more
                </Button>
                <Button href="#" onClick={() => this.onPromptClicked(2, true)}>
                  What in the story makes you think that?
                </Button>
                <Button href="#" onClick={() => this.onPromptClicked(3, true)}>
                  Why is that important?
                </Button>
                <Button href="#" onClick={() => this.onPromptClicked(4, true)}>
                  Why do you think that?
                </Button>
                <Button href="#" onClick={() => this.onPromptClicked(5, true)}>
                  Repeat the question
                </Button>
                <Button href="#" onClick={() => this.onPromptClicked(6, true)}>
                  <strong>No prompt needed</strong>
                </Button>
              </ButtonGroup>
            </div>
          )}

          {this.props.logs && (
            <div id="log" style={{ visibility: "visible" }} />
          )}
          {this.props.logs && (
            <div id="screencast">
              <img style={{ width: "100%" }} />
            </div>
          )}
        </div>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js" />
      </div>
    );
  }
}
