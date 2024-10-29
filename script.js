// Registration Form Validation
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const constraintsDiv = document.getElementById('passwordConstraints');
    constraintsDiv.innerHTML = ''; // Clear previous messages

    let isValid = true;

    if (username === '' || email === '' || password === '') {
        alert('All fields are required!');
    } else if (!validateEmail(email)) {
        alert('Invalid email format');
    } else {
        if (!validatePassword(password)) {
            isValid = false;

            if (!/(?=.*[A-Z])/.test(password)) {
                constraintsDiv.innerHTML += '<p>Password must contain at least one uppercase letter.</p>';
            }
            if (!/(?=.*[a-z])/.test(password)) {
                constraintsDiv.innerHTML += '<p>Password must contain at least one lowercase letter.</p>';
            }
            if (!/(?=.*\d)/.test(password)) {
                constraintsDiv.innerHTML += '<p>Password must contain at least one number.</p>';
            }
            if (!/(?=.*\W)/.test(password)) {
                constraintsDiv.innerHTML += '<p>Password must contain at least one special character.</p>';
            }
            if (password.length < 6) {
                constraintsDiv.innerHTML += '<p>Password must be at least 6 characters long.</p>';
            }
        }
    }

    if (isValid) {
        alert('Registration successful!');
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
    }
});

// Password validation function
function validatePassword(password) {
    // Must contain at least one uppercase letter, one lowercase letter, one digit, and one special character
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{6,}$/;
    return passwordPattern.test(password);
}

// Toggle Password Visibility
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.src = 'eye-icon-open.png'; // Update this to your open eye icon
    } else {
        passwordField.type = 'password';
        eyeIcon.src = 'eye-icon.png'; // Change back to closed eye icon
    }
}

// Email validation function
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Load profile information from localStorage
document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (username && email) {
        document.getElementById('username').textContent = username;
        document.getElementById('email').textContent = email;
    }
});
