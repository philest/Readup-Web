class School < ApplicationRecord
  has_many :teachers, through: :classrooms

  # inverse_of ensures that the school record exists for the classroom!
  has_many :classrooms, inverse_of: :school
  validates :name, :address, :city, :state, presence: true
end
