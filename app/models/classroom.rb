class Classroom < ApplicationRecord
  has_and_belongs_to_many :teachers
  has_and_belongs_to_many :students

  belongs_to :school
  validates :school, presence: true
  validate :at_least_one_student
  def at_least_one_student
    if students.empty?
      errors.add(:base, "need at least one student to init classroom")
    end
  end


  def self.create_with_teacher_and_students(options = {})

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
      t = User.find_by(id: user_id)
              .teachers
              .create(signature: teacher_signature)
      s = School.find_by(id: school_id)
      cl = Classroom.new(
        name: classroom_name,
        grade_level: grade_level
      )
      cl.school = s
      cl.teachers << t

      student_list.each do |stu|
        name_hash = Student.split_name(stu)
        if name_hash
          cl.students.new(name_hash)
        end
      end

      if cl.save
        return cl
      else
        raise "failed to create classroom #{classroom_name}"
      end
      return false
    end
  end



end
