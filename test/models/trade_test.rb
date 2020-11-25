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
require 'test_helper'

class TradeTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
