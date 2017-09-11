class AddSavedAtToAssessments < ActiveRecord::Migration[5.1]
  def change
    add_column :assessments, :saved_at, :datetime
  end
end
