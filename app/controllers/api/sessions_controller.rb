class Api::SessionsController < ApplicationController
    def create
        @user = User.includes(:cash_transactions, :trades).find_by_credentials(
            params[:user][:username],
            params[:user][:password])
        if @user
            login(@user)
            render "api/users/show"
        else
            errors = ["Unable to log in with provided credentials."]
            render json: errors, status: 422
        end
    end

    def destroy
        if logged_in?
            logout!
            render json: {}
        else
            render json: ["Not logged in"], status: 404 unless logged_in?
        end
    end

end
