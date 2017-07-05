class CreateStudentClassrooms < ActiveRecord::Migration[5.1]
  def change
    create_table :student_classrooms do |t|

      t.timestamps
    end
  end
end
