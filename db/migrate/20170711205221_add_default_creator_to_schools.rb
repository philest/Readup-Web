class AddDefaultCreatorToSchools < ActiveRecord::Migration[5.1]
  def change

    add_reference :schools, :creator, references: :users, index: true, default: 2
    add_foreign_key :schools, :users, column: :creator_id

  end
end
