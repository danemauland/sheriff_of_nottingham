Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "static_pages#root"
  namespace :api, default: {format: :json} do
    resources :users, only: [:create]
    resources :cash_transactions, only: [:create]
    resource :session, only: [:create, :destroy]
    resources :demos, only: [:create]
    resources :trades, only: [:create]
  end
  delete "/api/cash_transactions", to: "api/cash_transactions#demolish", default: {format: :json}
  delete "/api/trades", to: "api/trades#demolish", default: {format: :json}
end
