require 'twilio-ruby'
require 'dotenv'
Dotenv.load


class VideoController < ApplicationController

def token 

# Required for Video
identity = 'user'

# Create Video grant for our token
video_grant = Twilio::JWT::AccessToken::VideoGrant.new
video_grant.room = 'coolRoom'

# Create an Access Token
token = Twilio::JWT::AccessToken.new(
  ENV['TWILIO_ACCOUNT_SID'],
  ENV['TWILIO_API_KEY'],
  ENV['TWILIO_API_SECRET'],
  [video_grant],
  identity: identity
)

puts 'JWT token: ', token.to_jwt
puts "Token: ", token 

token.to_jwt


end 



# identity = 'alice'

# # Create an Access Token
# token = Twilio::JWT::AccessToken.new(ENV['TWILIO_ACCOUNT_SID'],
#   ENV['TWILIO_API_KEY'], ENV['TWILIO_API_SECRET'], identity);

# puts( ENV['TWILIO_ACCOUNT_SID'], ENV['TWILIO_API_KEY'], ENV['TWILIO_API_SECRET'] )
# puts token

# # Create Video grant for our token
# grant = Twilio::JWT::AccessToken::VideoGrant.new
# grant.room = 'DailyStandup'

# puts grant 

# token.add_grant(grant)

# token.to_jwt

# end


#   puts ENV['TWILIO_ACCOUNT_SID']
#   puts ENV['TWILIO_API_KEY']

#   identity = params[:identity] || 'identity'

#   # Create an Access Token for Video usage
#   token = Twilio::JWT::AccessToken.new ENV['TWILIO_ACCOUNT_SID'],
#   ENV['TWILIO_API_KEY'], ENV['TWILIO_API_SECRET'], identity

#   # Grant access to Video
#   grant = Twilio::JWT::AccessToken::VideoGrant.new
#   grant.room = params[:room]
#   token.add_grant grant

#   # Generate the token and send to client
#    token.to_jwt
# end 





end



