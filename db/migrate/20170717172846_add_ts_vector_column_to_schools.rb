class AddTsVectorColumnToSchools < ActiveRecord::Migration[5.1]
  def up
    add_column :schools, :tsv, :tsvector
    add_index :schools, :tsv, using: "gin"

    execute <<-SQL
      CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
      ON schools FOR EACH ROW EXECUTE PROCEDURE
      tsvector_update_trigger(
        tsv, 'pg_catalog.english', name, signature, address, zip_code, state
      );
    SQL

    now = Time.current.to_s(:db)
    update("UPDATE schools SET updated_at = '#{now}'")
  end

  def down
    execute <<-SQL
      DROP TRIGGER tsvectorupdate
      ON schools
    SQL

    remove_index :schools, :tsv
    remove_column :schools, :tsv
  end
end
