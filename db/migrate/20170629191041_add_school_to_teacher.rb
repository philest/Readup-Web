class AddSchoolToTeacher < ActiveRecord::Migration[5.1]
  def change
  	add_column :teachers, :school, :string
  end
end
