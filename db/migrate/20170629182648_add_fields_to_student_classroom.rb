class AddFieldsToStudentClassroom < ActiveRecord::Migration[5.1]
  def change
  	add_column :student_classrooms, :student_id, :integer
  	add_column :student_classrooms, :classroom_id, :integer
  end
end
