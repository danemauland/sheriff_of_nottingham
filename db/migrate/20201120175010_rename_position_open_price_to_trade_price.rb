class RenamePositionOpenPriceToTradePrice < ActiveRecord::Migration[5.2]
  def change
    rename_column :trades, :position_open_price, :trade_price
  end
end
