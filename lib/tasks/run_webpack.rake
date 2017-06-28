# task :default => [:piss]
desc "Some description here"
namespace :run_webpack do
  `yarn run build:test`
end