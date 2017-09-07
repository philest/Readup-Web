class AddUnscorableToAssessments < ActiveRecord::Migration[5.1]
  def change
  	add_column :assessments, :unscorable, :boolean, default: false
  end
end
