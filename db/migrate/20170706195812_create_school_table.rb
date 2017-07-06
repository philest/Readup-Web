class CreateSchoolTable < ActiveRecord::Migration[5.1]
  def change
    create_table :school_tables do |t|

      t.string :name
      t.string :signature
      t.string :zip_code
      t.string :address
      t.string :phone
      t.text :email
      t.string :state
      t.string :city
      t.string :last_name
      t.timestamps
    end
  end
end
