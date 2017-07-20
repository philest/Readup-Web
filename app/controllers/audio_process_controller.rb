class AudioProcessController < ApplicationController
	before_action :set_s3_direct_post

	def index
		render 'audio'
	end

	def save_file
		puts (Time.now.to_f * 1000).to_i
		audio = params[:audio]
		save_path = Rails.root.join("public/")
		save_path_complete = save_path + audio.original_filename

		audio.rewind

	    # Open and write the file to file system.
	  File.open(save_path_complete, 'wb') do |f|
	    f.write audio.read
	  end
	  puts (Time.now.to_f * 1000).to_i

	  audio.rewind

	  AudioProcessWorker.perform_async(save_path, save_path_complete, audio.original_filename)
	  
	  puts (Time.now.to_f * 1000).to_i
    	redirect_to action: 'index', status: 200

	end

	private
	def set_s3_direct_post
    	@s3_direct_post = S3_BUCKET.presigned_post(key: "uploads/#{SecureRandom.uuid}/${filename}", success_action_status: '201', acl: 'public-read')
    	puts @s3_direct_post.fields
  	end
end
