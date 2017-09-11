
class TranscriberInterfaceController < ApplicationController
  layout "transcriber_interface"

  def index

    if params['user_id'].to_i > 0
      @user = User.find(params['user_id'])
    elsif params['user_id'] == "latest"
      @user = User.last
    end 

    if params['user_id'] == "sample"
     @transcriber_interface_props = {
        name: "Sarah Jones",
        email: "testemail@gmail.com",
        bookTitle: "No More Magic",
        bookLevel: "R",
        recordingURL: "https://s3-us-west-2.amazonaws.com/readup-now/website/homepage/sofia.wav"
      }
    elsif params['user_id'].to_i > 0 || params['user_id'] == 'latest' # Not the email_submit hack 
      @student = @user.teachers.last.classrooms.last.students.last
      @assessment = @student.assessments.last
      created_at = User.last.created_at.in_time_zone('Pacific Time (US & Canada)').to_time.strftime('%B %e at %l:%M %p')


      @transcriber_interface_props = {
        name: "#{@student.first_name} #{@student.last_name}",
        createdAt: created_at,
        email: "#{@user.email}",
        bookTitle: "Firefly Night",
        bookLevel: "E",
        recordingURL: @assessment.book_key,
        scoredText: @assessment.scored_text,
        userID: @user.id,
        assessmentID: @assessment.id,
        seenUpdatePrior: params["seen_update_prior"] == "true",
        whenCreated: (@assessment.updated_at.to_f*1000).to_i # convert into ms since 1970 for equality with Rails date
      }
    end

  end


end