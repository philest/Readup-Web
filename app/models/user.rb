class User < ApplicationRecord

  after_initialize :set_defaults, unless: :persisted?

  # The set_defaults will only work if the object is new
  def set_defaults
    self.email ||= ""
    self.phone ||= ""
  end


  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

  # validates :name, presence: true, length: { maximum: 50 }
  validates :email, length: { maximum: 255 },
                    format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false },
                    allow_blank: true

  # custom validation
  validate :email_or_password_must_be_set
  def email_or_password_must_be_set
    if !(phone.present? || email.present?)
      errors.add(:email, 'password or email must be submitted')
    end
  end


  before_save {
    self.email = email.downcase
  }

  has_secure_password
end
