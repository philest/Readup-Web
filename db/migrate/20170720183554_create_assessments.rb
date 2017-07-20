class CreateAssessments < ActiveRecord::Migration[5.1]
  def change
    create_table :assessments do |t|
      t.integer :student_id
      t.string :story_id

      t.timestamps
    end

    add_foreign_key :assessments, :students
  end
end
