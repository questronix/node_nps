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

});
