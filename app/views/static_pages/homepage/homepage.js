/**
 * JS for all homepage modals, forms, and validations.
 */


$( document ).ready(function() {


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

  // $('.logger-in.signup-button#top-button').click(function(event) {
  //   console.log('clicked the top button');
  //   $('body').css('right', '0px'); // fixes a mysterious problem where opening modal causes body to shift
  //   $('body').css('left', '0px');
  //   $('#myModal').modal('toggle');
  // });

  // $('.signup-button').click(function(event) {
  //   $('body').css('right', '0px'); // fixes a mysterious problem where opening modal causes body to shift
  //   $('body').css('left', '0px');
  // });


  // $('#main-signup-button').click(function(event) {
  //   $('body').css('right', '0px'); // fixes a mysterious problem where opening modal causes body to shift
  //   $('body').css('left', '0px');
  // });
}); // end (document).ready