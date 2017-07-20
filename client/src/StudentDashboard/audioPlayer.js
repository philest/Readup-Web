const DEV_DISABLE_VOICE_INSTRUCTIONS = false



let audio = null

export function playSound(file) {
  if (DEV_DISABLE_VOICE_INSTRUCTIONS) {
    return
  }

  if (!!audio) {
    audio.pause()
  }

  console.log('Playing Sound: ' + file)

  audio = new Audio(file);
  audio.addEventListener('ended', function() {
      audio = null
  });
  audio.play();

}

export function stopAudio() {
  if (!!audio) {
    audio.pause()
    audio = null
  }
}

