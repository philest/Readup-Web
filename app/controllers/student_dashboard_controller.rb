
class StudentDashboardController < ApplicationController
  layout "student_dashboard"

  def index
    stu = Student.find_by(id: session[:student_id])
    if stu
      @student_dashboard_props = {
        studentName: "#{stu.first_name} #{stu.last_name}",
        teacherName: stu.teachers.first.signature,
      }
    else
      render inline: "Uh oh... Something went wrong..."
    end
  end
end