document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.querySelector(".toggle-password");
  const rememberMe = document.getElementById("remember");

  // Toggle password visibility
  togglePassword.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });

  // Handle form submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
      email: emailInput.value,
      password: passwordInput.value,
      remember: rememberMe.checked,
    };

    try {
      // Show loading state
      const loginButton = document.querySelector(".login-button");
      loginButton.textContent = "Signing in...";
      loginButton.disabled = true;

      // Make API call to backend
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - store token and redirect
        if (formData.remember) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }

        // Redirect to dashboard or home page
        window.location.href = "/dashboard";
      } else {
        // Show error message
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      // Handle error state
      showError(error.message);

      // Reset button state
      const loginButton = document.querySelector(".login-button");
      loginButton.textContent = "Sign In";
      loginButton.disabled = false;
    }
  });

  // Show error message function
  function showError(message) {
    // Remove existing error message if any
    const existingError = document.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Create and show new error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.cssText = `
            color: var(--error-color);
            margin: 10px 0;
            text-align: center;
            font-size: 14px;
        `;
    errorDiv.textContent = message;

    // Insert error message before the form
    loginForm.insertBefore(errorDiv, loginForm.firstChild);

    // Remove error message after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  // Input validation and real-time feedback
  emailInput.addEventListener("input", () => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
    emailInput.parentElement.style.borderColor = isValid
      ? "var(--success-color)"
      : "var(--error-color)";
  });

  passwordInput.addEventListener("input", () => {
    const isValid = passwordInput.value.length >= 6;
    passwordInput.parentElement.style.borderColor = isValid
      ? "var(--success-color)"
      : "var(--error-color)";
  });
});
