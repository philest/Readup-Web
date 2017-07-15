class School < ApplicationRecord
  include PgSearch
  pg_search_scope :search,
                  against: %i[name signature address zip_code state],
                  using: {
                    tsearch: {},
                    trigram: { only: %i[name signature], threshold: 0.2 },
                  },
                  ignoring: :accents,
                  ranked_by: ":trigram"

  has_many :teachers, through: :classrooms
  belongs_to :creator, class_name: :User, foreign_key: :creator_id

  # inverse_of ensures that the school record exists for the classroom!
  has_many :classrooms, inverse_of: :schools
  validates :name, :city, :state, presence: true
end
