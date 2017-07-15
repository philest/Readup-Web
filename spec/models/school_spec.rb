require 'rails_helper'

RSpec.describe School, type: :model do
  fixtures :schools

  let(:bad_id) { 3_000_000 }
  let(:valid_attributes) {
    {
      name: "Test School",
      address: "70 Laidley St",
      city: "San Francisco",
      state: "CA"
    }
  }


  it "it has fixture data" do
    expect(School.count).to eq 2
  end

  it "cannot have an invalid creator" do
    expect(School.first.update(creator_id: bad_id)).to be false
  end

  context "when creating a new one" do
    it "has a default creator with id 2" do
      expect(School.create(valid_attributes).creator.id).to eq 2
    end
  end
end
