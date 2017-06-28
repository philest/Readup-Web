class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  layout "application"
  def index
    render template: 'hello_world/index'
  end
end
