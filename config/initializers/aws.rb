Aws.config = {
  access_key_id: ENV['AWS_ACCESS_KEY_ID'],
  secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
  region: ENV['AWS_BUCKET_REGION'],
}

puts "Hi, my name is #{ENV['AWS_REGION']}"

Aws.eager_autoload!

# S3_BUCKET =  Aws::S3::Client.new.buckets[ENV['S3_BUCKET']]
S3_BUCKET = Aws::S3::Resource.new.bucket(ENV['S3_BUCKET'])