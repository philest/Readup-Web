class RemoveUniquenesConstraintFromSchools < ActiveRecord::Migration[5.1]
  def change
    remove_index :teachers, :signature
    add_index :teachers, :signature
  end
end
