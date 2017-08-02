class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  layout "application"
  def index
    render template: 'hello_world/index'
  end

  def after_sign_in_path_for(resource_or_scope)
 		'/auth/create_demo_classroom'
  end
end
