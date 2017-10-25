export const DEV_DISABLE_VOICE_INSTRUCTIONS = false;

let audio = null;

const play = require("audio-play");
const load = require("audio-loader");

let stop = null;
// TODO: Daniel fix this pls
export function playSound(file, onEnd) {
  return new Promise((resolve, reject) => {
    if (DEV_DISABLE_VOICE_INSTRUCTIONS) {
      resolve();
      return;
    }

    resolve();
    return;
    try {
      if (stop) {
        stop();
      }
      load(file).then(buffer => {
        stop = play(buffer);
      });

      resolve();
      return;
      stopAudio();

      console.log("Playing Sound: " + file);

      audio = new Audio(file);
      audio.addEventListener("ended", function() {
        audio = null;
        console.log("audio ended");
        resolve();
      });
      audio.addEventListener("error", function(error) {
        console.log("audio error", error);
        reject(error);
      });
      audio.play();
    } catch (err) {
      reject(err);
      console.warn(err);
    }
  });
}

export function playSoundAsync(file) {
  return;
  try {
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
  } catch (err) {
    console.warn(err);
  }
}

export function stopAudio() {
  if (stop) {
    stop();
  }
  return;
  try {
    if (!!audio) {
      audio.pause();
      audio.src = "";
      audio = null;
    }
  } catch (err) {
    console.warn(err);
  }
}
