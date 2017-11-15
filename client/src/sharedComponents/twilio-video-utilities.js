// Attach the Tracks to the DOM.
export function attachTracks(tracks, container) {
  tracks.forEach(function(track) {
    if (track.kind !== "data") {
      container.appendChild(track.attach());
    }
  });
}

// Attach the Participant's Tracks to the DOM.
export function attachParticipantTracks(participant, container) {
  var tracks = Array.from(participant.tracks.values());
  attachTracks(tracks, container);
}

// Detach the Tracks from the DOM.
export function detachTracks(tracks) {
  tracks.forEach(function(track) {
    if (track.kind !== "data") {
      track.detach().forEach(function(detachedElement) {
        detachedElement.remove();
      });
    }
  });
}

// Detach the Participant's Tracks from the DOM.
export function detachParticipantTracks(participant) {
  var tracks = Array.from(participant.tracks.values());

  detachTracks(tracks);
}

// Activity log.
export function log(message) {
  if (!document.getElementById("log")) {
    return;
  }

  var logDiv = document.getElementById("log");
  logDiv.innerHTML += "<p>&gt;&nbsp;" + message + "</p>";
  logDiv.scrollTop = logDiv.scrollHeight;
}

// Leave Room.
export function leaveRoomIfJoined() {
  if (activeRoom) {
    activeRoom.disconnect();
  }
}


