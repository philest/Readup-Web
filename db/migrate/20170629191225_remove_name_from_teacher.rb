class RemoveNameFromTeacher < ActiveRecord::Migration[5.1]
  def change
  	remove_column :teachers, :name, :string
  end
end
