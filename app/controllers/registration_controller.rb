

class RegistrationController < ApplicationController
  # todo: write a before-action for getting demo classroom
  # TODO PHIL - skip for now 
  skip_before_action :verify_authenticity_token



  def get_is_live_demo
    puts "now getting live demo...."

    render json: { ok: true, is_live_demo: Assessment.last.is_live_demo }, status: :ok, location: @user

    return Assessment.last.is_live_demo 
  end



  def get_user_count
    puts "now getting count...."

    render json: { ok: true, user_count: User.count }, status: :ok, location: @user

    return User.count 
  end




  def get_last_student_id 
    puts "now getting student id...."

    render json: { ok: true, student_id: Student.last.id }, status: :ok, location: @student

    return Student.count 
  end
  


  def get_last_assessment_id 
    puts "now getting assessment id...."

    render json: { ok: true, assessment_id: Assessment.last.id }, status: :ok, location: @assessment

    return Assessment.count 
  end



  #  TODO PHIL: Hack for creating the user, teacher, school, class, assessment for the demo
  def phil_setup_demo
      # Create the dummy user linked to the real assesment. Dummy user updated after email collected. 
      User.create(first_name: "Dummy", last_name: "Teacher", name: "Dummy Teacher", password: "12345678", email:"dummy#{rand(1000000)}@gmail.com")


      student_name = params["student_name"] || "Demo Student"

      student_name = student_name.split.map(&:capitalize).join(' ')

      puts "Here's the student name: ", student_name


      classroom_options = {
        classroom_name: "Demo Homeroom",
        user_id: User.last.id,
        school_id: School.find_by(name: 'Demo School'),
        grade: 2,
        teacher_signature: "Mrs. Demo",
        student_list: [ student_name ]
      }

      if @new_classroom = Classroom.create_with_teacher_and_students(classroom_options)
        # set the student id as session so that the demo can work properly
        t = @new_classroom.teachers.first
        demo_student = @new_classroom.students.find_by(last_name: "Student", first_name: "Demo")

        if (demo_student)
          session[:student_id] = demo_student.id || nil
        end

      end

      Student.last.assessments.create(book_key: params['book_key'])

      # How to update scored text? 

      if (params['book_key'].include? 'step')
        Assessment.last.update(brand: 'STEP')
      else
        Assessment.last.update(brand: 'FP')
      end  

      puts "Created this assessment:\n#{User.last.teachers.last.classrooms.last.students.last.assessments.last}"
  end 
  # END TODO PHIL 





  def create_demo_classroom
    classroom_options = {
      classroom_name: "Demo Homeroom",
      user_id: params["user_id"].to_i,
      school_id: School.find_by(name: 'Demo School'),
      grade: 5,
      teacher_signature: params["user_name"],
      student_list: ["Demo Student"]
    }

    if @new_classroom = Classroom.create_with_teacher_and_students(classroom_options)

      # set the student id as session so that the demo can work properly
      t = @new_classroom.teachers.first
      demo_student = @new_classroom.students.find_by(last_name: "Student", first_name: "Demo")

      session[:student_id] = demo_student.id || nil

      render json: { ok: true }, status: :ok, location: @user


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
