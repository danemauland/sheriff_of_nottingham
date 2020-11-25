# == Schema Information
#
# Table name: cash_transactions
#
#  id         :bigint           not null, primary key
#  user_id    :integer          not null
#  amount     :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require "date"
class CashTransaction < ApplicationRecord
    validates :user_id, :amount, presence: true

    belongs_to :user
end
