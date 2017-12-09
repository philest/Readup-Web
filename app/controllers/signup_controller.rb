class SignupController < ApplicationController
  skip_before_action :verify_authenticity_token
  layout "signup"

  def index
    @signup_props = {
      userID: params['user_id'].to_i,
      isAddClass: params['add'] === 'true'
    }

  end




end
