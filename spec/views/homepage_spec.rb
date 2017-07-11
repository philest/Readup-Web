
require 'rails_helper'

RSpec.describe "homepage", type: :view do

  it 'renders the homepage' do
    visit '/'
    expect(page).to have_content('The easiest way to assess reading fluency and comprehension')
    expect(page).to have_content('Spend your time teaching, not testing')
  end

  it 'has good links to static content' do
    visit '/'
    click_link 'About Us'
    expect(page).to have_content('Our Team')
    click_link 'navbar-title' # back to homepage
    click_link 'Terms & Privacy'
    expect(page).to have_content('privacy policy')
    visit '/'
    click_link 'Trust & Safety'
    expect(page).to have_content('privacy policy')
  end

  xit 'presents the login modal' do
    visit '/'
    click_button 'Log in'
    expect(page).to have_content('Email address or phone number')
    expect(page).to have_content('Password')
  end

  xit 'requires valid login information' do
    visit '/'
    click_button 'Log in'

    expect(find_field('usernameDisplay')[:required]).to be_truthy
    expect(find_field('password')[:required]).to be_truthy

    fill_in('usernameDisplay', :with => 'test')
    fill_in('password', :with => 'testpassword')
    click_button 'Continue'
    expect(page).to have_content('Invalid')
  end

  xit 'should log the user in iff valid credentials are entered' do
    pending 'Implementation of login'
  end

  it 'presents the signup modal from splash' do
    visit '/'
    within('nav.navbar') do
      click_on('Sign up')
    end
    expect(page).to have_content('Welcome')
  end

  it 'presents the signup modal from navbar' do
    visit '/'
    find('#main-signup-button').click
    expect(page).to have_content('Welcome')
  end

  xit 'takes user from signup to login if user already exists' do
    pending 'Implementation'
  end

  xit 'requires valid username on signup' do
    visit '/'
    find('#main-signup-button').click
    click_button 'Continue'
    expect(page).to have_content('This field is required')
    fill_in('usernameDisplay', :with => 'capybara-test-new-user')
    expect(page).to have_content('Invalid')
  end

  it 'advances to signup enter name and password given valid username' do
    visit '/'
    find('#main-signup-button').click
    page.execute_script("document.getElementById('signup-email-input').value = 'capybara-test-new-user@readupapp.com'")
    click_button 'Continue'
    expect(page).to have_content('Enter your name and password')
  end

  it 'requires valid name and password for signup' do
    visit '/'
    find('#main-signup-button').click
    page.execute_script("document.getElementById('signup-email-input').value = 'capybara-test-new-user@readupapp.com'")
    click_button 'Continue'
    click_button 'Complete sign up'
    expect(page).to have_content('This field is required')
  end

  it 'registers user and advances to choose school' do
    visit '/'
    find('#main-signup-button').click
    page.execute_script("document.getElementById('signup-email-input').value = 'capybara-test-new-user@readupapp.com'")
    page.execute_script("$('form#signup-email input[name=username]').val('capybara-test-new-user@readupapp.com')"); # need to manually update the hidden input since we're changing the value with javascript
    click_button 'Continue'

    # set fields and submit
    expect {
      page.execute_script("document.getElementById('signup-first-input').value = 'First'")
      page.execute_script("document.getElementById('signup-last-input').value = 'First'")
      page.execute_script("document.getElementById('signup-password-input').value = 'password'")
      click_button 'signup-name-password-button'
    }.to change(User, :count).by(1)    # check that user was created successfully

    expect(page).to have_content('Add your school')
  end

  it 'allows the user to choose their school, requires valid input, then advances to signature page' do
    visit '/'
    find('#main-signup-button').click
    page.execute_script("document.getElementById('signup-email-input').value = 'capybara-test-new-user@readupapp.com'")
    page.execute_script("$('form#signup-email input[name=username]').val('capybara-test-new-user@readupapp.com')"); # need to manually update the hidden input since we're changing the value with javascript
    click_button 'Continue'
    # set fields and submit
    page.execute_script("document.getElementById('signup-first-input').value = 'First'")
    page.execute_script("document.getElementById('signup-last-input').value = 'First'")
    page.execute_script("document.getElementById('signup-password-input').value = 'password'")
    click_button 'signup-name-password-button'

    page.execute_script("document.getElementsByName('school_name')[0].value = 'Kapaa Elementary School'")
    click_link 'Continue'
    expect(page).to have_content('required') # catch invalid input (no grade)

    find("option[value='0']").click
    click_link 'Continue'
    expect(page).to have_content('What do parents call you?')

  end

end




