class Student < ApplicationRecord

  # need to keep this format so that timestamps are auto-gen'd
  has_and_belongs_to_many :classrooms

  # validates :grade, numericality: { only_integer: true }


  # custom validation
  validates :first_name, presence: true
  validates :last_name, presence: true



  def self.split_name(fullName)
    name_arr = fullName.split

    if name_arr.length < 2
      puts 'Warning, student #{fullName} because less than two names'
      return false
    end

    return {
      first_name: name_arr[0, name_arr.size - 1].join(" "),
      last_name: name_arr[-1]
    }
  end
end
