require 'rails_helper'

RSpec.describe User, type: :model do
  let(:name) { "Jose David" }
  let(:goodEmail) { "aawahl@piss.poo" }
  let(:badEmail) { "aawe se#@.asef" }
  let(:goodPassword) { "asd as" }
  let(:badPassword) { "12345" }
  let(:goodUser) { User.new email: goodEmail, password: goodPassword }
  let(:goodPhone) { "3013328953" }

  it "User table has count = 1 when create!" do
    User.create(email: goodEmail, password: goodPassword)
    expect(User.count).to eq 1
  end

  it "has should not have users when running this test because of the system" do
    expect(User.count).to eq 0
  end

  it "fails if no phone or email provided" do
    User.create(password: badPassword)
    expect(User.count).to eq 0
  end

  it "succeeds when phone is provided" do
    User.create(phone: goodPhone, password: goodPassword)
    u = User.new(phone: goodPhone, password: goodPassword)
    puts u.phone
    expect(User.count).to eq 1
  end

  it 'authenticates a valid password' do
    u = User.create(email: goodEmail, password: goodPassword)
    expect(!!u.authenticate(goodPassword)).to be true
    expect(!!u.authenticate(badPassword)).to be false
  end
end