class Classroom < ApplicationRecord
  has_many :teacher_classrooms
	has_many :student_classrooms
	has_many :teachers, through: :teacher_classrooms
	has_many :students, through: :student_classrooms

  def self.create_classroom_with_teacher_and_students(options = {})

    # destructure the options
    classroom_name,
    user_id,
    school_id,
    grade_level,
    teacher_signature,
    student_list = options.values_at(
      :classroom_name,
      :user_id,
      :school_id,
      :grade,
      :teacher_signature,
      :student_list
    )

    ActiveRecord::Base.transaction do
      t = User.find_by(id: user_id).teachers.create()
      cl = Classroom.new(
        classroom_name: classroom_name,
        grade_level: grade_level
      )
      cl.add_teacher(t)
      student_list.each do |stu|
        cl.students.create(
          first_name: stu[:first_name],
          last_name: stu[:last_name]
        )
      end
    end
  end
end
