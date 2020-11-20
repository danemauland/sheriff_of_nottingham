class CreateCashTransactions < ActiveRecord::Migration[5.2]
  def change
    create_table :cash_transactions do |t|
      t.integer :user_id, null: false
      t.integer :amount, null: false
      t.timestamps
    end
    add_index :cash_transactions, :user_id
  end
end
