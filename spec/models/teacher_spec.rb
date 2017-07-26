require 'rails_helper'

RSpec.describe Teacher, type: :model do
  fixtures :teachers

  let(:goodName) { "Jose David" }
  let(:goodEmail) { "aawahl@piss.poo" }
  let(:badEmail) { "aawe se#@.asef" }
  let(:goodPassword) { "asd as" }
  let(:badPassword) { "12345" }
  let(:goodUser) { User.new email: goodEmail, password: goodPassword }
  let(:goodPhone) { "3013328953" }

  it "can be created with an association with an User" do
    expect {
    	tmpUser = User.create(email: goodEmail, password: goodPassword, name: goodName)
    	tmpUser.teachers.create(signature: "Mr.Jose")
    }.to change { Teacher.count }.by 1
  end
end
