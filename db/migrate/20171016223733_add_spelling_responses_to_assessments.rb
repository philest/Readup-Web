class AddSpellingResponsesToAssessments < ActiveRecord::Migration[5.1]
  def change
  	add_column :assessments, :spelling_responses, :json  	  	  	
  end
end
