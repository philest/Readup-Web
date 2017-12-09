class SignupController < ApplicationController
  skip_before_action :verify_authenticity_token
  layout "signup"

  def index
    @signup_props = {
    }


  end




end
