class RemoveIndexToTeachers < ActiveRecord::Migration[5.1]
  def change
  	remove_index :teachers, :id
  end
end
