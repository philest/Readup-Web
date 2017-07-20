class CreateRecording < ActiveRecord::Migration[5.1]
  def change
    create_table :recordings do |t|
      t.string :name
      t.text :audio_data
      t.timestamps
    end
  end
end
