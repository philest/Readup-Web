require 'rails_helper'

RSpec.describe School, type: :model do
  fixtures :schools
  it "it has fixture data" do
    expect(School.count).to eq 2
  end
end
