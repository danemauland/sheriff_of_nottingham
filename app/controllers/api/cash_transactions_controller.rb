class Api::CashTransactionsController < ApplicationController
    def create
        mapped_params = cash_transaction_params
        mapped_params[:created_at] = Time.at(mapped_params[:created_at].to_i / 1000).to_datetime.to_s
        @transaction = current_user.cash_transactions.new(mapped_params)
        if @transaction.save
            render :show
        end
    end

    def destroy
        @transaction = current_user.cash_transactions
    end

    def cash_transaction_params
        params.require(:cash_transaction).permit(:amount, :created_at)
    end
end
