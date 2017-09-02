class AddScoredToAssessments < ActiveRecord::Migration[5.1]
  def change
    add_column :assessments, :scored, :boolean
  end
end
