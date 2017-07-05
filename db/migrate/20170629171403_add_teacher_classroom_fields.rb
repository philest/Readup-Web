class AddTeacherClassroomFields < ActiveRecord::Migration[5.1]
  def change
  	add_column :teacher_classrooms, :teacher_id, :integer
  	add_column :teacher_classrooms, :classroom_id, :integer
  end
end
