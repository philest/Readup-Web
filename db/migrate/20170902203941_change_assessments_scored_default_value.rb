class ChangeAssessmentsScoredDefaultValue < ActiveRecord::Migration[5.1]
  def change
  	change_column_default :assessments, :scored, false
  end
end
