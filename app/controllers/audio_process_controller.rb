class AudioProcessController < ApplicationController
  before_action :set_s3_direct_post

  def index
    render 'audio'
  end

  # #
  # def save_file
  #   audio = params[:audio]
  #   save_path = Rails.root.join("public/")
  #   save_path_complete = save_path + audio.original_filename

  #   audio.rewind

  #   # Open and write the file to file system.
  #   File.open(save_path_complete, 'wb') do |f|
  #     f.write audio.read
  #   end

  #   audio.rewind

  #   AudioProcessWorker.perform_async(save_path, save_path_complete, audio.original_filename)

  #   redirect_to action: 'index', status: 200
  # end

  #
  # def save_link
  #   puts params[:awsRes]
  #   redirect_to action: 'index', status: 201
  # end

  def aws_presign
    if @s3_direct_post
      render json: { fields: @s3_direct_post.fields, url: @s3_direct_post.url }
    else
      render status: 404, json: {
        error: "You're not logged in or you didn't supply an assessment_id!",
        assId: params["assessment_id"],
        stu_id: session[:student_id]
      }
    end
  end

  private

  def set_s3_direct_post
    puts "#{params["assessment_id"]}\n\n\n\n\n\n\n\n"
  

    # TODO PHIL NOTE: THIS IS A HACK SO NO USERS NEED TO BE CREATED.
    # THE REAL IMPLEMENTATION IS COMMENTED OUT BELOW 
    if true

      # Create the dummy user linked to the real assesment. Dummy user updated after email collected. 
      User.create(first_name: "Dummy", last_name: "Teacher", name: "Dummy Teacher", password:"testtest", email:"dummy#{rand(1000000)}@gmail.com")
      User.last.teachers.create(signature:"Ms. Demo")
      Teacher.last.classrooms.create()
      Classroom.last.students.create(first_name: "Demo", last_name: "Student")
      Student.last.assessments.create(book_key: "RECORDING_URL", scored_text: "BLANK_SCORED_TEXT")

      puts "Created this assessment:\n#{User.last.teachers.last.classrooms.last.students.last.assessments.last}"

      key = "fake-assessments/#{ENV['RAILS_ENV']}/#{User.last.id}/${filename}"
      @s3_direct_post = S3_BUCKET.presigned_post(
        key: key,
        success_action_status: '201',
        acl: 'public-read',
      )

      # TODO PHIL NOTE: An atrocious hack. Hijacking the book key to start AWS URL of recording
      key = "fake-assessments/#{ENV['RAILS_ENV']}/#{User.last.id}/recording.webm"
      start_url = "https://s3-us-west-2.amazonaws.com/readup-now/"
      full_url = start_url + key
      default_scored_text = "{\"readingEndIndex\":{\"paragraphIndex\":3,\"wordIndex\":-1},\"paragraphs\":[{\"key\":\"fake_key_0\",\"words\":[{\"word\":\"The\",\"wordDeleted\":true,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"moon\",\"wordDeleted\":true,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"is\",\"wordDeleted\":true,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"high\",\"wordDeleted\":true,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"and\",\"wordDeleted\":true,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"the\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"stars\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"are\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"bright.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Daddy\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"tells\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"me,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"It's\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"a\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"firefly\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"night!\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]},{\"key\":\"fake_key_1\",\"words\":[{\"word\":\"Fireflies\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"shine.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"All\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"of\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"them\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"glow.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"I\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"race\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"to\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"show\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Daddy\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"their\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"dancing\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"light\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"show.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]},{\"key\":\"fake_key_2\",\"words\":[{\"word\":\"I\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"open\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"my\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"jar.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"They\",\"wordDeleted\":true,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"fly\",\"wordDeleted\":true,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"away\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"quickly\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"and\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"shine.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"I\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"love\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"catching\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"fireflies,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"but\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"they\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"are\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"not\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"mine.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]}]}" 

      Assessment.last.update(book_key: full_url, scored_text: default_scored_text) 




      # TODO PHIL add the scored_text default 


    # if session[:student_id] && params["assessment_id"]
      # @s3_direct_post = S3_BUCKET.presigned_post(
      #   key: "assessments/#{session[:student_id]}/#{params["assessment_id"]}/${filename}",
      #   success_action_status: '201',
      #   acl: 'public-read',
      # )
    else
      @s3_direct_post = false
    end
  end
end
