require 'rails_helper'

RSpec.describe TeacherClassroom, type: :model do
  let(:name) { "Jose David" }
  let(:goodEmail) { "aawahl@piss.poo" }
  let(:badEmail) { "aawe se#@.asef" }
  let(:goodPassword) { "asd as" }
  let(:badPassword) { "12345" }
  let(:goodUser) { User.new email: goodEmail, password: goodPassword }
  let(:goodPhone) { "3013328953" }

  it "forms a proper entry of a relationship between a teacher and classroom" do
  	tmpUser = User.create(email: goodEmail, password: goodPassword, name: name)
  	tmpTeacher = tmpUser.teachers.create(signature:"Mr.Jose")
  	tmpTeacher.classrooms.create()
  	expect(TeacherClassroom.count).to eq 1
  end
end
