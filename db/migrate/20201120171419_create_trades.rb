class CreateTrades < ActiveRecord::Migration[5.2]
  def change
    create_table :trades do |t|
      t.integer :trader_id, null: false
      t.string :direction, null: false
      t.integer :num_shares, null: false
      t.integer :position_open_price, null: false
      t.string :ticker, null: false

      t.timestamps
    end
    add_index :trades, :trader_id
    execute "ALTER TABLE trades ADD CONSTRAINT check_direction CHECK (direction IN ('buy, sell') )"
  end
end
