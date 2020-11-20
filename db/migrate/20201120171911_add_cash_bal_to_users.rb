class AddCashBalToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :cash_bal, :integer, default: 0, null: false
  end
end
