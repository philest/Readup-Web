class DropUsersTables < ActiveRecord::Migration[5.1]
  def change
    drop_table :users_tables
  end
end
