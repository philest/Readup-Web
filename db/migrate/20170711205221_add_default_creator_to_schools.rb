class AddDefaultCreatorToSchools < ActiveRecord::Migration[5.1]
  def change
    add_column :schools, :creator_id, :integer, default: 2
    # add_reference :schools, :creator, foreign_key: {to_table: :users}, default: 2

  end
end
