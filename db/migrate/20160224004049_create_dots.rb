class CreateDots < ActiveRecord::Migration
  def change
    create_table :dots do |t|
      t.integer :user_id
      t.integer :stat_id, default: 1 #비공개:0 , 친구공개:1 , 전체공개:2
      t.text :content
      t.float :lat
      t.float :lng
      t.text :address

      t.timestamps null: false
    end
  end
end
