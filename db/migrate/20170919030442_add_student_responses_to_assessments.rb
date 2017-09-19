class AddStudentResponsesToAssessments < ActiveRecord::Migration[5.1]
  def change
  	add_column :assessments, :student_responses, :json
  end
end
