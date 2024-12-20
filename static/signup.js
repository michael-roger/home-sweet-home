$(document).ready(function () {
  $('#user-signup-btn').click(function () {
    const firstName = $('#first-name').val().trim();
    const lastName = $('#last-name').val().trim();
    const email = $('#email').val().trim();
    const password = $('#password').val().trim();
    const retypePassword = $('#retype-password').val().trim();

    if (!firstName || !lastName || !email || !password || !retypePassword) {
      $('#error-message').removeClass('d-none').text("All fields are required. Please fill out all fields.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      $('#error-message').removeClass('d-none').text("Please enter a valid email address.");
      return;
    }

    if (password !== retypePassword) {
      $('#error-message').removeClass('d-none').text("Passwords do not match!");
      return;
    }

    $('#error-message').addClass('d-none').text("");

    create_user(firstName, lastName, email, password);
  });

  $('#first-name, #last-name, #email, #password, #retype-password').on('keydown', function (event) {
    if (event.key === 'Enter') {
      $('#user-signup-btn').click();
    }
  });
});

function create_user(firstName, lastName, email, password) {
  $.ajax({
    url: 'https://miniproject-2024.ue.r.appspot.com/users',
    method: 'POST',
    data: {
      firstName: firstName,
      lastName: lastName,
      emailAddress: email,
      password: password
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    crossDomain: true,
    success: function (response) {
      localStorage.setItem('signupSuccessMessage', 'Sign up successful! Please log in.');
      window.location.href = "login.html";
    },
    error: function (xhr) {
      // Handle errors with appropriate messages
      let errorText = '';
      switch (xhr.status) {
        case 400: // Bad Request
          errorText = 'Please fill out all the fields.';
          break;
        case 409: // Conflict
          errorText = 'An account aleady exists with this email.'
          break;
        default:
          errorText = 'An unexpected error occurred. Please try again later.'
      }

      // Display error message
      $('#error-message').removeClass('d-none').text(errorText);
    }
  });
}
