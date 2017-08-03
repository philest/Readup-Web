class AddRecordMarkupToAssessments < ActiveRecord::Migration[5.1]
  def change
    add_column :assessments, :record_markup, :json
  end
end
