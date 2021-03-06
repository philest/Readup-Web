class CreateAssessments < ActiveRecord::Migration[5.1]
  def change
    create_table :assessments do |t|
      t.integer :student_id
      t.string :book_key
      t.boolean :completed, default: false

      t.timestamps
    end

    add_foreign_key :assessments, :students
  end
end
