class RecordingsController < ApplicationController
  before_action :set_recording, only: [:show, :edit, :update, :destroy]

  def index
    @recordings = Recording.all
  end

  def show

  render plain: "we did it fam #{@recording.inspect}"

  end

  def new
    @recording = Recording.new
  end

  def edit
  end

  def create
    @recording = Recording.new(recording_params)

    if @recording.save
      self.show
    else
      render :new
    end
  end

  def update
    if @recording.update(recording_params)
      redirect_to @recording, notice: 'recording was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @recording.destroy
    redirect_to recordings_url, notice: 'recording was successfully destroyed.'
  end

  private

  def set_recording
    @recording = Recording.find(params[:id])
  end

  def recording_params
    params.require(:recording).permit(:name, :recording, :remove_recording, :audio)
  end
end