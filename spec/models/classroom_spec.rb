require 'rails_helper'

RSpec.describe Classroom, type: :model do
	it "can be created" do
		Classroom.create()
		expect(Classroom.count).to eq 1
	end
end
