Rails.application.routes.draw do

  root 'static_pages#index'

  get 'app', to: 'static_pages#app'
  get 'class', to: 'static_pages#class'
  get 'error', to: 'static_pages#error'
  get 'privacy', to: 'static_pages#privacy'
  get 'terms', to: 'static_pages#terms'
  get 'read', to: 'static_pages#read'
  get 'start', to: 'static_pages#start'
  get 'go', to: 'static_pages#go'
  get 'doc', to: 'static_pages#doc'
  get 'team', to: 'static_pages#team'
  get 'case_study', to: 'static_pages#case_study'
  get 'join', to: 'static_pages#join'
  get 'product_lead', to: 'static_pages#product_lead'
  get 'developer', to: 'static_pages#developer'
  get 'pilots', to: 'static_pages#pilots'
  get 'schools', to: 'static_pages#schools'
  get 'illustrator', to: 'static_pages#illustrator'
  get 'design', to: 'static_pages#design'



  get 'hello_world', to: 'hello_world#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
