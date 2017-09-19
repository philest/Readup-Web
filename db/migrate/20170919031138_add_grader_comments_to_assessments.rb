class AddGraderCommentsToAssessments < ActiveRecord::Migration[5.1]
  def change
  	add_column :assessments, :grader_comments, :json  	
  end
end
