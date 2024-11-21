$(document).ready(function() {

	$('user-login-btn').click(function() {
		const email = $('#email').val(); // Assuming your email input field has id="email"
		const password = $('#password').val(); // Assuming your password input field has id="password"
		authenticateUser(email, password);
	});

});

function authenticate_user(email, password) {
	$.ajax({
        url: 'http://127.0.0.1:5000/authenticate', // TODO: URL
        method: 'POST',
        data: { email: email, password: password },
        success: function(response) {
            // Handle success (HTTP 200 OK)
            console.log('Authentication successful! User ID:', response);
            // Redirect or display success message
            alert('Login successful! Your user ID is: ' + response);
        },
        error: function(jqXHR) {
            // Handle different error scenarios
            switch (jqXHR.status) {
                case 400: // Bad Request
                    console.error('Error: Missing email or password.');
                    alert('Please fill out both email and password fields.');
                    break;
                case 404: // Not Found
                    console.error('Error: User not found.');
                    alert('No account found with the provided email.');
                    break;
                case 401: // Unauthorized
                    console.error('Error: Incorrect password.');
                    alert('Invalid password. Please try again.');
                    break;
                default: // Other errors
                    console.error('Error:', jqXHR.statusText);
                    alert('An unexpected error occurred. Please try again later.');
            }
        }
    });
}