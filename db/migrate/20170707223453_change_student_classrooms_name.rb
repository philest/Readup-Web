class ChangeStudentClassroomsName < ActiveRecord::Migration[5.1]
  def change
    rename_table :student_classrooms, :classrooms_students

  end
end
