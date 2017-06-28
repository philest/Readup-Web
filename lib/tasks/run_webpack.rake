# task :default => [:piss]
desc "Some description here"
namespace :run_webpack do
  puts "\n\n\n\n RUNNING WEBPACK YAY --Aubs\n#{Dir.pwd}\n\n\n\n"
  `yarn run build:test`
end