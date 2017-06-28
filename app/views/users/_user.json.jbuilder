json.extract! user, :id, :email, :phone, :default_locale, :default_signature, :default_propic, :name, :first_name, :last_name, :created_at, :updated_at
json.url user_url(user, format: :json)
