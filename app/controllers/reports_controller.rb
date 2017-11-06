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

    if params['user_id'] == "sample" || params['user_id'] == "direct-sample"

      @user = User.last
      @student = @user.teachers.last.classrooms.last.students.last
      @assessment = @student.assessments.last
      is_direct_sample = (params['user_id'] == "direct-sample")


      @student_responses = @assessment.student_responses
      @grader_comments = @assessment.grader_comments
      @comp_scores = @assessment.comp_scores


      if (@student_responses === nil)
        @student_responses = { '0' => '',
                               '1' => '',
                               '2' => '',
                               '3' => ''
                             }
      end 

      if (@grader_comments === nil)
        @grader_comments = {   '0' => '',
                               '1' => '',
                               '2' => '',
                               '3' => ''
                             }
      end 

      if (@comp_scores === nil)
        @comp_scores = {       '0' => nil,
                               '1' => nil,
                               '2' => nil,
                               '3' => nil
                             }
      end


      if (params['brand']) 
        brand = params['brand']
      
      else
        brand = @assessment.brand 
      end 



      @reports_interface_props = {
        name: "Maya De Leon",
        email: "testemail@gmail.com",
        bookTitle: "No More Magic",
        bookLevel: "R",
        stepLevel: "12",
        recordingURL: "https://s3-us-west-2.amazonaws.com/readup-now/website/homepage/sofia.wav",
        scoredText: "Fake!",
        userID: @user.id,
        assessmentID: @assessment.id, 
        whenCreated: (@assessment.updated_at.to_f*1000).to_i, # convert into ms since 1970 for equality with Rails date
        whenCreatedDate: @assessment.updated_at.to_s,
        isSample: true,
        isDirectSample: is_direct_sample, 
        isScoredPrior: @assessment.scored,
        isUnscorable: false,
        fluencyScore: 2,

        scorerProfilePicURL: "/images/lakia.png",
        scorerSignature: "Lakia Kenan, M.Ed",
        scorerResumeURL: "https://dcps.dc.gov/page/lakia-kenan",
        scorerJobTitle: "Reading Specialist",
        scorerEducation: "M.Ed in Reading Education (Trinity)",
        scorerExperience: "9 years at Orr Elementary",
        scorerEmail: "lakia@readupnow.com",
        scorerFirstName: "Lakia",
        scorerLastName: "Kenan",
        scorerFullName: "Lakia Kenan",

        reviewerSignature: "Ashley Brantley, M.A.",
        reviewerProfilePicURL: "/images/ashley.png",
        assessmentBrand: brand,
        isLiveDemo: @assessment.is_live_demo,
        env: ENV['RAILS_ENV'],

        compScores: @comp_scores,
        graderComments: @grader_comments,
        studentResponses: @student_responses,

        teacherNote: "Maya’s early behaviors are under control. Consistently using meaning and structure of sentences to solve words. A big difficulty is limited self-monitoring, with Maya often reading without attending to checking for meaning, self-monitoring, and self-correcting. Fluency seems strong, as does rate, but the high rate may be causing Maya do self-monitor less.  Retelling is strong, but Maya is having more difficulty with higher-order comprehension. Instruction needs to focus on self-monitoring and using all sources of information (meaning, structure, visual) to improve accuracy."


      }

    elsif params['user_id'].to_i > 0 # Not the email_submit hack 

      @user = User.find(params['user_id'])
      @student = @user.teachers.last.classrooms.last.students.last
      @assessment = @student.assessments.last


      # Backwards compatability to non-comp users... 


      assessmentBrand = @assessment.brand

      # For backward compatitibility, only use the new recordingURL for new users...
      if (@user.id <= 102)
        recordingURL = @assessment.book_key # old hack...
         assessmentBrand ||= "FP"
      else 
        recordingURL = "https://s3-us-west-2.amazonaws.com/readup-now/fake-assessments/#{ENV['RAILS_ENV']}/#{@user.id}/recording.webm"
        compRecordingURL = "https://s3-us-west-2.amazonaws.com/readup-now/fake-assessments/#{ENV['RAILS_ENV']}/#{@user.id}/comp/recording.webm"
        assessmentBrand ||= "FP"
      end 


      book_key = @assessment.book_key 
      book_key ||= 'firefly'


      if book_key === 'nick'
        title = "Bedtime for Nick"
        level = "G"
        stepLevel = "5"
      elsif book_key === 'step'
        title = "Upside Down"
        level = "E"
        stepLevel = "4"

      else 
        title = "Firefly Night"
        level = "F"
        stepLevel = '4'
      end 


      @student_responses = @assessment.student_responses
      @grader_comments = @assessment.grader_comments
      @comp_scores = @assessment.comp_scores


      if (@student_responses === nil)
        @student_responses = { '0' => '',
                               '1' => '',
                               '2' => '',
                               '3' => '',
                               '4' => '',
                               '5' => ''
                             }
      end 

      if (@grader_comments === nil)
        @grader_comments = {   '0' => '',
                               '1' => '',
                               '2' => '',
                               '3' => '',
                               '4' => '',
                               '5' => ''
                             }
      end 

      if (@comp_scores === nil)
        @comp_scores = {       '0' => nil,
                               '1' => nil,
                               '2' => nil,
                               '3' => nil,
                               '4' => nil,
                               '5' => nil
                             }
      end


      @reports_interface_props = {
        name: "#{@student.first_name} #{@student.last_name}",
        email: "#{@user.email}",
        bookTitle: title,
        bookLevel: level,
        stepLevel: stepLevel,
        recordingURL: recordingURL,
        compRecordingURL: compRecordingURL,
        scoredText: @assessment.scored_text,
        userID: @user.id,
        assessmentID: @assessment.id, 
        whenCreated: (@assessment.updated_at.to_f*1000).to_i, # convert into ms since 1970 for equality with Rails date
        whenCreatedDate: @assessment.updated_at.to_s,
        isSample: false,
        isDirectSample: false, 
        isScoredPrior: @assessment.scored,
        isUnscorable: @assessment.unscorable,
        fluencyScore: @assessment.fluency_score,
        compScores: @comp_scores,
        graderComments: @grader_comments,
        studentResponses: @student_responses,

        scorerProfilePicURL: "/images/tedra.png",
        scorerSignature: "Tedra Matthews, M.A.",
        scorerResumeURL: "https://www.linkedin.com/in/tedra-matthews-a675095a/",
        scorerJobTitle: "Reading Specialist",
        scorerEducation: "M.A. in Language & Literacy (SFSU)",
        scorerExperience: "13 years at SFUSD",
        scorerEmail: "tedra@readupnow.com",
        scorerFirstName: "Tedra",
        scorerLastName: "Matthews",
        scorerFullName: "Tedra Matthews",

        reviewerSignature: "Maria Contreras, M.Ed",
        reviewerProfilePicURL: "/images/maria-small.png",
        assessmentBrand: assessmentBrand,
        isLiveDemo: false,
        bookKey: book_key,
        env: ENV['RAILS_ENV'],
        teacherNote: @assessment.teacher_note,
        totalTimeReading: @assessment.total_time_reading,
        scoredSpelling: @assessment.scored_spelling,

      }
    end


        # BYE FOR NOW MARIA
        # scorerProfilePicURL: "/images/maria.png",
        # scorerSignature: "Maria Contreras, M.Ed",
        # scorerJobTitle: "Reading Specialist",
        # scorerEducation: "M.Ed in Reading Education (CUNY)",
        # scorerExperience: "14 years at Loma Park Elementary",
        # scorerEmail: "maria@readupnow.com",
        # scorerFirstName: "Maria",
        # scorerLastName: "Contreras",
        # scorerFullName: "Maria Contreras"
 


    puts "inside index controller..."
    puts params 




    # In case a scored text update
    if params["get_scored_text"]
      puts "okay, getting scored text..."
      render json: Assessment.last.scored_text
    end 


    # In case an call submit 
    if params["isCall"] && (ENV['RAILS_ENV'] == 'production')

      account_sid = ENV['TWILIO_ACCOUNT_SID'] # Your Account SID from www.twilio.com/console
      auth_token = ENV['TWILIO_AUTH_TOKEN'] # Your Auth Token from www.twilio.com/console

      @client = Twilio::REST::Client.new account_sid, auth_token

      call = @client.calls.create(
          :url => "http://demo.twilio.com/docs/voice.xml",
          :to => "+15612125831",
          :from => "+12033035711")
      puts call.to

    end 


    # In case an email submit 
    if params["message"] && (ENV['RAILS_ENV'] == 'production')

      puts 'In prod!'
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

      # Think it might skip the previous 
      # call = @client.calls.create(
      #     :url => "http://demo.twilio.com/docs/voice.xml",
      #     :to => "+15612125831",
      #     :from => "+12033035711")
      # puts call.to

    end

    # Send non-Demo-start alerts when in development
    if params["message"] && !(params["message"].include? "started") && (ENV['RAILS_ENV'] == 'development')

      puts 'In dev!'
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

      # Think it might skip the previous 
      # call = @client.calls.create(
      #     :url => "http://demo.twilio.com/docs/voice.xml",
      #     :to => "+15612125831",
      #     :from => "+12033035711")
      # puts call.to

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


        # scorerProfilePicURL: "/images/peter.png",
        # scorerSignature: "Pete Krason, M.A.",
        # scorerResumeURL: "https://www.linkedin.com/in/peter-krason-a6726189/",
        # scorerJobTitle: "Reading Specialist",
        # scorerEducation: "M.A. in Reading Instruction (DePaul)",
        # scorerExperience: "7 years at Chicago Ridge",
        # scorerEmail: "pete@readupnow.com",
        # scorerFirstName: "Pete",
        # scorerLastName: "Krason",
        # scorerFullName: "Pete Krason",



end