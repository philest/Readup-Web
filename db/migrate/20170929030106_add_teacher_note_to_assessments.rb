class AddTeacherNoteToAssessments < ActiveRecord::Migration[5.1]
  def change
  	add_column :assessments, :teacher_note, :text  	  	
  end
end
