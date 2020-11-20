class User < ApplicationRecord
    validates :username, :password_digest, :session_token, presence: true
    validates :username, :session_token, uniqueness: true
    validates :password, length: {minimum: 8}, allow_nil: true
    validate :demo_not_allowed, unless: :demo?

    after_initialize :ensure_session_token

    attr_reader :password

    has_many :trades,
        foreign_key: :trader_id,
        class_name: :Trade
    has_many :cash_transactions
    
    def demo_not_allowed
        if username.start_with?("demo_")
            errors.add(:username, "cannot start with 'demo_'")
        end
    end

    def self.find_by_credentials(username, password)
        user = User.find_by(username: username)
        return nil unless user && user.is_password?(password)
        user
    end

    def is_demo
        @demo = true
    end

    def demo?
        @demo || !self.new_record?
    end

    def is_password?(password)
        BCrypt::Password.new(self.password_digest).is_password?(password)
    end

    def password=(password)
        @password = password
        self.password_digest = BCrypt::Password.create(password)
    end

    def ensure_session_token
        self.session_token ||= self.generate_session_token
    end

    def generate_session_token
        SecureRandom::urlsafe_base64
    end

    def reset_session_token!
        self.session_token = self.generate_session_token        
        self.save!
        self.session_token
    end

    # def positions
    #     self.trades.select('"trades"."ticker", SUM("trades"."num_shares") AS "total_shares"').having('SUM("trades"."num_shares") != 0').group("trades.ticker").order("")
    # end

    # def cash_bal
    #     self.cash_transactions.sum('"cash_transactions"."amount"')
    # end
end
