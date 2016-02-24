class CreateDots < ActiveRecord::Migration
  def change
    create_table :dots do |t|
      t.integer :user_id
      t.integer :stat_id
      t.text :content
      t.float :lat
      t.float :lng

      t.timestamps null: false
    end
  end
end
