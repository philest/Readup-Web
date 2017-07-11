class AddFirstAndLastNameToStudent < ActiveRecord::Migration[5.1]
  def change
    add_column :students, :first_name, :string
    add_column :students, :last_name, :string
    rename_column :students, :name, :nick
  end
end
