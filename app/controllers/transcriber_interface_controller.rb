
class TranscriberInterfaceController < ApplicationController
  layout "transcriber_interface"

  def index
    @transcriber_interface_props = {
      name: "Chanel Brown",
      recordingURL: "localhost:3000/audio/recording_countdown.mp3"
    }
  end


end