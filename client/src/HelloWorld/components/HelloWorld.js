import PropTypes from "prop-types";
import React from "react";
import styles from "./poop.css";
// import twilioStuff from "./twilio-stuff.js";

export default class HelloWorld extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired // this is passed from the Rails view
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);

    // How to set initial state in ES6 class syntax
    // https://facebook.github.io/react/docs/reusable-components.html#es6-classes
    this.state = { name: this.props.name };
  }

  updateName = name => {
    this.setState({ name });
  };

  componentDidMount() {
    const Video = require("twilio-video");

    var activeRoom;
    var previewTracks;
    var identity;
    var roomName;

    console.log("IT LOADED");

    // Attach the Tracks to the DOM.
    function attachTracks(tracks, container) {
      tracks.forEach(function(track) {
        container.appendChild(track.attach());
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

    // Obtain a token from the server in order to connect to the Room.
    $.getJSON("/token?identity=alice&room=example", function(data) {
      identity = "alice";

      // identity = data.identity;

      document.getElementById("room-controls").style.display = "block";

      // Bind button to join Room.
      document.getElementById("button-join").onclick = function() {
        roomName = document.getElementById("room-name").value;
        if (!roomName) {
          alert("Please enter a room name.");
          return;
        }

        log("Joining room '" + roomName + "'...");
        var connectOptions = {
          name: roomName,
          logLevel: "debug"
        };

        if (previewTracks) {
          connectOptions.tracks = previewTracks;
        }

        // Join the Room with the token from the server and the
        // LocalParticipant's Tracks.

        token =
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2ZjZjM4NmFlNjlkMGEzMWE5ZGUxZTA5Y2MwZDFhMThjLTE1MDk3NzUzNDAiLCJpc3MiOiJTS2ZjZjM4NmFlNjlkMGEzMWE5ZGUxZTA5Y2MwZDFhMThjIiwic3ViIjoiQUNlYTE3ZTBiYmEzMDY2MDc3MGY2MmIxZTI4ZTEyNjk0NCIsImV4cCI6MTUwOTc3ODk0MCwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiYWxpY2UiLCJ2aWRlbyI6eyJyb29tIjoidGVzdCJ9fX0.IOoO17qIL16nlkiBJnU_ebggd6dxFHrVuHOtfM0qjOA";

        Video.connect(token, connectOptions).then(roomJoined, function(error) {
          log("Could not connect to Twilio: " + error.message);
        });

        // Video.connect(data.token, connectOptions).then(roomJoined, function(error) {
        //   log("Could not connect to Twilio: " + error.message);
        // });
      };

      // Bind button to leave Room.
      document.getElementById("button-leave").onclick = function() {
        log("Leaving room...");
        activeRoom.disconnect();
      };
    });

    // Successfully connected!
    function roomJoined(room) {
      window.room = activeRoom = room;

      log("Joined as '" + identity + "'");
      document.getElementById("button-join").style.display = "none";
      document.getElementById("button-leave").style.display = "inline";

      // Attach LocalParticipant's Tracks, if not already attached.
      var previewContainer = document.getElementById("local-media");
      if (!previewContainer.querySelector("video")) {
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
    }

    // Preview LocalParticipant's Tracks.
    document.getElementById("button-preview").onclick = function() {
      console.log("I CLICKED IT PREVIEW");
      var localTracksPromise = previewTracks
        ? Promise.resolve(previewTracks)
        : Video.createLocalTracks();

      localTracksPromise.then(
        function(tracks) {
          window.previewTracks = previewTracks = tracks;
          var previewContainer = document.getElementById("local-media");
          if (!previewContainer.querySelector("video")) {
            attachTracks(tracks, previewContainer);
          }
        },
        function(error) {
          console.error("Unable to access local media", error);
          log("Unable to access Camera and Microphone");
        }
      );
    };

    // Activity log.
    function log(message) {
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

body,
p {
  padding: 0;
  margin: 0;
}

body {
  background: #272726;
}

div#remote-media {
  height: 43%;
  width: 100%;
  background-color: #fff;
  text-align: center;
  margin: auto;
}

div#remote-media video {
  border: 1px solid #272726;
  margin: 3em 2em;
  height: 70%;
  max-width: 27% !important;
  background-color: #272726;
  background-repeat: no-repeat;
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
`}
        </style>
        <div id="remote-media" />
        <div id="controls">
          <div id="preview">
            <p className="instructions">Hello Beautiful</p>
            <div id="local-media" />
            <button id="button-preview">Preview My Camera</button>
          </div>
          <div id="room-controls">
            <p className="instructions">Room Name:</p>
            <input id="room-name" type="text" placeholder="Enter a room name" />
            <button id="button-join">Join Room</button>
            <button id="button-leave">Leave Room</button>
          </div>
          <div id="log" />
        </div>
        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js" />
      </div>
    );
  }
}
