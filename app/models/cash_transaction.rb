class CashTransaction < ApplicationRecord
    validates :user_id, :amount, presence: true

    belongs_to :user
end
