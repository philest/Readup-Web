
class StudentDashboardController < ApplicationController
  layout "student_dashboard"

  def index
    @student_dashboard_props = { studentName: "Johnny Smith" }
  end
end