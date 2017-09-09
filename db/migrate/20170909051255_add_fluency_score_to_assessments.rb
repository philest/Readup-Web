class AddFluencyScoreToAssessments < ActiveRecord::Migration[5.1]
  def change
  	add_column :assessments, :fluency_score, :integer  	
  end
end
