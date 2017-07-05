class AddIndexToTeacher < ActiveRecord::Migration[5.1]
  def change
    add_index :teachers, :id
  end
end
