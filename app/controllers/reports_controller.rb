# TODO stuff this in a config/pony instead 
require 'pony'
Pony.options = {
  :via => :smtp,
  :via_options => {
    :address => 'smtp.sendgrid.net',
    :port => '587',
    :domain => 'heroku.com',
    :user_name => ENV['SENDGRID_USERNAME'],
    :password => ENV['SENDGRID_PASSWORD'],
    :authentication => :plain,
    :enable_starttls_auto => true
  }
}

require 'twilio-ruby'





class ReportsController < ApplicationController
  skip_before_action :verify_authenticity_token
  layout "reports"

  def index
    @reports_interface_props = {
      name: "Sofia Vergara",
      email: "testemail@gmail.com",
      bookTitle: "No More Magic",
      bookLevel: "Level R",
      recordingURL: "https://s3-us-west-2.amazonaws.com/readup-now/website/homepage/sofia.wav"
    }



    # In case an email submit 
#    if params["message"] && (ENV['RAILS_ENV'] == 'production')
     if params["message"] 
      puts "Pony is sending this message....\n\n" + params["message"]

      Pony.mail(to: 'philesterman@gmail.com',
                 subject: "#{params["subject"]}",
                 body: "#{params["message"]}",
                 from: 'noreply@yoursammybird.com')



      account_sid = ENV['TWILIO_ACCOUNT_SID'] # Your Account SID from www.twilio.com/console
      auth_token = ENV['TWILIO_AUTH_TOKEN'] # Your Auth Token from www.twilio.com/console


      @client = Twilio::REST::Client.new account_sid, auth_token
      message = @client.messages.create(
          body: "#{params["message"]}",
          to: "+15612125831",    # Replace with your phone number
          from: "+12033035711")  # Replace with your Twilio number

      puts message.sid



    end

  end

  # TODO for some reason this route is never entered
  def email_submit
    puts "\n\ninside the email_submit controller\n\n"
    puts params["message"]
    puts params["recipient"]

    logger.info("THIS IS A TEST")

    # puts params[:params]
    # TODO mail this shitttt 
  end 


end