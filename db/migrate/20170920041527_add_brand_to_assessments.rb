class AddBrandToAssessments < ActiveRecord::Migration[5.1]
  def change
  	add_column :assessments, :brand, :string, default: "FP"  	
  end
end
