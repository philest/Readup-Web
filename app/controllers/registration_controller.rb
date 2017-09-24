

class RegistrationController < ApplicationController
  # todo: write a before-action for getting demo classroom
  # TODO PHIL - skip for now 
  skip_before_action :verify_authenticity_token

  def get_user_count
    puts "now getting count...."

    render json: { ok: true, user_count: User.count }, status: :ok, location: @user

    return User.count 
  end


  def get_last_student_id 
    puts "now getting student id...."

    render json: { ok: true, student_id: Student.last.id }, status: :ok, location: @student

    return Student.count 
  end
  
  #  TODO PHIL: Hack for creating the user, teacher, school, class, assessment for the demo
  def phil_setup_demo
      # Create the dummy user linked to the real assesment. Dummy user updated after email collected. 
      User.create(first_name: "Dummy", last_name: "Teacher", name: "Dummy Teacher", password: "12345678", email:"dummy#{rand(1000000)}@gmail.com")

      classroom_options = {
        classroom_name: "Demo Homeroom",
        user_id: User.last.id,
        school_id: School.find_by(name: 'Demo School'),
        grade: 2,
        teacher_signature: "Mrs. Demo",
        student_list: ["Demo Student"]
      }

      if @new_classroom = Classroom.create_with_teacher_and_students(classroom_options)
        # set the student id as session so that the demo can work properly
        t = @new_classroom.teachers.first
        demo_student = @new_classroom.students.find_by(last_name: "Student", first_name: "Demo")

        session[:student_id] = demo_student.id || nil
      end

      Student.last.assessments.create(book_key: "RECORDING_URL", scored_text: "BLANK_SCORED_TEXT")

      # TODO PHIL NOTE: An atrocious hack. Hijacking the book key to start AWS URL of recording
      key = "https://s3-us-west-2.amazonaws.com/readup-now/website/homepage/sofia.wav"
      default_scored_text = "{\"readingEndIndex\":{\"paragraphIndex\":3,\"wordIndex\":-1},\"paragraphs\":[{\"key\":\"fake_key_0\",\"words\":[{\"word\":\"The\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"moon\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"is\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"high\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"and\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"the\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"stars\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"are\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"bright.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Daddy\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"tells\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"me,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"It's\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"a\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"firefly\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"night!\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]},{\"key\":\"fake_key_1\",\"words\":[{\"word\":\"Fireflies\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"shine.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"All\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"of\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"them\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"glow.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"I\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"race\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"to\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"show\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Daddy\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"their\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"dancing\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"light\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"show.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]},{\"key\":\"fake_key_2\",\"words\":[{\"word\":\"I\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"open\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"my\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"jar.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"They\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"fly\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"away\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"quickly\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"and\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"shine.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"I\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"love\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"catching\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"fireflies,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"but\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"they\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"are\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"not\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"mine.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]}]}" 

      nick_scored_text = "{\"readingEndIndex\":{\"paragraphIndex\":9999,\"wordIndex\":9999},\"paragraphs\":[{\"key\":\"fake_key_0\",\"words\":[{\"word\":\"Nick\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"was\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"looking\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"at\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"his\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"book.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"His\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"mom\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"came\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"in\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"and\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"said,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"It’s\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"time\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"for\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"bed.\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"Okay,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Mom,\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"said\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]},{\"key\":\"fake_key_1\",\"words\":[{\"word\":\"Nick\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"put\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"on\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"his\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"pajamas.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"He\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"washed\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"his\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"face\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"and\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"brushed\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"his\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"teeth.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"He\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"was\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"ready\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"for\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"bed.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]},{\"key\":\"fake_key_2\",\"words\":[{\"word\":\"\\\"Will\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"you\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"read\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"me\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"a\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"story?\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"asked\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"his\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"mom.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Mom\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"read\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"the\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"story\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"to\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"liked\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"the\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"story\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"about\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"the\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"magic\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"fish.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]},{\"key\":\"fake_key_3\",\"words\":[{\"word\":\"When\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"the\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"story\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"was\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"over,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick's\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"mom\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"turned\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"off\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"the\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"light.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"Good\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"night,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick,\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"his\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"mom\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"said.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]},{\"key\":\"fake_key_4\",\"words\":[{\"word\":\"\\\"Will\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"you\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"turn\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"on\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"the\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"nightlight?\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"asked\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"Okay,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick,\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"his\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"mom\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"said.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"She\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"turned\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"it\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"on.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]},{\"key\":\"fake_key_5\",\"words\":[{\"word\":\"\\\"Good\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"night,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick,\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"his\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"mom\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"said.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"Now\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"it’s\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"time\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"to\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"go\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"to\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"sleep.\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"I\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"can’t\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"go\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"to\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"sleep,\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"said\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"I\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"will\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"give\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"you\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"a\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"good\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"night\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"kiss,\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"said\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick's\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"mom\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]},{\"key\":\"fake_key_6\",\"words\":[{\"word\":\"\\\"I\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"can’t\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"go\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"to\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"sleep,\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"said\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"Will\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"you\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"open\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"the\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"door?\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"he\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"asked.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick’s\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"mom\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"opened\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"the\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"door.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Light\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"came\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"into\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"the\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"room.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]},{\"key\":\"fake_key_7\",\"words\":[{\"word\":\"\\\"Good\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"night,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick,\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"his\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"mom\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"said.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"Go\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"to\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"sleep\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"now.\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"I\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"can't\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"go\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"to\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"sleep,\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"said\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"Something\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"is\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"missing.\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]},{\"key\":\"fake_key_8\",\"words\":[{\"word\":\"He\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"looked\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"around\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"the\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"room.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Something\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"came\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"in\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"the\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"door.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"Wags!\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"You’re\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"late,\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"said\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"Now\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"we\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"can\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"go\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"to\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"sleep.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]},{\"key\":\"fake_key_9\",\"words\":[{\"word\":\"\\\"Good\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"night,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick,\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"said\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Mom.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"Good\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"night,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Wags.\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"\\\"Good\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"night,\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Mom,\\\"\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"said\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null},{\"word\":\"Nick.\",\"wordDeleted\":false,\"substituteWord\":null,\"addAfterWord\":null}]}]}" 

      Assessment.last.update(book_key: key, scored_text: nick_scored_text) 



      puts "Created this assessment:\n#{User.last.teachers.last.classrooms.last.students.last.assessments.last}"
  end 
  # END TODO PHIL 





  def create_demo_classroom
    classroom_options = {
      classroom_name: "Demo Homeroom",
      user_id: params["user_id"].to_i,
      school_id: School.find_by(name: 'Demo School'),
      grade: 5,
      teacher_signature: params["user_name"],
      student_list: ["Demo Student"]
    }

    if @new_classroom = Classroom.create_with_teacher_and_students(classroom_options)

      # set the student id as session so that the demo can work properly
      t = @new_classroom.teachers.first
      demo_student = @new_classroom.students.find_by(last_name: "Student", first_name: "Demo")

      session[:student_id] = demo_student.id || nil

      render json: { ok: true }, status: :ok, location: @user


    else
      head 403
    end
  end



  def create_classroom

    classroom_options = {
      classroom_name: params["classroom_name"],
      user_id: params["user_id"].to_i,
      school_id: params["school_id"].to_i,
      grade: params["classroom_grade"].to_i,
      teacher_signature: params["signature"],
      student_list: params["student_names"]
    }


    puts 'classroom options:'
    puts classroom_options

    if @new_classroom = Classroom.create_with_teacher_and_students(classroom_options)

      # set the student id as session so that the demo can work properly
      t = @new_classroom.teachers.first
      demo_student = @new_classroom.students.find_by(last_name: "Student", first_name: "Demo")

      session[:student_id] = demo_student.id || 'totes not set'

    	head :ok
    else
      head 404
    end

  end


  def search_school
    puts params.inspect
    # blacklist = [
    #   'ReadUp',
    #   'Freemium',
    #   'Freemium School',
    #   'ST Elementary'
    # ]

    schools = School.search(params["term"]).limit(10)
    school_list = schools.map do |s|

      location = ''
      if s.city && s.state
        location = "#{s.city}, #{s.state}"
      elsif s.city
        location = s.city.to_s
      elsif s.state
        location = s.state.to_s
      end
      {
        label: s.name,
        id: s.id,
        value: s.id,
        desc: location,
        city: s.city,
        state: s.state
      }
    end

    puts school_list

    render json: school_list

  end
end
