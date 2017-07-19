class AudioUploader < Shrine
  plugin :determine_mime_type
  plugin :validation_helpers
  plugin :direct_upload, max_size: 50*1024*1024 # 50 MB

  Attacher.validate do
    validate_max_size 50.megabytes, message: 'is too large (max is 50 MB)'
    validate_mime_type_inclusion %w[audio/wav]
  end

end