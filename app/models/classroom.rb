class Classroom < ApplicationRecord
	has_many :teacher_classrooms
	has_many :student_classrooms
	has_many :teachers, through: :teacher_classrooms
	has_many :students, through: :student_classrooms
end
