class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :email
      t.string :phone
      t.string :password_digest
      t.string :default_locale
      t.string :default_signature
      t.text :default_propic
      t.string :name
      t.string :first_name
      t.string :last_name

      t.timestamps
    end
    add_index :users, :email, unique: true
    add_index :users, :phone, unique: true
  end
end
