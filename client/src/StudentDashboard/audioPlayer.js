export const DEV_DISABLE_VOICE_INSTRUCTIONS = false;

let audio = null;

// Safari 3.0+ "[object HTMLElementConstructor]"
var isSafari =
  /constructor/i.test(window.HTMLElement) ||
  (function(p) {
    return p.toString() === "[object SafariRemoteNotification]";
  })(
    !window["safari"] ||
      (typeof safari !== "undefined" && safari.pushNotification)
  );

// TODO: Daniel fix this pls
export function playSound(file, onEnd) {
  if (isSafari) {
    return;
  }

  return new Promise((resolve, reject) => {
    if (DEV_DISABLE_VOICE_INSTRUCTIONS) {
      resolve();
      return;
    }

    if (!!audio) {
      audio.pause();
    }

    console.log("Playing Sound: " + file);

    audio = new Audio(file);
    audio.addEventListener("ended", function() {
      audio = null;
      console.log("audio ended");
      resolve();
    });
    audio.addEventListener("error", function(error) {
      console.log("audio error");
      reject(error);
    });
    audio.play();
  });
}

export function playSoundAsync(file) {
  if (isSafari) {
    return;
  }

  if (!!audio) {
    audio.pause();

    // BEGIN toggle off audio when the same file is replayed
    let prevFileName = audio.src.substr(audio.src.lastIndexOf("/") + 1);
    let currFileName = file.substr(file.lastIndexOf("/") + 1);

    if (prevFileName === currFileName) {
      audio = null;
      return;
    }
    // END toggle off audio
  }
  console.log("Playing Sound: " + file);
  audio = new Audio(file);
  audio.play();
}

export function stopAudio() {
  if (isSafari) {
    return;
  }

  if (!!audio) {
    audio.pause();
    audio = null;
  }
}
