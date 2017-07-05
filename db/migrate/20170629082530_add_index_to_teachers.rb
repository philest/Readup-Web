class AddIndexToTeachers < ActiveRecord::Migration[5.1]
  def change
  	add_index :teachers, :signature, unique: true
  end
end
