class Teacher < ApplicationRecord
	belongs_to :user
	has_many :teacher_classrooms
	has_many :classrooms, through: :teacher_classrooms

	validates :signature, presence: true

end
