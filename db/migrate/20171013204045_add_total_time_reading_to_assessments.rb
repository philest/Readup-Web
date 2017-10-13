class AddTotalTimeReadingToAssessments < ActiveRecord::Migration[5.1]
  def change
  	add_column :assessments, :total_time_reading, :integer  	  	
  end
end
