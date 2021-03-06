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

  # POST auth/update_all_assessments
  def update_all_assessments

  # assessment = { 3430 => { "book_key" => "step12" }, 3428 => { "book_key" => "step12p" }, 3427 => { "book_key" => "step11p" } }

  assessment = params['params']['assessments']
  Assessment.update(assessment.keys, assessment.values)

  render json: @assessment , status: :ok

  end 


  # PATCH/PUT /assessments/1
  # PATCH/PUT /assessments/1.json
  def update

    puts "I'm in the update assessments controller!"

    # puts params
    # puts params["params"] 

    puts assessment_params
    puts params["params"]
    puts "HERE"

    # TODO PHIL: Fix this hack to avoid assessment_params 
    if params["params"]["unscorable"]
      res = @assessment.update!(unscorable: true, scored: true)
    elsif params["params"]["JSONScoredText"]
      puts "okay, ready to update scored text..."
      #first convert to JSON
      res = @assessment.update!(scored_text: params["params"]["JSONScoredText"].to_json, unscorable: false, saved_at: DateTime.now)
    elsif params["params"]["fluencyScore"]
      puts "okay, ready to update fluency to #{params["params"]["fluencyScore"]}..."
      res = @assessment.update!(fluency_score: params["params"]["fluencyScore"], saved_at: DateTime.now)
    elsif params["params"]["scored"]
      puts "okay, ready to update scored to #{params["params"]["scored"]}..."
      res = @assessment.update!(scored: params["params"]["scored"])
    elsif params["params"]["completed"]
      puts "okay, ready to update completed to #{params["params"]["completed"]}..."
      res = @assessment.update!(completed: params["params"]["completed"])
    elsif params['params']['teacher_note']
      res = @assessment.update!(teacher_note: params["params"]["teacher_note"])
    elsif params['params']['total_time_reading']
      res = @assessment.update!(total_time_reading: params["params"]["total_time_reading"])
    elsif params['params']['scored_spelling']
      res = @assessment.update!(scored_spelling: params["params"]["scored_spelling"])
    else    
      puts "nothing matched"
      res = @assessment.update!(params["params"])
    end

    render json: @assessment , status: :ok, location: @assessment

  end






  private
    # Use callbacks to share common setup or constraints between actions.
    def set_assessment
      @assessment = Assessment.find(params[:id])
    end

    def assessment_params
            params.permit!
    end

end
