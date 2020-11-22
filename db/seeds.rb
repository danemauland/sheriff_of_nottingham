# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.create([{username: "test", password: "password"},
    {username: "test2", password: "password"},
])
Trade.create([{trader_id: 1, num_shares: 1, trade_price: 10000, ticker: "GOOG", created_at: "2020-11-02 00:00:00"},
    {trader_id: 1, num_shares: -1, trade_price: 20000, ticker: "GOOG", created_at: "2020-11-03 00:00:00"},
    {trader_id: 1, num_shares: 1, trade_price: 25000, ticker: "FB", created_at: "2020-11-05 00:00:00"},
    {trader_id: 1, num_shares: -1, trade_price: 18000, ticker: "AAPL", created_at: "2020-11-06 00:00:00"},
    {trader_id: 2, num_shares: 1, trade_price: 92367, ticker: "NFLX", created_at: "2020-11-01 00:00:00"},
])

CashTransaction.create([{user_id: 1, amount: 1000000, created_at: "2020-11-01 00:00:00"},
    {user_id: 1, amount: -100000, created_at: "2020-11-04 00:00:00"},
    {user_id: 2, amount: 500000, created_at: "2020-11-01 00:00:00"},
])