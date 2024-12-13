$(document).ready(function() {
  const successMessage = localStorage.getItem('signupSuccessMessage');
  
  if (successMessage) {
    $('#error-message')
      .removeClass('d-none alert-danger')
      .addClass('alert-success')
      .text(successMessage);

    localStorage.removeItem('signupSuccessMessage');
  }

	$('#user-login-btn').click(function() {
		const email = $('#email').val(); 
		const password = $('#password').val(); 
		
    if (!email || !password) {
      $('#error-message')
        .removeClass('d-none alert-success')
        .addClass('alert-danger')
        .text('Please fill out both email and password fields.');
      return;
    }
    authenticateUser(email, password);
	});

  // when you hit the enter button
  $('#email, #password').on('keydown', function(event) {
    if (event.key === 'Enter') {
      $('#user-login-btn').click();
    }
  });

});

function authenticateUser(email, password) {
	$.ajax({
		url: 'https://miniproject-2024.ue.r.appspot.com/authenticate',
    method: 'POST',
		data: {
			email: email,
			password: password,
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
