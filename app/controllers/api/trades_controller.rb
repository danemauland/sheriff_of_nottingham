class Api::TradesController < ApplicationController
    def create
        mapped_params = trades_params
        puts mapped_params[:created_at]
        puts Time.at(mapped_params[:created_at].to_i / 1000)
        puts Time.at(mapped_params[:created_at].to_i / 1000).to_datetime.to_s
        mapped_params["created_at"] = Time.at(mapped_params[:created_at].to_i / 1000).to_datetime.to_s
        puts mapped_params
        @trade = current_user.trades.new(mapped_params)
        if @trade.save
            render :show
        else
            puts @trade.errors.full_messages
        end
    end

    def demolish
        current_user.cash_transactions.destroy_all
        render json: {}
    end

    def trades_params
        params.require(:trade).permit(:ticker, :created_at, :num_shares, :trade_price)
    end
end
