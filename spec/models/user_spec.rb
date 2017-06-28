require 'rails_helper'

RSpec.describe User, type: :model do
  it "has one user when create" do
    User.create(email: 'aawahl@gmail.com', password: 'piss')
    expect(User.count).to eq 1
  end
end
