class AddPromptStatusToStudents < ActiveRecord::Migration[5.1]
  def change
  	add_column :students, :prompt_status, :string, default: "AWAITING_PROMPT"  	  	
  end
end
