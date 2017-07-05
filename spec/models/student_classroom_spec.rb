require 'rails_helper'

RSpec.describe StudentClassroom, type: :model do
  let(:name) { "Jose David" }
  let(:goodEmail) { "aawahl@piss.poo" }
  let(:badEmail) { "aawe se#@.asef" }
  let(:goodPassword) { "asd as" }
  let(:badPassword) { "12345" }
  let(:goodUser) { User.new email: goodEmail, password: goodPassword }
  let(:goodPhone) { "3013328953" }

  it "forms a proper entry of a relationship between a student and classroom" do
  	tmpStudent = Student.create(name: name, grade: 3)
  	tmpStudent.classrooms.create()
  	expect(StudentClassroom.count).to eq 1
  end
end
