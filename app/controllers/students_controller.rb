class StudentsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :set_student, only: [:show, :edit, :update, :destroy]


  ### Normal autogenerated resource routes (CRUD)

  # GET /students
  # GET /students.json
  def index
    @students = Student.all
  end

  # GET /students/1
  # GET /students/1.json
  def show
  end

  # GET /students/new
  def new
    @student = Student.new
  end

  # GET /students/1/edit
  def edit
  end

  # POST /students
  # POST /students.json
  def create
    puts student_params
    @student = Student.new(student_params)
    @student.name = student_params[:first_name] + ' ' + student_params[:last_name]

    respond_to do |format|
      if @student.save
        # format.html { redirect_to @student, notice: 'Student was successfully created.' }
        # format.json { render :show, status: :created, location: @student }
        # partial signup complete, now redirect to finish
        session[:student_id] = @student.id

        # TODO: location ?? what is this option...
        format.json { render json: @student , status: :ok, location: @student }

      else
        render json: @student.errors, status: :unprocessable_entity
      end
    end
  end

  # PATCH/PUT /students/1
  # PATCH/PUT /students/1.json
  def update

    puts params
    puts params["params"]
    puts params["params"]["prompt_status"]

    # @student.update!(params["params"])



    if params["params"]["prompt_status"]
      @student.update!(prompt_status: params["params"]["prompt_status"])
    end

    render json: @student , status: :ok, location: @student




    # TODO PHIL: Make this work so can stick to rails convention
    # respond_to do |format|
    #   if @student.update(student_params)
    #     format.html { redirect_to @student, notice: 'Student was successfully updated.' }
    #     format.json { render :show, status: :ok, location: @student }
    #   else
    #     format.html { render :edit }
    #     format.json { render json: @student.errors, status: :unprocessable_entity }
    #   end
    # end
  end

  # DELETE /students/1
  # DELETE /students/1.json
  def destroy
    @student.destroy
    respond_to do |format|
      format.html { redirect_to students_url, notice: 'Student was successfully destroyed.' }
      format.json { head :no_content }
    end
  end


  ### Custom routes

  def exists

    if params[:email].nil? or params[:email].empty?
      return head 404
    end

    if !Student.where(email: params[:email]).exists?
      return head 404
    end

    head 200
  end

  def show_complete_signup
    render 'homepage/signup/index'
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_student
      @student = Student.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def student_params

      params.permit!

    end
end
