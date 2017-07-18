Aws.config = {
  :access_key_id => ENV['AWS_ACCESS_KEY_ID'],
  :secret_access_key => ENV['AWS_SECRET_ACCESS_KEY'],
  :region => 'us-west-1'
}

Aws.eager_autoload!

# S3_BUCKET =  Aws::S3::Client.new.buckets[ENV['S3_BUCKET']]
S3_BUCKET =  Aws::S3::Resource.new.bucket(ENV['S3_BUCKET'])