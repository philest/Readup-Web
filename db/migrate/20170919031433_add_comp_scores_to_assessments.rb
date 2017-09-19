class AddCompScoresToAssessments < ActiveRecord::Migration[5.1]
  def change
  	add_column :assessments, :comp_scores, :json  	  	
  end
end
