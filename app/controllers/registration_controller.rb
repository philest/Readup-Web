

class RegistrationController < ApplicationController

  def create_classroom
  	
    classroom_options = {
      :classroom_name => params[:classroom_name],
      :user_id => params[:user_id],
      :school_id => params[:school_id],
      :grade => params[:classroom_grade].to_i,
      :teacher_signature => params[:signature],
      :student_list => params[:student_names]
    }

    puts 'classroom options:'
    puts classroom_options

    Classroom.create_classroom_with_teacher_and_students(classroom_options)

  	head :ok
  end

end
