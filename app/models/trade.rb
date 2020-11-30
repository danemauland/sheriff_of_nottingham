# == Schema Information
#
# Table name: trades
#
#  id          :bigint           not null, primary key
#  trader_id   :integer          not null
#  num_shares  :integer          not null
#  trade_price :integer          not null
#  ticker      :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
require "date"
class Trade < ApplicationRecord
    validates :trader_id, :num_shares, :trade_price, :ticker, presence: true

    belongs_to :user,
        foreign_key: :trader_id,
        class_name: :User
end
