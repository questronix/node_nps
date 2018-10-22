$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    $('#add_department_employee_submit').on('click', function() {
      $('#add_department_employee').submit();
    });

    $('#add_client_submit').on('click', function() {
      $('#add_client').submit();
    });

    $('#login').on('click', function() {
      $('#login_form').submit();
    });

    $('#employee_department').on('change', function() {
      var department_id = $('#employee_department').val();
      $.ajax({
        type: 'get',
        url: '/clients/get_employees/' + department_id,
        dataType: 'json',
        success: function(response) {
          var select = $('#employee_name');
          var options = '<option value="" selected disabled>- Select Employee -</option>';
          select.empty();

          for(var i=0; i<response.length; i++) {
            options += '<option value="' + response[i].employee_id + '">' + response[i].name + '</option>';
          }
          select.append(options);
        },
        error: function(xhr, status, error) {
          console.log(error);
        }
      });
    });

});
