require 'twilio-ruby'

if ENV['RAILS_ENV'] != 'production'
	require 'dotenv'
	Dotenv.load
end 


require 'net/http'


class VideoController < ApplicationController
skip_before_action :verify_authenticity_token


	def token 

		# Required for Video
		identity = params[:identity] 
		room = params[:room] 



		# Create Video grant for our token
		video_grant = Twilio::JWT::AccessToken::VideoGrant.new
		video_grant.room = room

		# Create an Access Token
		token = Twilio::JWT::AccessToken.new(
		  ENV['TWILIO_ACCOUNT_SID'],
		  ENV['TWILIO_API_KEY'],
		  ENV['TWILIO_API_SECRET'],
		  [video_grant],
		  identity: identity
		)


		# Create the room here, instead of on join. 

		client = Twilio::REST::Client.new(ENV['TWILIO_API_KEY'], ENV['TWILIO_API_SECRET'])


		rooms = client.video.rooms.list(unique_name: room)

		puts "Rooms with name #{room}: ", rooms
			
		if (!rooms)
			group_room = client.video.rooms.create(
			  unique_name: room,
			  type: 'group',
			  record_participants_on_connect: true,
			  status_callback: "https://www.readupnow.com/room_events",
			  status_callback_method: 'POST'
			)
		end


		puts 'JWT token: ', token.to_jwt
		puts "Token: ", token 

		respond_to do |format|
			msg = { :identity => identity, :token => token.to_jwt, :room => room}
			format.json  { render :json => msg } # don't do msg.to_json
		end


	end 


	def room_events 

		puts 'HERE IN THE status_callback'
		puts params 

		params.each do |key, value|
			puts key, value 
		end 

		head 200

	end 


	def list_active_rooms 


		puts "in list_active_rooms..."

		# Get your Account Sid and Auth Token from https://www.twilio.com/console
		client = Twilio::REST::Client.new(ENV['TWILIO_API_KEY'], ENV['TWILIO_API_SECRET'])

		rooms_by_status = client.video.rooms.list(status: 'in-progress')

		puts rooms_by_status

		if (!rooms_by_status) 
			puts "No active rooms."
		end 

		unique_names = []
		room_SIDs = []


		rooms_by_status.each do |room|
		  unique_names.push(room.unique_name)
		  room_SIDs.push(room.sid)
		  puts "Name: #{room.unique_name}, SID: #{room.sid}"
		end


	    msg = { :status => "ok", 
	    		:numActiveRooms => "#{rooms_by_status ? rooms_by_status.length : 0}",
	    		:names => "#{unique_names}",
	    		:SIDs => "#{room_SIDs}"
	     }
	    render :json => msg

		# respond_to do |format|
		# 	msg = { :numRoomsActive => rooms_by_status.length}
		# 	format.json  { render :json => msg } # don't do msg.to_json
		# end

	end 


	def last_completed_room_sid 

		puts "in last_completed_room_sid..."

		# Get your Account Sid and Auth Token from https://www.twilio.com/console
		client = Twilio::REST::Client.new(ENV['TWILIO_API_KEY'], ENV['TWILIO_API_SECRET'])

		rooms_by_status = client.video.rooms.list(status: 'completed')

		puts rooms_by_status.last

		if (!rooms_by_status) 
			puts "No completed rooms."
		end 


	    msg = { :status => "ok", :name => "#{rooms_by_status ? rooms_by_status.first.unique_name : nil}", :room_sid => "#{rooms_by_status ? rooms_by_status.first.sid : nil}" }
	    render :json => msg

		# respond_to do |format|
		# 	msg = { :numRoomsActive => rooms_by_status.length}
		# 	format.json  { render :json => msg } # don't do msg.to_json
		# end

	end 


	def recording_sid

		puts "in recording_sid..."

		client = Twilio::REST::Client.new(ENV['TWILIO_API_KEY'], ENV['TWILIO_API_SECRET'])

		room_sid = params['room_sid']

		room_recordings = client.video.rooms(room_sid)
		                              .recordings.list()

		room_recordings.each do |recording|
		  puts recording.sid
		end

	    msg = { :status => "ok", :room_sid => room_sid,  :room_recordings => "#{room_recordings}", :room_recording_sid => "#{room_recordings.first.sid}",}
	    render :json => msg

	end 




	def actual_recording 

		client = Twilio::REST::Client.new(ENV['TWILIO_API_KEY'], ENV['TWILIO_API_SECRET'])

		room_sid = params['room_sid']
		recording_sid = params['recording_sid']

		uri = "https://video.twilio.com/v1/Recordings/#{recording_sid}/Media"
		response = client.request('https://video.twilio.com', 443, 'GET', uri)
		media_location = response.body['redirect_to']
		puts media_location


		open("#{recording_sid}.out", 'w') {|out|
		    Net::HTTP.get_response(URI(media_location)) {|response|
		        response.read_body {|part|
		            out.write part
		        }
		    }
		}

	end 




end



