
class GraderInterfaceController < ApplicationController
  layout "grader_interface"

  def index

    if params['user_id'].to_i > 0
      @user = User.find(params['user_id'])
    elsif params['user_id'] == "latest"
      @user = User.last
    end 

    if params['user_id'] == "sample"
     @grader_interface_props = {
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


      # Backwards compatability to non-comp users... 
      if @assessment.comp_scores
        @comp_score = @assessment.comp_scores["0"]
      else 
        @comp_score = nil
      end 

      if @assessment.grader_comments
        @grader_comment = @assessment.grader_comments["0"]
      else 
        @grader_comment = nil
      end 

      if @assessment.student_responses
        @student_response = @assessment.student_responses["0"]
      else 
        @student_response = nil
      end 


      @grader_interface_props = {
        name: "#{@student.first_name} #{@student.last_name}",
        createdAt: created_at,
        email: "#{@user.email}",
        bookTitle: "Firefly Night",
        bookLevel: "E",
        recordingURL: "https://s3-us-west-2.amazonaws.com/readup-now/fake-assessments/#{ENV['RAILS_ENV']}/#{@user.id}/recording.webm",
        compRecordingURL: "https://s3-us-west-2.amazonaws.com/readup-now/fake-assessments/#{ENV['RAILS_ENV']}/#{@user.id}/comp/recording.webm",
        scoredText: @assessment.scored_text,
        userID: @user.id,
        assessmentID: @assessment.id,
        seenUpdatePrior: params["seen_update_prior"] == "true",
        whenCreated: (@assessment.updated_at.to_f*1000).to_i, # convert into ms since 1970 for equality with Rails date
        whenFirstSaved: (@assessment.saved_at .to_f*1000).to_i,
        userCountPrior: User.count,
        fluencyScorePrior: @assessment.fluency_score,
        graderCommentPrior: @grader_comment,
        studentResponsePrior: @student_response,
        compScorePrior: @comp_score,
        studentID: @student.id,
        assessmentBrand: @assessment.brand,
        isLiveDemo: @assessment.is_live_demo
      }
      
    end

  end


end