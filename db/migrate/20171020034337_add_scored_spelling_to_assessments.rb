class AddScoredSpellingToAssessments < ActiveRecord::Migration[5.1]
  def change
  	add_column :assessments, :scored_spelling, :json  	  	  	  	
  end
end
