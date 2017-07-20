class AudioUploader < Shrine
  plugin :activerecord
  plugin :determine_mime_type
  plugin :validation_helpers
  plugin :direct_upload, max_size: 50*1024*1024 # 50 MB

  Attacher.validate do
    puts"\n\n\n\n\n ayayayayay \n\n\n\n "
    # validate_max_size 50.megabytes, message: 'is too large (max is 50 MB)'
    validate_mime_type_inclusion %w[audio/wav]
  end

  # this the routine that takes stuff from cache forder to store folder
  def process(io, context)
    if context[:phase] == :store
      {
        original: io,      # this results in the file s3://store/recording/:id/original
        # large: size_700,
        # medium: size_500,
        # small: size_300,
        # thumb: thumb
      }
    end
  end
end


