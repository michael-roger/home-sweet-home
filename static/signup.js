$(document).ready(function () {
        $('#user-signup-btn').click(function () {
                const firstName = $('#first-name').val();
                const lastName = $('#last-name').val();
                const email = $('#email').val();
                const password = $('#password').val();
                const retypePassword = $('#retype-password').val();

                if (password !== retypePassword) {
                        alert("Passwords do not match!");
                        return;
                }
    
                create_user(firstName, lastName, email, password);
        });
});

function create_user(firstName, lastName, email, password) {
        // Assuming a backend API endpoint exists for signup
        $.ajax({
                url: 'http://127.0.0.1:5000/signup', // TODO: Replace with actual url
                method: 'POST',
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                },
                success: function (response) {
                    alert("Sign up successful!");
                    window.location.href = "login.html"; // Redirect to login page
                },
                error: function (error) {
                    alert("An error occurred during sign up: " + error.responseText);
                }
        });
}