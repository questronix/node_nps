$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    $('#registration_submit').on('click', function() {
      $('#registration_form').submit();
    });

    $('#login').on('click', function() {
      $('#login_form').submit();
    });

});
