
class StudentDashboardController < ApplicationController
  layout "student_dashboard"

  def index
   return @student_dashboard_props = {
      studentName: "Demo Student",
      teacherName: "Sum Dum Teachum",
    }

    if stu
      @student_dashboard_props = {
        studentName: "#{stu.first_name} #{stu.last_name}",
        teacherName: stu.teachers.first.signature,
      }
    else
      render inline: "Uh oh... Something went wrong..."
    end
  end

  def create_assessment
    stu_id = session[:student_id]
    book_key = params["book_key"]

    # TODO PHIL: this is just a hack to save the assessment 
    # a = Assessment.new(book_key: book_key)
    # a.save! 

    if stu_id && book_key
      # TODO PHIL --- FIX THIS HACK 
      # a = Assessment.new(book_key: book_key)
      # Student.find_by(id: stu_id).assessments << a
      # a.save!
      render json: { assessment_id: Assessment.last.id }
      # render json: { assessment_id: a.id }
    else
      render status: 401, json: { error: "You're not logged in or you didn't supply a book_key", student_id: stu_id, book_key: book_key }
    end
  end

  def confirm_assessment_completion
    assessment_id = params["assessment_id"]
    if assessment_id
      Assessment.find_by(id: assessment_id).update!(completed: true)
    else
      render status: 401, json: { error: "Please supply and assessment id!" }
    end
  end

end