class Birdv < ActiveRecord::Base
  self.abstract_class = true
  establish_connection(:birdv_production)
end

class BirdupP < ActiveRecord::Base
  self.abstract_class = true
  establish_connection(:birdup_production)
end

module B
  class School < Birdv
    includes School
    self.table_name = "freemium_schools"
  end
end

module P
  class School < BirdupP
    includes School
  end
end



schools = B::School.all


School.transaction do
  schools.each do |s|
    s_2 = s
          .attributes
          .except("updated_at")
          .except("district_id")
          .except("plan")
          .except("created_at")
          .except("tz_offset")
    P::School.create(s_2)
  end
end
