$(document).ready(function(){

  jQuery.validator.addMethod("extension", function(value, element) {
  // allow any non-whitespace characters as the host part
  return this.optional( element ) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@(?:\S{1,63})$/.test( value );
}, 'Please enter a valid email address.');

    $.validator.addMethod("customemail",
            function (value, element) {
                return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
            });

    $.validator.addMethod('decimal', function (value, element) {
        return this.optional(element) || /^((\d+(\\.\d{0,2})?)|((\d*(\.\d{1,2}))))$/.test(value);
    }, "");

   $.validator.addMethod("lettersonly", function(value, element) {
    return this.optional(element) || /^[a-z]+$/i.test(value);
   }, "Please enter letters");   

   
});


//login form validation
$(function() {
 
  $.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});
  var link = $('body').data('baseurl');
 
  $("form[name='auth']").validate({
    
    rules: {

      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },

    messages: {
   
      password: {
        required: "Please enter password",
        minlength: "Your password must be at least 6 characters long"
      },
      email: {
        required: "Please enter email",
        email: "Please enter a valid email address"
      },
    },

    submitHandler: function(form) {
        form.submit();
    }
  });  



  //change password
  $("form[name='reset-auth']").validate({
      rules: {
          verification_code:{
              required : true,
           },
          password: {
              required: true,
              maxlength: 20,
              minlength: 6
          },
          confirm_password: {
              required: true,
              minlength: 6,
              maxlength: 20,
              equalTo: "#password"
          }
      },
      messages: {

        verification_code: {
              required: "We have sent you an OTP on the registered email id.Please enter it here to verify your account!.",
          },

          password: {
              required: "Please enter  password field.",
              maxlength: "Password maximun length should be 20 character.",
              minlength: "Password minimum length should be 6 character",
          },

          confirm_password: {
              required: "Confirm password should be equal to  password.",
              equalTo:   "Password and confirm password do not match.",
              minlength: "Confirm Password minimum length should be 6 character",
              maxlength: "Confirm Password maximun length should be 20 character.",
             
          },

      },
//          
  });


//change password
    $("#changepassword_form").validate({

        rules: {
            password:{
                required : true,
                maxlength : 20,
                minlength : 6
             },
            newPassword: {
                required: true,
                maxlength: 20,
                minlength: 6
            },
            confirmPassword: {
                required: true,
                maxlength: 20,
                minlength: 6,
                equalTo: "#newPassword"
            },
        },
        messages: {

          password: {
                required: "Please enter password field",

                maxlength: "New Password maximum length should be 20 character",

                minlength: "Your password must be at least 6 characters long"
            },

            newPassword: {
                required: "Please enter new password field",
                maxlength: "New Password maximum length should be 20 character",
                minlength: "Your password must be at least 6 characters long"
            },

        confirmPassword: {
          required: "Please enter confirm password field",
          equalTo:   "New password and confirm password do not match",
          minlength: "Confirm Password minimum length should be 6 character",
          maxlength: "Confirm Password maximun length should be 20 character",
         
      },
    },
//          
    });

/*-----------------------------------------------*/
//   For addEditUser (ADMIN)
    $("form[name='addEditUser']").validate({
    
    rules: {

      name: {
        required: true
      },

      password: {
        required : true,
        maxlength : 20,
        minlength : 6
     },

     confirm_password: {
        required: true,
        minlength: 6,
        maxlength: 20,
        equalTo: "#password"
    },

    email: {
      required: true,
      email: true
    },

    mobile_number: {
      required: true,
      number: true,
      minlength: 10
      
    },

    address: {
      required: true,
    },

    country_id: {
      required: true
    },

    state_id: {
      required: true
    },

    city_id: {
      required: true
    },
    phone_code: {
      required: true
    }

    },

    messages: {
   
      email: {
        required: "Please enter email",
        email: "Please enter a valid email address"
      },
      name: {
        required: "Please enter name",
      },
      password: {
        required: "Please enter password",
        maxlength: "Password maximum length should be 20 character",
        minlength: "Your password must be at least 6 characters long"
      },
      confirm_password: {
        required: "Please enter password.",
        equalTo:   "Password and confirm password do not match.",
        minlength: "Confirm Password minimum length should be 6 character",
        maxlength: "Confirm Password maximun length should be 20 character.",
      },
      mobile_number: {
        required: "Please enter mobile number",
        minlength: "Your mobile number must be at least 10 characters long",
        number: "mobile number accepts only numeric value"
      },
      address: {
        required: "Please enter address"
      },
      country_id: {
        required: "please select a country"
      },
      state_id: {
        required: "Please select state"
      },
      city_id: {
        required: "Please select city"
      },
      phone_code: {
        required: "Please enter phone code"
      },

    },

    submitHandler: function(form) {
        form.submit();
    }
  });




