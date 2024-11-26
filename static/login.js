$(document).ready(function() {

	$('#user-login-btn').click(function() {
		const email = $('#email').val(); // Assuming your email input field has id="email"
		const password = $('#password').val(); // Assuming your password input field has id="password"
		authenticateUser(email, password);
	});

});

function authenticate_user(email, password) {
	$.ajax({
		url: 'https://miniproject-2024.ue.r.appspot.com/authenticate', // Adjust the URL if your backend runs on a different port
		method: 'POST',
		data: {
			email: email,
			password: password,
			clientName: 'home-sweet-home'
		},
		success: function(response) {
			$('#error-message').addClass('d-none').text('');
			console.log('Authentication successful! Token:', response);
			localStorage.setItem('token', response);
			window.location.href = 'index.html';
		},
		error: function(jqXHR) {
			// Handle different error scenarios
			let errorText = '';
      switch (jqXHR.status) {
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

      // Display error message
      $('#error-message').removeClass('d-none').text(errorText);
		}
	});	
}