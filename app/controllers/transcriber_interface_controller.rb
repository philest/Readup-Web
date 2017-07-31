
class TranscriberInterfaceController < ApplicationController
  layout "transcriber_interface"

  def index
    @transcriber_interface_props = {
      name: "Chanel Brown",
      email: "testemail@gmail.com",
      bookTitle: "Firefly Night",
      bookLevel: "Level H",
      recordingURL: "http://www.noiseaddicts.com/samples_1w72b820/142.mp3"
    }
  end


end