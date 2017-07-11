require 'rails_helper'

RSpec.describe Student, type: :model do
  fixtures :teachers
  fixtures :classrooms

  let(:goodName) { "Brosé David" }
  let(:goodEmail) { "aawahl@piss.poo" }
  let(:badEmail) { "aawe se#@.asef" }
  let(:goodPassword) { "asd as" }
  let(:badPassword) { "12345" }
  let(:goodUser) { User.new email: goodEmail, password: goodPassword }
  let(:goodPhone) { "3013328953" }
  let(:teacher) { teachers(:mr_aubs) }
  let(:goodClassroom) {
    classrooms(:mr_aubs_classroom)
  }


  it "can be created with an association with an Class" do
    expect {
      s = Student.create(Student.split_name(goodName))
      s.classrooms << goodClassroom
      @sid = s.id
    }.to change { Student.count }.by 1

    # sanity test
    news = Student.where(id: @sid).first
    expect(news.classrooms.count).to eq 1
  end
end
