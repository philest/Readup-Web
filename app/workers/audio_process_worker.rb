class AudioProcessWorker
  include Sidekiq::Worker
  sidekiq_options retry: false

  def perform(save_path, save_path_complete, file_name)
    `(ffmpeg -i #{save_path_complete} #{save_path}#{file_name}.mp3)`
    `(rm #{save_path}#{file_name})`

    save_path_converted = save_path + file_name + ".mp3"

    obj = S3_BUCKET.object(file_name + ".mp3")

    obj.upload_file(save_path_converted)

    `(rm #{save_path_converted})`

    puts "INSERTED-NOTE: AudioProcessWorker Finished Job."
  end
end
