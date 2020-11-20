class RemoveDirectionFromTrades < ActiveRecord::Migration[5.2]
  def change
    remove_column :trades, :direction, :string
  end
end
