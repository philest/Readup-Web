
class ReportsController < ApplicationController
  layout "reports"

  def index
    @reports_interface_props = {
      name: "Sofia Vergara",
      email: "testemail@gmail.com",
      bookTitle: "No More Magic",
      bookLevel: "Level R",
      recordingURL: "https://s3-us-west-2.amazonaws.com/readup-now/website/homepage/sofia.wav"
    }
  end


end