class Teacher < ApplicationRecord
	belongs_to :user

  has_and_belongs_to_many :classrooms
  has_many :students, through: :classrooms

	validates :signature, presence: true

end
