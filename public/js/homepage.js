/**
 * JS for all homepage modals, forms, and validations.
 */


function registerUser (event, target, platform) {
    event.preventDefault();
    event.stopPropagation();
    $(target).validate({ // initialize the plugin
        rules: {
            first_name: {
                required: true
            },
            last_name: {
              required: true
            },
            password: {
                required: true
            }
        }
    }).form();

    var ValidStatus = $(target).valid();
    if (ValidStatus == false) {
        mixpanel.track('invalid name-password given', {'platform': platform});
        return false;
    }
    $(target).submit();
}

var triggeredMobileForm = false;

$( document ).ready(function() {

  function transitionToNamePassword() {
    $('#signup-email-mobile').validate({ // initialize the plugin
      rules: {
        usernameDisplay: {
            validateContactId: true
        }
      }
    }).form();

    var ValidStatus = $("#signup-email-mobile").valid();
    if (ValidStatus == false) {
        return false;
        mixpanel.track('invalid username given', {"platform": "mobile"});
    } else {
      var username = $('form#signup-email-mobile input[name=usernameDisplay]').val();


      $('#signup-email-button-mobile').slideUp();
      $('.signup-name-password-mobile').slideDown();
      mixpanel.track('email given', {"platform": "mobile"});
    }

    var username = $('#signup-email-mobile input[name=usernameDisplay]').val();

    var usernameFieldName = 'user[email]';
    var input = $('<input>')
                      .attr('type', 'hidden')
                      .attr('name', usernameFieldName)
                      .val(username);
    $('#signup-name-password-mobile').append($(input));


  }

  $('#signup-email-button-mobile').click(function(event) {
    transitionToNamePassword();
  });


  $('form#signup-email-mobile input[name=usernameDisplay]').change(function(event) {
    var usernameDisplay = $('form#signup-email-mobile input[name=usernameDisplay]').val();
    $('form#signup-email-mobile input[name=username]').val(usernameDisplay);
  });

  $('#login').validate({ // initialize the plugin
     rules: {
         email: {
             required: true,
             email: true
         },
         password: {
             required: true
         },
         signature: {
           required: true
         }
     }
  });


  $('#signup-email-button-desktop').click(function(event) {
    event.preventDefault();

    $('#signup-email').validate({ // initialize the plugin
        rules: {
            usernameDisplay: {
                email: true,
                required: true
            }
        }
    }).form();

    if (!$("#signup-email").valid()) {
        mixpanel.track('invalid email given', {'platform':'desktop'});
        return false;
    }

    triggeredMobileForm = true;

    var username = $('form#signup-email input[name=usernameDisplay]').val();
    var usernameDisplay = username;

    $.ajax({
      url: 'auth/user_exists',
      type: 'get',
      data: {
        email: username
      },
      success: function(data) {
        // a user already exists with this username/phone, so log that user in
        $('#teacher-info input[name=usernameDisplay]').val(usernameDisplay);
        $('#teacher-info input[name=username]').val(username);
        $('#myModal').modal('toggle');
      },
      error: function (xhr, ajaxOptions, thrownError){
          if(xhr.status==404) {
            // a user doesn't exist with this phone/username
            $('body').addClass('modalTransition');
            $('#signupNamePassword').modal('toggle');
              // alert(thrownError);
          }
      }

    });

    mixpanel.track('email given', {'platform':'desktop'});

  });




  $('#signup-name-password-button-mobile').click(function(event) {
    var target = '#signup-name-password-mobile';
    registerUser(event, target, 'mobile');
  });


  // handle enter button on signup form
  $('#signup-email-mobile').on('keyup keypress', function(e) {
    var target = '#signup-name-password-mobile';
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      if (triggeredMobileForm) {
        console.log('my name is')
        registerUser(event, target, 'mobile');
      } else {
        transitionToNamePassword();
      }
    }
  });

  // handle enter button on signup form
  $('#signup-name-password-mobile').on('keyup keypress', function(e) {
    console.log('hi')
    var target = '#signup-name-password-mobile';
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      registerUser(event, target, 'mobile');
    }
  });



  $('#signup-name-password-button').click(function(event) {

    var target = '#signup-name-password';
    registerUser(event, target, 'desktop');
  });




  $('button.demo-form-button').click(function(){
      $('form#demo-form').each(function(){
          $(this).submit();
      });
  });



  $('#signup-name-password-mobile').submit(function(event) {
    var username = $('#signup-email-mobile input[name=username]').val();
    var input = $('<input>')
                      .attr('type', 'hidden')
                      .attr('name', 'username')
                      .val(username);
    $('#signup-name-password-mobile').append($(input));

    var formdata = $("form#signup-name-password-mobile").serializeArray();
    var data = {};
    $(formdata).each(function(index, obj){
        data[obj.name] = obj.value;
    });
    console.log(data);
    mixpanel.people.set(data);

    mixpanel.track('freemium registration submitted', {'platform':'mobile'});

  });


  $('#signup-name-password').submit(function(event) {
    var username = $('#signup-email input[name=username]').val();


    var usernameFieldName = 'user[email]';
    var input = $('<input>')
                      .attr('type', 'hidden')
                      .attr('name', usernameFieldName)

                      .val(username);
    $('#signup-name-password').append($(input));

    var formdata = $("form#signup-name-password").serializeArray();
    var data = {};
    $(formdata).each(function(index, obj){
        data[obj.name] = obj.value;
    });
    console.log(data);
    mixpanel.people.set(data);

    mixpanel.track('freemium registration submitted', {'platform':'desktop'});

  });



  // this is also used in the get-the-app page
  $('#main-signup-form').submit(function(event) {
    $('.signup-form').each(function(index) {
      var info = $(this).serializeArray();

      for (var i = 0; i < info.length; i++) {
        var input = $('<input>')
                      .attr('type', 'hidden')
                      .attr('name', info[i]['name'])
                      .val(info[i]['value']);
        $('#main-signup-form').append($(input));
      }


    });
    event.preventDefault();

    $.post('freemium-signup', $('#main-signup-form').serialize())
          .done(function(data) {
            $('#congratsModal').modal('toggle');
          });
  });


  // might belong to a different page...
  $('#login').on('submit', function(event) {
    // event.preventDefault();
    var teacherinfo = $("#teacher-info").serializeArray();


    for (var i = 0; i < teacherinfo.length; i++) {
      var input = $('<input>')
                    .attr('type', 'hidden')
                    .attr('name', teacherinfo[i]['name'])
                    .val(teacherinfo[i]['value']);
      $('#login').append($(input));
    }

    var role = $('<input>')
                  .attr('type', 'hidden')
                  .attr('name', 'role')
                  .val('teacher');
    $('#login').append($(role));

  });




  $('.modal').on('hidden.bs.modal', function(event) {
     // $('body').addClass('destroy-padding');
     // $('body').removeClass('hide-scroll');
     $("body").css("padding-right", '0px');


    // if body has the class modal transition,
    //  don't remove my-modal-open
    //  remove modalTransition
    // else
    //  remove my-modal-open
    if ($('body').hasClass("modalTransition")) {
      $('body').removeClass("modalTransition");
    } else {
      $("body").removeClass("my-modal-open");
    }

  });

  $('.modal').on('shown.bs.modal', function(event) {
    // $('body').removeClass('destroy-padding');
    // $('body').addClass('hide-scroll');
    $('body').css("padding-right", '0px');
    $("body").addClass("my-modal-open");
  });


  //
  //
  // YUP, SIGNUP FLOW, RIGHT ABOVE ME!!!!!

  $('.logger-in.signup-button#top-button').click(function(event) {
    console.log('clicked the top button');
    $('body').css('right', '0px'); // fixes a mysterious problem where opening modal causes body to shift
    $('body').css('left', '0px');
    $('#myModal').modal('toggle');
  });

  $('.signup-button').click(function(event) {
    $('body').css('right', '0px'); // fixes a mysterious problem where opening modal causes body to shift
    $('body').css('left', '0px');
  });


  $('#main-signup-button').click(function(event) {
    $('body').css('right', '0px'); // fixes a mysterious problem where opening modal causes body to shift
    $('body').css('left', '0px');
  });




}); // end (document).ready