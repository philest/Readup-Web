class AddScoredTextToAssessments < ActiveRecord::Migration[5.1]
  def change
    add_column :assessments, :scored_text, :json
  end
end
