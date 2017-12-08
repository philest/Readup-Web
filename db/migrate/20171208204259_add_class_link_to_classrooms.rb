class AddClassLinkToClassrooms < ActiveRecord::Migration[5.1]
  def change
   	add_column :classrooms, :class_link, :string   	  	  	  	
  end
end
