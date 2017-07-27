# renders views for static pages
# written so that we can keep the same view hierarchy as the storytime repo
# but should probably restructure so there isn't so much boilerplate...

class StaticPagesController < ActionController::Base

  @mixpanel_homepage_key = ENV['MIXPANEL_HOMEPAGE']

  def index
    render 'static_pages/homepage/index'
  end

  # This was just added to test the halting page for mobile. 
  def mobile_halt 
    render 'static_pages/homepage/mobile_halt'
  end

  # add just to test school selection
  # def school
  #   render 'static_pages/signup/index'
  # end

  # def app
  #   render 'static_pages/pages/get-the-app'
  # end

  def error
    render 'static_pages/register/error'
  end

  def privacy
    render 'static_pages/pages/privacy_policy'
  end

  def terms
    render 'static_pages/pages/terms'
  end

  def team
    render 'static_pages/pages/team'
  end

  def case_study
    render 'static_pages/pages/case_study'
  end

  def join
    render 'static_pages/pages/job_board'
  end

  def product_lead
    redirect_to 'static_pages/pages/product'
  end

  def developer
    render 'static_pages/pages/jobs/developer'
  end

  def pilots
    render 'static_pages/pages/jobs/pilots'
  end

  def schools
    render 'static_pages/pages/jobs/schools'
  end

  def illustrator
    render 'static_pages/pages/jobs/illustrator'
  end

  def design
    render 'static_pages/pages/jobs/design'
  end

  def signup_success
    render 'static_pages/signup/success'
  end


end
