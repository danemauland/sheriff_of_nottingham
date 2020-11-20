class Trade < ApplicationRecord
    validates :trader_id, :num_shares, :trade_price, :ticker, presence: true

    belongs_to :user,
        foreign_key: :trader_id,
        class_name: :User
end
