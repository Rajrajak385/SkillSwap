document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  const currentUser = localStorage.getItem("currentUser")
  if (currentUser) {
    // Redirect to dashboard if on login or signup page
    const currentPage = window.location.pathname.split("/").pop()
    if (currentPage === "login.html" || currentPage === "signup.html") {
      window.location.href = "dashboard.html"
    }
  }

  // Password visibility toggle
  const passwordToggles = document.querySelectorAll(".password-toggle")
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const passwordInput = this.previousElementSibling
      const icon = this.querySelector("i")

      if (passwordInput.type === "password") {
        passwordInput.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {
        passwordInput.type = "password"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      }
    })
  })

  // Signup form submission
  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Clear previous errors
      clearErrors()

      // Get form values
      const name = document.getElementById("name").value.trim()
      const email = document.getElementById("email").value.trim()
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value

      // Validate form
      let isValid = true

      if (!name) {
        showError("name-error", "Name is required")
        isValid = false
      }

      if (!email) {
        showError("email-error", "Email is required")
        isValid = false
      } else if (!isValidEmail(email)) {
        showError("email-error", "Email is invalid")
        isValid = false
      }

      if (!password) {
        showError("password-error", "Password is required")
        isValid = false
      } else if (password.length < 6) {
        showError("password-error", "Password must be at least 6 characters")
        isValid = false
      }

      if (password !== confirmPassword) {
        showError("confirm-password-error", "Passwords do not match")
        isValid = false
      }

      if (isValid) {
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const existingUser = users.find((user) => user.email === email)

        if (existingUser) {
          showError("email-error", "Email already in use")
          return
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          name: name,
          email: email,
          password: password, // In a real app, this would be hashed
          skillsToTeach: [],
          skillsToLearn: [],
          createdAt: new Date().toISOString(),
        }

        // Add user to users array
        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))

        // Set current user
        localStorage.setItem("currentUser", JSON.stringify(newUser))

        // Show success message
        showToast("Account created!", "You have successfully signed up.")

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "dashboard.html"
        }, 1500)
      }
    })
  }

  // Login form submission
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Clear previous errors
      clearErrors()

      // Get form values
      const email = document.getElementById("email").value.trim()
      const password = document.getElementById("password").value

      // Validate form
      let isValid = true

      if (!email) {
        showError("email-error", "Email is required")
        isValid = false
      }

      if (!password) {
        showError("password-error", "Password is required")
        isValid = false
      }

      if (isValid) {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]")

        // Find user with matching email and password
        const user = users.find((u) => u.email === email && u.password === password)

        if (user) {
          // Set current user
          localStorage.setItem("currentUser", JSON.stringify(user))

          // Show success message
          showToast("Login successful!", "Welcome back to Skill Swap.")

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            window.location.href = "dashboard.html"
          }, 1500)
        } else {
          // Show error message
          const loginError = document.getElementById("login-error")
          loginError.textContent = "Invalid email or password"
          loginError.style.display = "block"
        }
      }
    })
  }

  // Helper functions
  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId)
    if (errorElement) {
      errorElement.textContent = message
    }
  }

  function clearErrors() {
    const errorElements = document.querySelectorAll(".error-message")
    errorElements.forEach((element) => {
      element.textContent = ""
    })

    const loginError = document.getElementById("login-error")
    if (loginError) {
      loginError.style.display = "none"
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  function showToast(title, message) {
    // Create toast element
    const toast = document.createElement("div")
    toast.classList.add("toast")

    // Create toast header
    const toastHeader = document.createElement("div")
    toastHeader.classList.add("toast-header")
    toastHeader.textContent = title

    // Create toast body
    const toastBody = document.createElement("div")
    toastBody.classList.add("toast-body")
    toastBody.textContent = message

    // Append header and body to toast
    toast.appendChild(toastHeader)
    toast.appendChild(toastBody)

    // Append toast to body
    document.body.appendChild(toast)

    // Show toast
    toast.classList.add("show")

    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("show")
      // Remove toast from DOM after animation
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 500)
    }, 3000)
  }
})
