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

  def instructions
    render 'instructions'
  end

  def library 
  pdf_filename = File.join(Rails.root, "public/ReadUp-Leveled-Books-Library.pdf")
  send_file(pdf_filename, :filename => "ReadUp-Leveled-Books.pdf", :type => "application/pdf", :disposition => 'inline')
  end 



end
