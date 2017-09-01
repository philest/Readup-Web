# renders views for static pages
# written so that we can keep the same view hierarchy as the storytime repo
# but should probably restructure so there isn't so much boilerplate...

class HomepageController < ActionController::Base

  @mixpanel_homepage_key = ENV['MIXPANEL_TOKEN']

  def index
    render 'homepage/index'
  end

  # This was just added to test the halting page for mobile.
  def mobile_halt
    render 'mobile_halt'
  end


  def error
    render 'homepage/register/error'
  end

  def privacy
    render 'privacy_policy'
  end

  def terms
    render 'homepage/pages/terms'
  end

  def team
    render 'team'
  end

  def instructions
    render 'instructions'
  end

  def product_lead
    redirect_to 'homepage/pages/product'
  end

  def developer
    render 'homepage/pages/jobs/developer'
  end

  def pilots
    render 'homepage/pages/jobs/pilots'
  end

  def schools
    render 'homepage/pages/jobs/schools'
  end

  def illustrator
    render 'homepage/pages/jobs/illustrator'
  end

  def design
    render 'homepage/pages/jobs/design'
  end

  def signup_success
    render 'homepage/signup/success'
  end


end
