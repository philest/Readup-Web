class CreateSchools < ActiveRecord::Migration[5.1]
  def change
    create_table :schools do |t|
      t.string :name
      t.string :signature
      t.string :zip_code
      t.text :address
      t.string :phone
      t.text :email
      t.string :state
      t.string :city
      t.timestamps
    end
  end
end