/*-----------------------------------------------*/
//   For add Country (ADMIN)
    $("form[name='add_country']").validate({
    
    rules: {
      name: {
        required: true
      },
    },

    messages: {
      name: {
        required: "Please enter Country Name",
      },
    },

    submitHandler: function(form) {
        form.submit();
    }
  });

  /*-----------------------------------------------*/
//   For edit Country (ADMIN)
    $("form[name='edit_country']").validate({
    
    rules: {
      name: {
        required: true
      },
    },

    messages: {
      name: {
        required: "Please enter Country Name",
      },
    },

    submitHandler: function(form) {
        form.submit();
    }
  });
    /*-----------------------------------------------*/
//   For add State (ADMIN)
    $("form[name='add_state']").validate({
    
    rules: {
      country_name: {
        required: true
      },
      state_name: {
        required: true
      },
    },

    messages: {
      country_name: {
        required: "Please select Country Name",
      },
      state_name: {
        required: "Please select State Name",
      },
    },

    submitHandler: function(form) {
        form.submit();
    }
  });

  //   For edit State (ADMIN)
  $("form[name='edit_state']").validate({
    
    rules: {
      country_name: {
        required: true
      },
      state_name: {
        required: true
      },
    },

    messages: {
      country_name: {
        required: "Please select Country Name",
      },
      state_name: {
        required: "Please select State Name",
      },
    },

    submitHandler: function(form) {
        form.submit();
    }
  });

  //Add city name
  $("form[name='add_city']").validate({
    
    rules: {
      country_name: {
        required: true
      },
      state_name: {
        required: true
      },
      city_name: {
        required: true
      },
    },

    messages: {
      country_name: {
        required: "Please select country name",
      },
      state_name: {
        required: "Please select state name",
      },
      city_name: {
        required: "Please enter city name",
      },
    },

    submitHandler: function(form) {
        form.submit();
    }
  });

  //Edit city name
  $("form[name='edit_city']").validate({
    
    rules: {
      country_name: {
        required: true
      },
      state_name: {
        required: true
      },
      city_name: {
        required: true
      },
    },

    messages: {
      country_name: {
        required: "Please select country name",
      },
      state_name: {
        required: "Please select state name",
      },
      city_name: {
        required: "Please enter city name",
      },
    },

    submitHandler: function(form) {
        form.submit();
    }
  });

  //Update admin profile
  $("form[name='edit_profile']").validate({
    
    rules: {
      first_name: {
        required: true
      },
      last_name: {
        required: true
      },
      email: {
        required: true,
        email: true,
      },
      contact_no: {
        required: true,
        digits:true,
        maxlength: 10,
        minlength: 10
      },
    },

    messages: {
      first_name: {
        required: "Please enter first name",
      },
      last_name: {
        required: "Please enter first name",
      },
      email: {
        required: "Please enter first name",
        email: "Please enter valid email",
      },
      contact_no: {
        required: "Please enter contect number",
        digits: "Please enter only numbers",
        minlength: "Contect number minimum length should be 10 character",
        maxlength: "Contect number maximun length should be 10 character.",
      },
    },

    submitHandler: function(form) {
        form.submit();
    }
  });


  //Admin change password
  $("form[name='change_password']").validate({
    
    rules: {
      new_password: {
        required: true,
        maxlength: 20,
        minlength: 6
      },
      confirm_password: {
        required: true,
        maxlength: 20,
        minlength: 6,
        equalTo: "#new_password"
      },
      
    },

    messages: {
      new_password: {
        required: "Please enter new password.",
        maxlength: "New Password maximun length should be 20 character.",
        minlength: "New Password minimum length should be 6 character",
      },
      confirm_password: {
        required: "Please enter confirm password.",
        equalTo:   "Password and confirm password do not match.",
        minlength: "Confirm Password minimum length should be 6 character",
        maxlength: "Confirm Password maximun length should be 20 character.",
      },
    },

    submitHandler: function(form) {
        form.submit();
    }
  });


  /*#############Admin for got password ################*/
  $("form[name='forgotpasswordform']").validate({
    
    rules: {
      email: {
        required: true,
        email: true,
      },
    },

    messages: {
      email: {
        required: "Please enter email address",
        email: "Please enter a valid email address"
      },
    },

    submitHandler: function(form) {
        form.submit();
    }
  });

});


/*##############################  web  section #######################################*/

