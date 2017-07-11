require 'rails_helper'

RSpec.describe User, type: :model do
  fixtures :users

  let(:name) { "Jose David" }
  let(:goodEmail) { "aawahl@piss.poo" }
  let(:badEmail) { "aawe se#@.asef" }
  let(:goodPassword) { "asd as" }
  let(:badPassword) { "12345" }
  let(:goodUser) { User.new email: goodEmail, password: goodPassword }
  let(:goodPhone) { "3013328953" }

  it "Should be using test database" do
    expect(ActiveRecord::Base.connection_config[:database]).to match(/test/)
  end

  it "User table has count = 2 when create!" do
    expect {
      User.create(email: goodEmail, password: goodPassword, name: name)
    }.to change { User.count }.by(1)
  end

  it "has default user" do
    expect(User.count).to eq 1
  end

  it "fails if no phone or email provided" do
    expect {
      User.create(password: badPassword, name: name)
    }.not_to change { User.count }
  end

  it "succeeds when phone is provided" do
    expect {
      User.create(phone: goodPhone, password: goodPassword, name: name)
      u = User.new(phone: goodPhone, password: goodPassword, name: name)
      puts u.phone
    }.to change { User.count }.by(1)
  end

  it 'authenticates a valid password' do
    u = User.create(email: goodEmail, password: goodPassword, name: name)
    expect(!!u.authenticate(goodPassword)).to be true
    expect(!!u.authenticate(badPassword)).to be false
  end

  context 'name field on user creation' do
    let(:new_user) {
      User.new(email: goodEmail, password: goodPassword)
    }

    describe 'fails when' do
      it 'single name entered' do
        expect {
          new_user.name = "Aubrey"
          new_user.save
        }.not_to change { User.count }
      end

      it 'only blankspace used' do
        expect {
          new_user.name = "\t\t\n"
          new_user.save
        }.not_to change { User.count }
      end

      it 'blankspace and only one name used' do
        expect {
          new_user.name = "\t\t\nssdf\t "
          new_user.save
        }.not_to change { User.count }
      end
    end

    describe 'succeeds when' do
      it 'two names given' do
        expect {
          new_user.name = "Aubrey Wahl"
          new_user.save
        }.to change { User.count }.by 1
        u = User.where(email: goodEmail).first
        expect(u.first_name).to eq "Aubrey"
        expect(u.last_name).to eq "Wahl"
      end
      it 'two names given with hyphen' do
        expect {
          new_user.name = "Aubrey Alonzo-Wahl"
          new_user.save
        }.to change { User.count }.by 1
        u = User.where(email: goodEmail).first
        expect(u.first_name).to eq "Aubrey"
        expect(u.last_name).to eq "Alonzo-Wahl"
      end
      it 'three names given' do
        expect {
          new_user.name = "Aubrey Alonzo Wahl"
          new_user.save
        }.to change { User.count }.by 1
        u = User.where(email: goodEmail).first
        expect(u.first_name).to eq "Aubrey Alonzo"
        expect(u.last_name).to eq "Wahl"
      end
    end

  end

end
