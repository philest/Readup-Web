

class RegistrationController < ApplicationController
  # todo: write a before-action for getting demo classroom

  def create_demo_classroom

    classroom_options = {
      classroom_name: "Demo Homeroom",
      user_id: current_user.id.to_i,
      school_id: School.find_by(name: 'Demo School'),
      grade: 5,
      teacher_signature: current_user.first_name + current_user.last_name,
      student_list: ["Demo Student"]
    }

    if @new_classroom = Classroom.create_with_teacher_and_students(classroom_options)

      # set the student id as session so that the demo can work properly
      t = @new_classroom.teachers.first
      demo_student = @new_classroom.students.find_by(last_name: "Student", first_name: "Demo")

      session[:student_id] = demo_student.id || nil

      # render json: { ok: true }, status: :ok, location: @user

      redirect_to "/student_dashboard/#/story/demo"


    else
      head 403
    end
  end



  def create_classroom

    classroom_options = {
      classroom_name: params["classroom_name"],
      user_id: params["user_id"].to_i,
      school_id: params["school_id"].to_i,
      grade: params["classroom_grade"].to_i,
      teacher_signature: params["signature"],
      student_list: params["student_names"]
    }


    puts 'classroom options:'
    puts classroom_options

    if @new_classroom = Classroom.create_with_teacher_and_students(classroom_options)

      # set the student id as session so that the demo can work properly
      t = @new_classroom.teachers.first
      demo_student = @new_classroom.students.find_by(last_name: "Student", first_name: "Demo")

      session[:student_id] = demo_student.id || 'totes not set'

    	head :ok
    else
      head 404
    end

  end


  def search_school
    puts params.inspect
    # blacklist = [
    #   'ReadUp',
    #   'Freemium',
    #   'Freemium School',
    #   'ST Elementary'
    # ]

    schools = School.search(params["term"]).limit(10)
    school_list = schools.map do |s|

      location = ''
      if s.city && s.state
        location = "#{s.city}, #{s.state}"
      elsif s.city
        location = s.city.to_s
      elsif s.state
        location = s.state.to_s
      end
      {
        label: s.name,
        id: s.id,
        value: s.id,
        desc: location,
        city: s.city,
        state: s.state
      }
    end

    puts school_list

    render json: school_list

  end
end
