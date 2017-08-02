
class ReportsController < ApplicationController
  layout "reports"

  def index
    @reports_interface_props = {
      name: "Chanel Brown",
      email: "testemail@gmail.com",
      bookTitle: "Firefly Night",
      bookLevel: "Level H",
      recordingURL: "http://www.noiseaddicts.com/samples_1w72b820/142.mp3"
    }
  end


end