Rails.application.routes.draw do

  resources :schools

  root 'static_pages#index'

  get 'hello', to: 'hello_world#index'


  # static pages

  # get 'app', to: 'static_pages#app'
  # get 'class', to: 'static_pages#class'
  # get 'start', to: 'static_pages#start'
  # get 'go', to: 'static_pages#go'
  # get 'doc', to: 'static_pages#doc'
  # get 'read', to: 'static_pages#read'


  get 'mobile_halt', to: "static_pages#mobile_halt"
  get 'error', to: 'static_pages#error'
  get 'privacy', to: 'static_pages#privacy'
  get 'terms', to: 'static_pages#terms'
  get 'team', to: 'static_pages#team'
  get 'case_study', to: 'static_pages#case_study'
  get 'join', to: 'static_pages#join'
  get 'product_lead', to: 'static_pages#product_lead'
  get 'developer', to: 'static_pages#developer'
  get 'pilots', to: 'static_pages#pilots'
  get 'schools', to: 'static_pages#schools'
  get 'illustrator', to: 'static_pages#illustrator'
  get 'design', to: 'static_pages#design'
  get 'success', to: 'static_pages#signup_success'

  # user stuff including auth

  resources :users

  get 'auth/user_exists', to: 'users#exists'
  get 'auth/complete_signup', to: 'users#show_complete_signup'

  post 'auth/add_school', to: 'registration#add_school'
  post 'auth/create_classroom', to: 'registration#create_classroom'
  post 'auth/create_demo_classroom', to: 'registration#create_demo_classroom'
  get 'auth/search_school', to: 'registration#search_school'


  get 'student_dashboard', to: 'student_dashboard#index'
  get 'student_dashboard/', to: 'student_dashboard#index' # with added route info tacked on with hash, i.e. student_dashboard/#/story/:story_id/page/:page_id, handled by ReactRouter
  get 'student_dashboard/assessment', to: 'student_dashboard#create_assessment'
  post 'student_dashboard/assessment', to: 'student_dashboard#confirm_assessment_completion'

  get 'transcribe/:teacher_id', to: 'transcriber_interface#index'
  get 'reports/:teacher_id', to: 'reports#index'
  get 'reports/email_submit', to: 'reports#email_submit'


  # process audio
  post '/audio_process/save_file', to: 'audio_process#save_file'
  post '/audio_process/save_link', to: 'audio_process#save_link'
  get 'aws_presign', to: 'audio_process#aws_presign'

  get '/audio_process', to: 'audio_process#index'


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
