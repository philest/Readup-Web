require 'rails_helper'

RSpec.describe Classroom, type: :model do
  fixtures :schools, :users

  let(:school) { schools(:st_elementary) }
  let(:bogus_id) { 10_000_000 }

	it "can be created" do
    expect {
      cl = Classroom.new(school: school)
      cl.students.new(first_name: 'icl', last_name: 'bleh')
      cl.save
    }.to change { Classroom.count }.by(1)
	end

  it "can't create a classroom with a nonexistent school" do
    # if this is not true, then this example is invalid!
    expect(School.where(id: bogus_id).first.blank?).to be true
    expect {
      Classroom.create(school_id: bogus_id)
    }.not_to change { Classroom.count }
  end



  describe 'create_with_teacher_and_students' do
    let(:student_list) {
      [
        "Aubrey Wahl",
        "Philip Esterman",
        "Daniel Ernst",
      ]
    }
    let(:school_id) { school.id }
    let(:user_id) { users(:based_god).id }
    let(:teacher_signature) { "Mx. Based" }
    let(:grade_level) { 1 }
    let(:classroom_name) { "That Dope Room" }

    it 'creates a full classroom with sign-up data' do
      cl = nil
      expect {
        cl = Classroom.create_with_teacher_and_students(
          classroom_name: classroom_name,
          user_id: user_id,
          school_id: school_id,
          grade: grade_level,
          teacher_signature: teacher_signature,
          student_list: student_list,
        )
      }.to change { Classroom.count }.by 1
      expect(cl.students.count).to eq student_list.size
      expect(cl.teachers[0]).to eq Teacher.find_by(signature: teacher_signature)
    end

    it 'still creates a new classroom when bad student list data is used' do
      cl = nil
      expect {
        cl = Classroom.create_with_teacher_and_students(
          classroom_name: classroom_name,
          user_id: user_id,
          school_id: school_id,
          grade: grade_level,
          teacher_signature: teacher_signature,
          student_list: [
            "Aubrey Wahl",
            "sdfs",
            "bledh",
            ""
          ],
        )
      }.to change { Classroom.count }.by 1
      expect(cl.students.count).to eq 1
      expect(cl.teachers[0]).to eq Teacher.find_by(signature: teacher_signature)
    end


  end
end
