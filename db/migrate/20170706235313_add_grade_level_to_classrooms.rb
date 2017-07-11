class AddGradeLevelToClassrooms < ActiveRecord::Migration[5.1]
  def change
  	add_column :classrooms, :grade_level, :integer
  end
end
