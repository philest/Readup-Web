class CreateTeacherClassrooms < ActiveRecord::Migration[5.1]
  def change
    create_table :teacher_classrooms do |t|

      t.timestamps
    end
  end
end
