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

  # PATCH/PUT /assessments/1
  # PATCH/PUT /assessments/1.json
  def update

    puts "I'm in the update assessments controller!"

    puts "START params"
    puts params 
    puts params["params"]
    puts params["JSONScoredText"]
    puts "END params"


    # TODO PHIL: Fix this hack to avoid user_params 
    if params["params"]["unscorable"]
      res = @assessment.update!(unscorable: true, scored: true)
    elsif params["params"]["JSONScoredText"]
      puts "okay, ready to update scored text..."

      #first convert to JSON

      res = @assessment.update!(scored_text: params["params"]["JSONScoredText"].to_json, scored: true, unscorable: false)
    else    
      @user.update_attributes(user_params)
    end

    render json: @assessment , status: :ok, location: @assessment

  end






  private
    # Use callbacks to share common setup or constraints between actions.
    def set_assessment
      @assessment = Assessment.find(params[:id])
    end

end
