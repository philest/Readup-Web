class Student < ApplicationRecord
	has_many :student_classrooms
	has_many :classrooms, through: :student_classrooms

 	validates :grade, numericality: { only_integer: true }


 	# custom validation
  	validate :full_name_present
	def full_name_present
		if name.nil? || name == "" || name.split(" ").size < 2
			errors.add(:name, 'Full name must be entered.')
		end
	end

end
