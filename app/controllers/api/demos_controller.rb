class Api::DemosController < ApplicationController

    def create
        username = "demo_#{User.last.id + 1}"
        password = "password"
        @user = User.new(username: username, password: password)
        @user.is_demo
        if @user.save
            login(@user)
            render :show
        else
            render json: @user.errors.full_messages, status: 422
        end
    end
    
end
