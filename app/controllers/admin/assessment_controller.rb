class Admin::AssessmentController < ApplicationController
  protect_from_forgery with: :exception
  before_action :authorize, except: [:pls_login, :teachers_list]


  def teachers_list
    if params["user_id"] == "phil"
      # teachers with classrooms
      session[:authorized] = true
      @teachers = Teacher.includes(:user)
    else
      @assessments_list = []
    end
    render 'teachers_list'
  end




  def classrooms_by_teacher
    @teacher = Teacher.find(params[:id])
  end




  def pls_login
    render plain: 'pls login'
  end




  private

  def authorize
    if !session[:authorized]
      puts "\n\nhi\n\n"
      redirect_to pls_login_path
    end
  end
end
