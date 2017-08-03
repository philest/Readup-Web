class Assessment < ApplicationRecord
  belongs_to :student
  has_many :teachers, through: :student
  has_many :classrooms, through: :student
end
