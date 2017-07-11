class School < ApplicationRecord
  has_many :teachers, through: :classrooms
  belongs_to :creator, class_name: :User, foreign_key: :creator_id

  # inverse_of ensures that the school record exists for the classroom!
  has_many :classrooms, inverse_of: :school
  validates :name, :address, :city, :state, presence: true
end
