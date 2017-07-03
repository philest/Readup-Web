class User < ApplicationRecord

  after_initialize :set_defaults, unless: :persisted?

  # The set_defaults will only work if the object is new
  def set_defaults

  end


  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

  validates :name, presence: true, length: { maximum: 50 }
  validates :email, length: { maximum: 255 },
                    format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { allow_blank: true,
                                  case_sensitive: false },
                    allow_blank: true
  validates :phone, numericality: true,
                    allow_blank: true,
                    uniqueness: { allow_blank: true }
  validates :password, length: { minimum: 6 }


  # custom validation
  validate :phone_or_email_must_be_set
  def phone_or_email_must_be_set
    if !(phone.present? || email.present?)
      errors.add(:email, 'phone or email must be submitted')
    end
  end


  before_save {
    self.email = email.downcase if email.present?
  }

  has_secure_password
end
