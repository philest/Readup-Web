# renders views for static pages
# written so that we can keep the same view hierarchy as the storytime repo
# but should probably restructure so there isn't so much boilerplate...

class StaticPagesController < ApplicationController

  def index
    @mixpanel_homepage_key = ENV['MIXPANEL_HOMEPAGE']
    render 'static_pages/homepage/index'
  end

  def app
    render 'static_pages/pages/get-the-app'
  end

  def error
    render 'static_pages/register/error'
  end

  def privacy
    render 'static_pages/pages/privacy_policy'
  end

  def terms
    render 'static_pages/pages/terms'
  end

  def read
    redirect_to '/signup'
  end

  def doc
    redirect_to '/doc/'
  end

  def start
    redirect_to '/signup'
  end

  def go
    redirect_to 'http://m.me/490917624435792'
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



end