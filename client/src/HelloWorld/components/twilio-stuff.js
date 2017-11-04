var activeRoom;
var previewTracks;
var identity;
var roomName;

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
$.getJSON("/token?identity=user&room=example", function(data) {
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
