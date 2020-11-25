class Api::CashTransactionsController < ApplicationController
    def create
        params = cash_transactions_params
        params.created_at = Time.at(params.createdAt).to_datetime.to_s
        @transaction = current_user.cash_transactions.new(cash_transactions_params)
        if @transaction.save
            render :show
        end
    end

    def destroy
        @transaction = current_user.cash_transactions
    end

    def cash_transactions_params
        params.require(:cash_transactions).permit(:amount, :createdAt)
    end
end
