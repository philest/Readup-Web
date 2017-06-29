class AddForeignToTeacher < ActiveRecord::Migration[5.1]
  def change
    add_column :teachers, :user_id, :integer
  end
end
