class AssessmentsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_assessment, only: [:show, :edit, :update, :destroy]


  # GET /assessments.json
  def index
    @assessments = User.all
  end


  # GET /assessments/1
  # GET /assessments/1.json
  def show
  	    respond_to do |format|
  	    	format.json
  	    end

  	    render json: @assessment
  end


  # GET /assessments/new
  def new
    @user = User.new
  end

  # GET /assessments/1/edit
  def edit
  end




  private
    # Use callbacks to share common setup or constraints between actions.
    def set_assessment
      @assessment = Assessment.find(params[:id])
    end

end
