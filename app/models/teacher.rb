class Teacher < ApplicationRecord
	belongs_to :user
	has_many :teacher_classrooms
	has_many :classrooms, through: :teacher_classrooms

	# custom validation
  	validate :full_name_present
	def full_name_present
		if name.nil? || name == "" || name.split(" ").size < 2
			errors.add(:name, 'Full name must be entered.')
		end
	end

end
