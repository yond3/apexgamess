// Wrap code in an IIFE to avoid polluting the global scope
(function() {

    // --- Get Elements ---
    const signInModal = document.getElementById('signInModal');
    const signInBtn = document.getElementById('signInBtn');
    const closeModalBtn = signInModal ? signInModal.querySelector('.close-modal') : null;
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');

    // Forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Form Inputs (Signup) - Check if they exist before use
    const signupUsername = document.getElementById('signupUsername');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupPasswordRepeat = document.getElementById('signupPasswordRepeat');

    // Form Inputs (Login) - Check if they exist before use
    const loginIdentifier = document.getElementById('loginIdentifier');
    const loginPassword = document.getElementById('loginPassword');

    // Other Modal Elements
    const loginSwitchBtns = document.querySelectorAll('.login-switch-btn');
    const signupSwitchBtns = document.querySelectorAll('.signup-switch-btn');
    const passwordToggles = document.querySelectorAll('.toggle-password i');

    // --- Modal Visibility Functions ---
    function openModal() {
        if (signInModal) {
            signInModal.style.display = 'flex';
            switchToSignupTab(); // Default to signup
            clearAllErrors(); // Clear any previous errors when opening
        }
    }

    function closeModal() {
        if (signInModal) {
            signInModal.style.display = 'none';
        }
    }

    // --- Tab Switching Functions ---
    function switchToLoginTab() {
        if (!loginTab || !signupTab || !loginForm || !signupForm) return;
        loginTab.classList.add('active-tab');
        signupTab.classList.remove('active-tab');
        loginForm.classList.remove('hidden-form');
        signupForm.classList.add('hidden-form');
        clearAllErrors(); // Clear errors when switching tabs
    }

    function switchToSignupTab() {
        if (!loginTab || !signupTab || !loginForm || !signupForm) return;
        signupTab.classList.add('active-tab');
        loginTab.classList.remove('active-tab');
        signupForm.classList.remove('hidden-form');
        loginForm.classList.add('hidden-form');
        clearAllErrors(); // Clear errors when switching tabs
    }

    // --- Password Visibility Toggle ---
    function togglePasswordVisibility(event) {
        const wrapper = event.target.closest('.input-wrapper');
        if (!wrapper) return;
        const passwordInput = wrapper.querySelector('input[type="password"], input[type="text"]');
        const icon = event.target;

        if (passwordInput && icon) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    }

    // --- Validation Helper Functions ---

    // Basic email format check (more complex regex exists, but this is common)
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Display an error message for a specific field
    function displayError(inputId, message) {
        const inputElement = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + 'Error');
        if (inputElement && errorElement) {
            inputElement.classList.add('invalid');
            errorElement.textContent = message;
            errorElement.classList.add('visible'); // Make error visible
        } else {
            console.warn(`Could not find input or error element for ID: ${inputId}`);
        }
    }

    // Clear error message for a specific field
    function clearError(inputId) {
        const inputElement = document.getElementById(inputId);
        const errorElement = document.getElementById(inputId + 'Error');
        if (inputElement && errorElement) {
            inputElement.classList.remove('invalid');
            // errorElement.textContent = ''; // Keep text for fixed height
             errorElement.classList.remove('visible'); // Hide error space/text
        }
    }

    // Clear all error messages in both forms
    function clearAllErrors() {
        const errorMessages = document.querySelectorAll('#signInModal .error-message');
        const invalidInputs = document.querySelectorAll('#signInModal input.invalid');
        errorMessages.forEach(span => {
             // span.textContent = ''; // Keep text for fixed height
             span.classList.remove('visible');
        });
        invalidInputs.forEach(input => input.classList.remove('invalid'));
    }

    // --- Form Validation Logic ---

    function validateSignupForm() {
        // Ensure elements exist before validating
        if (!signupUsername || !signupEmail || !signupPassword || !signupPasswordRepeat) {
            console.error("Signup form elements not found!");
            return false;
        }
        clearAllErrors(); // Clear previous errors first
        let isValid = true;
        const minPasswordLength = 8;

        // Username Validation (only check if empty)
        if (!signupUsername.value.trim()) {
            displayError('signupUsername', 'Username is required.');
            isValid = false;
        }

        // Email Validation
        if (!signupEmail.value.trim()) {
            displayError('signupEmail', 'Email is required.');
            isValid = false;
        } else if (!isValidEmail(signupEmail.value.trim())) {
            displayError('signupEmail', 'Please enter a valid email address.');
            isValid = false;
        }

        // Password Validation
        if (!signupPassword.value) { // Don't trim password value
            displayError('signupPassword', 'Password is required.');
            isValid = false;
        } else if (signupPassword.value.length < minPasswordLength) {
            displayError('signupPassword', `Password must be at least ${minPasswordLength} characters long.`);
            isValid = false;
        }

        // Repeat Password Validation
        if (!signupPasswordRepeat.value) {
            displayError('signupPasswordRepeat', 'Please repeat your password.');
            isValid = false;
        } else if (signupPassword.value && signupPassword.value !== signupPasswordRepeat.value) {
            displayError('signupPasswordRepeat', 'Passwords do not match.');
            isValid = false;
        }

        return isValid;
    }

    function validateLoginForm() {
         // Ensure elements exist before validating
        if (!loginIdentifier || !loginPassword) {
            console.error("Login form elements not found!");
            return false;
        }
        clearAllErrors(); // Clear previous errors first
        let isValid = true;

        // Identifier Validation (Username or Email)
        if (!loginIdentifier.value.trim()) {
            displayError('loginIdentifier', 'Username or Email is required.');
            isValid = false;
        }
        // Note: Could add email format check here if identifier looks like an email

        // Password Validation
        if (!loginPassword.value) { // Don't trim password
            displayError('loginPassword', 'Password is required.');
            isValid = false;
        }

        return isValid;
    }


    // --- Event Listeners ---

    // Open modal button
    if (signInBtn) {
        signInBtn.addEventListener('click', openModal);
    } else {
        console.error("Sign In Button (#signInBtn) not found!");
    }

    // Close modal button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close modal via overlay click
    if (signInModal) {
        signInModal.addEventListener('click', (event) => {
            if (event.target === signInModal) {
                closeModal();
            }
        });
    }

    // Tab switching via tab buttons
    if (loginTab) loginTab.addEventListener('click', switchToLoginTab);
    if (signupTab) signupTab.addEventListener('click', switchToSignupTab);

    // Tab switching via buttons inside forms
    loginSwitchBtns.forEach(btn => btn.addEventListener('click', switchToLoginTab));
    signupSwitchBtns.forEach(btn => btn.addEventListener('click', switchToSignupTab));

    // Password visibility toggle
    passwordToggles.forEach(icon => {
        const parentSpan = icon.closest('.toggle-password');
        if (parentSpan) {
             parentSpan.style.cursor = 'pointer';
             parentSpan.setAttribute('tabindex', '0');

             icon.addEventListener('click', togglePasswordVisibility); // Listen on icon click

             parentSpan.addEventListener('keydown', (event) => { // Listen on span keydown
                 if (event.key === 'Enter' || event.key === ' ') {
                     event.preventDefault();
                     togglePasswordVisibility({ target: icon }); // Trigger with icon as target
                 }
             });
        }
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && signInModal && signInModal.style.display === 'flex') {
            closeModal();
        }
    });

    // --- Form Submit Event Listeners with Validation ---
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default submission ALWAYS
            if (validateSignupForm()) {
                console.log('Signup form validation successful! Ready to submit.');
                // Option A: If using traditional form submission to 'action' URL:
                // signupForm.submit();

                // Option B: If using Fetch/AJAX (replace console.log with fetch call):
                alert('Signup validation passed! (Check console for details)');
                // closeModal(); // Optionally close modal on success
            } else {
                console.log('Signup form validation failed.');
            }
        });
    } else {
         console.warn("Signup form not found on this page.");
    }


    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default submission ALWAYS
            if (validateLoginForm()) {
                console.log('Login form validation successful! Ready to submit.');
                // Option A: If using traditional form submission to 'action' URL:
                // loginForm.submit();

                // Option B: If using Fetch/AJAX (replace console.log with fetch call):
                 alert('Login validation passed! (Check console for details)');
                 // closeModal(); // Optionally close modal on success
            } else {
                console.log('Login form validation failed.');
            }
        });
    } else {
         console.warn("Login form not found on this page.");
    }


    // Clear errors when user starts typing in a field again
    [signupUsername, signupEmail, signupPassword, signupPasswordRepeat, loginIdentifier, loginPassword].forEach(input => {
        // Check if the input element actually exists on the page before adding listener
        if (input) {
            input.addEventListener('input', () => {
                 // Also check if the corresponding error span exists
                if (document.getElementById(input.id + 'Error')) {
                    clearError(input.id);
                }
            });
        }
    });


})(); // End of IIFE