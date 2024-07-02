


const loginBtn = document.getElementById('login');
const signupBtn = document.getElementById('signup');


  
document.addEventListener('DOMContentLoaded', function () {
    const signupSubmit = document.getElementById('signup-submit-btn');
    const loginSubmit = document.getElementById('login-submit-btn');
    console.log("hello");
    // Registration form submission
        signupSubmit.addEventListener('submit', async function (event) {
            console.log("submit");
            event.preventDefault();
        
            const user_id = document.getElementById('UserId').value;
            const email = document.getElementById('Email').value;
            const password = document.getElementById('Password').value;
        
            try {
            const response = await fetch('http://localhost:3000/register/', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id, email, password }),
            });
        
            if (response.ok) {
                console.log('Registration successful');
                // Redirect to login page or perform any other action after successful registration
            } else {
                const errorData = await response.json();
                console.error('Registration failed:', errorData.error);
            }
            } catch (error) {
            console.error('Error during registration:', error);
            }
        });
        
        // Login form submission
        loginSubmit.addEventListener('submit', async function (event) {
            event.preventDefault();
        
            const user_id = document.getElementById('UserId2').value;
            const password = document.getElementById('Password2').value;
        
            try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id, password }),
            });

            console.log(response);
            window.myData = "Hello from login.js!";
            if (response.ok) {
                console.log('Login successful');

                window.location.href = 'index.html';
            
            
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData.error);
            }
            } catch (error) {
            console.error('Error during login:', error);
            }
        });
});

loginBtn.addEventListener('click', (e) => {
	let parent = e.target.parentNode.parentNode;
	Array.from(e.target.parentNode.parentNode.classList).find((element) => {
		if(element !== "slide-up") {
			parent.classList.add('slide-up')
		}else{
			signupBtn.parentNode.classList.add('slide-up')
			parent.classList.remove('slide-up')
		}
	});
});

signupBtn.addEventListener('click', (e) => {
	let parent = e.target.parentNode;
	Array.from(e.target.parentNode.classList).find((element) => {
		if(element !== "slide-up") {
			parent.classList.add('slide-up')
		}else{
			loginBtn.parentNode.parentNode.classList.add('slide-up')
			parent.classList.remove('slide-up')
		}
	});
});
// login.js
const forgotPasswordLink = document.getElementById('forgot-password-link');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const recoverPasswordBtn = document.getElementById('recover-password-btn');

forgotPasswordLink.addEventListener('click', function (event) {
    event.preventDefault();
    showForgotPasswordForm();
});

function showForgotPasswordForm() {
    forgotPasswordForm.style.display = 'block';
    loginForm.style.display = 'none';
}

recoverPasswordBtn.addEventListener('click', async function (event) {
    event.preventDefault();

    const recoveryUserId = document.getElementById('recovery-user-id').value;
    const recoverySecurityAnswer = document.getElementById('recovery-security-answer').value;

    try {
        const response = await fetch('http://localhost:3000/recover-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: recoveryUserId, security_answer: recoverySecurityAnswer }),
        });

        if (response.ok) {
            const newPassword = await response.text();
            alert('Password recovered successfully. Your new password is: ' + newPassword);
            // Redirect or perform any other action after successful password recovery
        } else {
            const errorData = await response.json();
            console.error('Password recovery failed:', errorData.error);
            alert('Password recovery failed. Please check your user ID and security answer.');
        }
    } catch (error) {
        console.error('Error during password recovery:', error);
    }
});

// login.js
