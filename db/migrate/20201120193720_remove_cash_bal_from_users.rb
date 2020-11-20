class RemoveCashBalFromUsers < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :cash_bal, :integer
  end
end
