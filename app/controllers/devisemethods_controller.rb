class DevisemethodsController < Devise::RegistrationsController

  private

	  def sign_up_params
	    params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
	  end


  	def after_sign_up_path_for(resource)
  		after_sign_in_path_for(resource)
	end
end