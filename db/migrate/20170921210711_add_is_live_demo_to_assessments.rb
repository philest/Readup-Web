class AddIsLiveDemoToAssessments < ActiveRecord::Migration[5.1]
  def change
  	add_column :assessments, :is_live_demo, :boolean, default: false  	  	
  end
end
