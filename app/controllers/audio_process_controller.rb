class AudioProcessController < ApplicationController

  def index
    render 'audio'
  end

  def save_file

    start_time = (Time.now.to_f * 1000).to_i
    puts start_time

    audio = params[:audio]
    save_path = Rails.root.join("tmp/")
    save_path_complete = save_path + audio.original_filename

    audio.rewind

    # Open and write the file to file system.
    File.open(save_path_complete, 'wb') do |f|
      f.write audio.read
    end

    end_time = (Time.now.to_f * 1000).to_i
    puts end_time

    audio.rewind

    AudioProcessWorker.perform(
      save_path,
      save_path_complete,
      audio.original_filename
    )

    end_time_2 = (Time.now.to_f * 1000).to_i
    puts end_time_2

    redirect_to action: 'index', status: 200

  end

end
