class AddSchoolIdToTeachersAndClassrooms < ActiveRecord::Migration[5.1]
  def change
    add_column :teachers, :school_id_default, :integer
    add_column :classrooms, :school_id, :integer
  end
end
