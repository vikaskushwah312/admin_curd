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

   //Initialize Select2 Elements
    if ($('.select2').length > 0) {
        $(".select2").select2();
    }
});

 setTimeout(function () {
    $(".alert").fadeOut("slow", function () {
        $(".alert").remove();
    });

}, 2000);

 $.ajaxSetup({
    headers: {

        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }

});


 function deleteData(url , table = null) {
    
    var row = $(this).closest("tr").get(0);
    swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((value) => {
            if (value == 1) {
                swal("Deleted !", "Your record has been deleted !", "success");
                $.post(SITEURL + '/admin/' + url, function(data) {
                    if (data == 1) { //In case if data is deleted

                        var oTable = $('#'+table).dataTable(); // JQuery dataTable function to delete the row from the table
                        //oTable.fnDeleteRow(oTable.fnGetPosition(row));// JQuery dataTable function to delete the row from the table
                        oTable.fnDraw(false);
                    } else
                        alert(data);
                });

            } else {
                swal("Cancelled", "Your record is safe", "error");
            }
        });
}


function getChangeData(edit_id = null, main_id, put_id, put_select_value, change_id = null, change_select_value = null){
    var table_name = $('#'+main_id).attr('data-table');
    var id = $('#'+main_id + ' option:selected').val();
   
    $.ajax({
                url: SITEURL + '/admin/get-all-data',
                type: 'post',
                dataType: 'json',
                data: {
                    id: id,
                    table_name: table_name,
                    find_id :main_id,
                    edit_id :edit_id
                },
                success: function (msg)
                {
                    if (msg.success == true) {
                        var opt = '<option value="">'+ put_select_value+' </option>';
                        $.each(msg.result, function (i, item) {
                            var selected = (item.id == edit_id)?('selected'):('');
                            
                            opt += '<option value="' + item.id + '"  '+selected+'>' + item.name + '</option>';
                        });
                        $('#'+put_id).html(opt);

                        var htm = '<option value="">'+ change_select_value+'</option>';
                        $('#'+change_id).html(htm);
                    } else
                    {

                        var opt = '<option value="">'+ put_select_value+'</option>';
                        $('#'+put_id).html(opt);

                        var htm = '<option value="">'+ change_select_value+'</option>';
                        $('#'+change_id).html(htm);
                    }
                }
            });

 }


function readURL(input, id = '#blah') {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(id)
                    .attr('src', e.target.result)
                    .width(100)
                    .height(100);
        };

        reader.readAsDataURL(input.files[0]);
}
}

//login form validation
$(function() {

 //Date picker
$('.datepicker').datepicker({
  autoclose: true,
  format: 'yyyy/m/d'
})

 $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });

 if ($("#update-profile").length > 0) {
    $("#update-profile").validate({
    
    rules: {
      name: {
        required: true,
        maxlength: 50
      },

       mobile_number: {
            required: true,
            digits:true,
            minlength: 10,
            maxlength:12,
        },
        email: {
                maxlength: 50,
                email: true,
                customemail: true,
            }, 
         
    },
    messages: {
      
      name: {
        required: "Please enter name",
        maxlength: "Your last name maxlength should be 50 characters long."
      },
      mobile_number: {
        required: "Please enter contact number",
        minlength: "The contact number should be 10 digits",
        digits: "Please enter only numbers",
        maxlength: "The contact number should be 10 digits",
      },
      email: {
          email: "Please enter valid email",
          customemail: "Please enter valid email",
          maxlength: "The email name should less than or equal to 50 characters",
        },
      
},
    
    submitHandler: function(form) {
      form.submit();
    }
    });
  }


//change password
if ($("#change-password").length > 0) {
 $("#change-password").validate({
    rules: {
        password:{
            required : true,
            maxlength : 20,
            minlength : 5
         },
        new_password: {
            required: true,
            maxlength: 20,
            minlength: 5
        },
        confirm_password: {
            required: true,
            maxlength: 20,
            minlength: 5,
            equalTo: "#new_password"
        },
    },
    messages: {

      password: {
            required: "Please enter password field",

            maxlength: "New Password maximum length should be 20 character",

            minlength: "Your password must be at least 5 characters long"
        },

        new_password: {
            required: "Please enter new password field",
            maxlength: "New Password maximum length should be 20 character",
            minlength: "Your password must be at least 5 characters long"
        },

    confirm_password: {
      required: "Please enter confirm password field",
      equalTo:   "New password and confirm password do not match",
      minlength: "Confirm Password minimum length should be 6 character",
      maxlength: "Confirm Password maximun length should be 20 character",
     
      },
    },
    //          
    });
}

//this bracket top function
});