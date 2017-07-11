class AddCountryToSchools < ActiveRecord::Migration[5.1]
  def change
    add_column :schools, :country, :string
  end
end
