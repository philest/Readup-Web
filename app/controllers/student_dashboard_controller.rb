
class StudentDashboardController < ApplicationController
  layout "student_dashboard"

  def index
    @student_dashboard_props = { name: "Daniel	" }
  end
end