class ClassroomsController < ApplicationController


  # GET /classrooms
  # GET /classrooms.json
  def index
    @classrooms = User.all
  end

  # GET /classrooms/1
  # GET /classrooms/1.json
  def show
    @classroom = Classroom.find(params[:id])

    render json: @classroom , status: :ok, location: @classroom
  end

  # GET /classrooms/new
  def new
    @classrooms = User.new

  end

  # GET /classrooms/1/edit
  def edit
  end


end
