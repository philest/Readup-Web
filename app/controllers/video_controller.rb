require 'twilio-ruby'

if ENV['RAILS_ENV'] != 'production'
	require 'dotenv'
	Dotenv.load
end 


class VideoController < ApplicationController

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

	rooms_by_status.each do |room|
	  puts room.sid
	end


    msg = { :status => "ok", :numActiveRooms => "#{rooms_by_status ? rooms_by_status.length : 0}",
    		:name => "#{rooms_by_status ? rooms_by_status.first.unique_name : nil}", :roomSID => "#{rooms_by_status ? rooms_by_status.first.sid : nil}"
     }
    render :json => msg

	# respond_to do |format|
	# 	msg = { :numRoomsActive => rooms_by_status.length}
	# 	format.json  { render :json => msg } # don't do msg.to_json
	# end


end 





end



