
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
        name: "Sofia Vergara",
        email: "testemail@gmail.com",
        bookTitle: "No More Magic",
        bookLevel: "R",
        recordingURL: "https://s3-us-west-2.amazonaws.com/readup-now/website/homepage/sofia.wav"
      }
    elsif params['user_id'].to_i > 0 || params['user_id'] == 'latest' # Not the email_submit hack 
      @student = @user.teachers.last.classrooms.last.students.last
      @assessment = @student.assessments.last

      @transcriber_interface_props = {
        name: "#{@student.first_name} #{@student.last_name}",
        email: "#{@user.email}",
        bookTitle: "Firefly Night",
        bookLevel: "E",
        recordingURL: @assessment.book_key,
        scoredText: @assessment.scored_text,
        userID: @user.id 
      }
    end

  end


end