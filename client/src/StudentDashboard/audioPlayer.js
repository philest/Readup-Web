const DEV_DISABLE_VOICE_INSTRUCTIONS = false

let audio = null

export function playSound(file, onEnd) {
  return new Promise((resolve, reject) => {
    if (DEV_DISABLE_VOICE_INSTRUCTIONS) {
      resolve()
      return
    }

    if (!!audio) {
      audio.pause()
    }

    console.log('Playing Sound: ' + file)

    audio = new Audio(file);
    audio.addEventListener('ended', function() {
      audio = null
      console.log("audio ended")
      resolve()
    });
    audio.addEventListener('error', function(error) {
      console.log("audio error")
      reject(error)
    })
    audio.play();
  })

}

export function stopAudio() {
  if (!!audio) {
    audio.pause()
    audio = null
  }
}

