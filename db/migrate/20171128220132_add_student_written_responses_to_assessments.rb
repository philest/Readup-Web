class AddStudentWrittenResponsesToAssessments < ActiveRecord::Migration[5.1]
  def change
   	add_column :assessments, :student_written_responses, :json  	  	  	  	
  end
end
