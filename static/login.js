$(document).ready(function() {
  const successMessage = localStorage.getItem('signupSuccessMessage');
  
  if (successMessage) {
    // Display the success message
    $('#error-message')
      .removeClass('d-none alert-danger')
      .addClass('alert-success') // Change styling to success
      .text(successMessage);

    // Remove the message from localStorage to prevent it from showing again
    localStorage.removeItem('signupSuccessMessage');
  }

	$('#user-login-btn').click(function() {
		const email = $('#email').val(); // Assuming your email input field has id="email"
		const password = $('#password').val(); // Assuming your password input field has id="password"
		
    if (!email || !password) {
      $('#error-message')
        .removeClass('d-none alert-success')
        .addClass('alert-danger')
        .text('Please fill out both email and password fields.');
      return;
    }

    authenticateUser(email, password);
	});

});

function authenticateUser(email, password) {
	$.ajax({
		url: 'https://miniproject-2024.ue.r.appspot.com/authenticate',
    method: 'POST',
		data: {
			email: email,
			password: password,
      // clientName: 'BronxHousing'
			clientName: 'HomeSweetHome'
		},
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    crossDomain: true,
		success: function(response) {
			$('#error-message').addClass('d-none').text('');
			console.log('Authentication successful! Token:', response);
      localStorage.setItem('token', response)
			window.location.href = 'index.html';
		},
		error: function(xhr) {
			// Handle different error scenarios
			let errorText = '';
      switch (xhr.status) {
        case 400: // Bad Request
          errorText = 'Please fill out both email and password fields.';
          break;
        case 404: // Not Found
          errorText = 'No account found with the provided email.';
          break;
        case 401: // Unauthorized
          errorText = 'Invalid password. Please try again.';
          break;
        default: // Other errors
          errorText = 'An unexpected error occurred. Please try again later.';
      }

      $('#error-message')
        .removeClass('d-none alert-success')
        .addClass('alert-danger')
        .text(errorText);
		}
	});	
}