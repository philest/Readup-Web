
class TranscriberInterfaceController < ApplicationController
  layout "transcriber_interface"

  def index
    if params['teacher_id'] == "sample"
     @transcriber_interface_props = {
        name: "Sofia Vergara",
        email: "testemail@gmail.com",
        bookTitle: "No More Magic",
        bookLevel: "R",
        recordingURL: "https://s3-us-west-2.amazonaws.com/readup-now/website/homepage/sofia.wav"
      }
    else
     @transcriber_interface_props = {
        name: "Demo Student",
        email: "demo@readup.com",
        bookTitle: "Firefly Night",
        bookLevel: "H",
        recordingURL: Assessment.last.book_key,

      }
    end 

  end


end