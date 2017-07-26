class ChangeTeacherClassroomsName < ActiveRecord::Migration[5.1]
  def change
    rename_table :teacher_classrooms, :classrooms_teachers
  end
end
