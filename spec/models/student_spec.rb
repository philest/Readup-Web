require 'rails_helper'

RSpec.describe Student, type: :model do
  let(:name) { "Jose David" }
  let(:goodEmail) { "aawahl@piss.poo" }
  let(:badEmail) { "aawe se#@.asef" }
  let(:goodPassword) { "asd as" }
  let(:badPassword) { "12345" }
  let(:goodUser) { User.new email: goodEmail, password: goodPassword }
  let(:goodPhone) { "3013328953" }

  it "can be created with an association with an Class" do
  	tmpClass = Classroom.create()
  	tmpStu = tmpClass.students.create(name: name, grade: 3)
  	expect(Student.count).to eq 1
  end
end
