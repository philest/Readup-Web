# task :default => [:piss]
desc "Some description here"
namespace :run_webpack do
  puts "\n\n\n\n RUNNING WEBPACK IF TEST YAY \n#{Dir.pwd} test?:#{Rails.env.test?}\n\n\n\n"
  if Rails.env.test?
    `yarn run build:test`
  else
    puts "eh I guess I'm not gonna pack the web"
  end
end