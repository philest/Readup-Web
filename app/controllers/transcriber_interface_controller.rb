
class TranscriberInterfaceController < ApplicationController
  layout "transcriber_interface"

  def index
    @transcriber_interface_props = {
      name: "Demo Student",
      email: "testemail@gmail.com",
      bookTitle: "Firefly Night",
      bookLevel: "H",
      recordingURL: "https://s3-us-west-2.amazonaws.com/readup-now/fake-assessments/2017-08-16+19%3A36%3A30+%2B0000/recording.webm"
    }
  end


end