
class Recording < ActiveRecord::Base
  include AudioUploader::Attachment.new(:audio)
end