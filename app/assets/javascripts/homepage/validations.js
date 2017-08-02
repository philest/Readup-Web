/**
 * Custom validation methods
 * Must require this before other JS files in .erb files; otherwise use a js bundler.
 */

 $( document ).ready(function() {

  jQuery.validator.addMethod("validateContactId", function(value, element) {
    return ValidateEmail(value) || validatePhone(value);
  }, "Invalid email or phone number.");


  function ValidateEmail(mail)
  {

    // https://stackoverflow.com/a/46181
   if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(mail))

    {
      return (true)
    }

    return (false)
  }

  function validatePhone(phone) {
      var error = "";
      var stripped = phone.replace(/[\(\)\.\-\ ]/g, '');

     if (stripped == "") {
          error = "You didn't enter a phone number.";
          return false;
      } else if (isNaN(parseInt(stripped))) {
          phone = "";
          error = "The phone number contains illegal characters.";
          return false;

      } else if (!(stripped.length == 10 || stripped.length == 11)) {
          phone = "";
          error = "The phone number is the wrong length. Make sure you included an area code.\n";
          return false;
      } else {
        return true;
      }
  }
});