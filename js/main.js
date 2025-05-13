// Theme Toggle
document.addEventListener("DOMContentLoaded", () => {
  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode")
    updateThemeIcon(true)
  }

  // Theme toggle functionality
  const themeToggleButtons = document.querySelectorAll("#theme-toggle")
  themeToggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode")
      const isDarkMode = document.body.classList.contains("dark-mode")
      localStorage.setItem("theme", isDarkMode ? "dark" : "light")
      updateThemeIcon(isDarkMode)
    })
  })

  function updateThemeIcon(isDarkMode) {
    themeToggleButtons.forEach((button) => {
      const icon = button.querySelector("i")
      if (isDarkMode) {
        icon.classList.remove("fa-moon")
        icon.classList.add("fa-sun")
      } else {
        icon.classList.remove("fa-sun")
        icon.classList.add("fa-moon")
      }
    })
  }

  // Mobile menu toggle
  const mobileMenuButton = document.querySelector(".mobile-menu-button")
  const mobileMenu = document.querySelector(".mobile-menu")

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("active")
      const icon = mobileMenuButton.querySelector("i")
      if (mobileMenu.classList.contains("active")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  }

  // User menu dropdown
  const userMenuButtons = document.querySelectorAll(".user-menu-button")
  userMenuButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation()
      const dropdown = this.nextElementSibling
      dropdown.classList.toggle("active")
    })
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", () => {
    const dropdowns = document.querySelectorAll(".dropdown-menu")
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("active")
    })
  })

  // Logout functionality
  const logoutButtons = document.querySelectorAll("#logout-button, #mobile-logout-button")
  logoutButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      localStorage.removeItem("currentUser")
      window.location.href = "index.html"
    })
  })

  // Update auth UI based on login status
  updateAuthUI()

  // Modal functionality
  setupModals()

  // Scroll animations
  setupScrollAnimations()

  // Counter animations
  setupCounters()

  // Testimonial slider
  setupTestimonialSlider()

  // Skill showcase
  setupSkillShowcase()

  // Floating skills animation
  setupFloatingSkills()
})

// Update UI based on authentication status
function updateAuthUI() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const loggedInButtons = document.querySelectorAll(".logged-in-buttons")
  const loggedOutButtons = document.querySelectorAll(".logged-out-buttons")
  const authOnlyElements = document.querySelectorAll(".auth-only")

  if (currentUser) {
    // User is logged in
    loggedInButtons.forEach((el) => (el.style.display = "flex"))
    loggedOutButtons.forEach((el) => (el.style.display = "none"))
    authOnlyElements.forEach((el) => (el.style.display = "block"))

    // Update username and avatar
    const usernameElements = document.querySelectorAll(".username")
    const avatarElements = document.querySelectorAll(".avatar")

    usernameElements.forEach((el) => {
      el.textContent = currentUser.name
    })

    avatarElements.forEach((el) => {
      el.textContent = currentUser.name.charAt(0)
      if (currentUser.avatarColor) {
        el.style.backgroundColor = currentUser.avatarColor
      }
    })
  } else {
    // User is logged out
    loggedInButtons.forEach((el) => (el.style.display = "none"))
    loggedOutButtons.forEach((el) => (el.style.display = "flex"))
    authOnlyElements.forEach((el) => (el.style.display = "none"))
  }
}

// Show toast notification
function showToast(title, message, type = "success") {
  const toast = document.getElementById("toast")
  const toastTitle = toast.querySelector(".toast-title")
  const toastDescription = toast.querySelector(".toast-description")
  const toastIcon = toast.querySelector(".toast-icon")

  toastTitle.textContent = title
  toastDescription.textContent = message

  // Set icon based on type
  if (type === "success") {
    toastIcon.className = "fas fa-check-circle toast-icon"
    toastIcon.style.color = "var(--success)"
  } else if (type === "error") {
    toastIcon.className = "fas fa-exclamation-circle toast-icon"
    toastIcon.style.color = "var(--danger)"
  } else if (type === "warning") {
    toastIcon.className = "fas fa-exclamation-triangle toast-icon"
    toastIcon.style.color = "var(--warning)"
  }

  toast.classList.add("active")

  // Hide toast after animation completes
  setTimeout(() => {
    toast.classList.remove("active")
  }, 3000)
}

// Setup modals
function setupModals() {
  const modals = document.querySelectorAll(".modal")
  const modalTriggers = document.querySelectorAll("[data-modal]")
  const modalCloseButtons = document.querySelectorAll(".modal-close, .modal-cancel")

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modalId = trigger.dataset.modal
      const modal = document.getElementById(modalId)
      if (modal) {
        modal.classList.add("active")
      }
    })
  })

  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal")
      if (modal) {
        modal.classList.remove("active")
      }
    })
  })

  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active")
      }
    })
  })
}

// Setup scroll animations
function setupScrollAnimations() {
  const scrollElements = document.querySelectorAll(".scroll-animate")

  const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top
    const elementHeight = el.getBoundingClientRect().height
    return (
      elementTop <= (window.innerHeight || document.documentElement.clientHeight) * (percentageScroll / 100) &&
      elementTop > -elementHeight
    )
  }

  const displayScrollElement = (element) => {
    element.classList.add("visible")
  }

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 80)) {
        displayScrollElement(el)
      }
    })
  }

  // Initial check
  handleScrollAnimation()

  // Add scroll event listener
  window.addEventListener("scroll", () => {
    handleScrollAnimation()
  })
}

// Setup counters
function setupCounters() {
  const counters = document.querySelectorAll(".counter")
  const speed = 200 // The lower the value, the faster the animation

  const updateCount = (counter) => {
    const target = +counter.getAttribute("data-target")
    const count = +counter.innerText
    const increment = target / speed

    if (count < target) {
      counter.innerText = Math.ceil(count + increment)
      setTimeout(() => updateCount(counter), 1)
    } else {
      counter.innerText = target
    }
  }

  // Check if element is in viewport
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  // Start counter when in viewport
  const startCountersWhenVisible = () => {
    counters.forEach((counter) => {
      if (isInViewport(counter) && !counter.classList.contains("counted")) {
        counter.classList.add("counted")
        updateCount(counter)
      }
    })
  }

  // Check on load and scroll
  window.addEventListener("load", startCountersWhenVisible)
  window.addEventListener("scroll", startCountersWhenVisible)
}

// Setup testimonial slider
function setupTestimonialSlider() {
  const slides = document.querySelectorAll(".testimonial-slide")
  const dots = document.querySelectorAll(".testimonial-dot")
  const prevBtn = document.querySelector(".testimonial-prev")
  const nextBtn = document.querySelector(".testimonial-next")

  if (!slides.length) return

  let currentSlide = 0
  const totalSlides = slides.length

  // Show slide
  const showSlide = (index) => {
    // Remove active class from all slides and dots
    slides.forEach((slide) => slide.classList.remove("active"))
    dots.forEach((dot) => dot.classList.remove("active"))

    // Add active class to current slide and dot
    slides[index].classList.add("active")
    dots[index].classList.add("active")
  }

  // Next slide
  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % totalSlides
    showSlide(currentSlide)
  }

  // Previous slide
  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
    showSlide(currentSlide)
  }

  // Event listeners
  if (prevBtn) prevBtn.addEventListener("click", prevSlide)
  if (nextBtn) nextBtn.addEventListener("click", nextSlide)

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index
      showSlide(currentSlide)
    })
  })

  // Auto slide
  let slideInterval = setInterval(nextSlide, 5000)

  // Pause on hover
  const slider = document.querySelector(".testimonial-slider")
  if (slider) {
    slider.addEventListener("mouseenter", () => {
      clearInterval(slideInterval)
    })

    slider.addEventListener("mouseleave", () => {
      slideInterval = setInterval(nextSlide, 5000)
    })
  }
}

// Setup skill showcase
function setupSkillShowcase() {
  const skillTags = document.querySelectorAll(".skill-tag")
  const skillCategories = document.querySelectorAll(".skill-category")
  const skillSearch = document.getElementById("skill-search")
  const addSampleSkillBtn = document.getElementById("add-sample-skill")

  if (!skillTags.length) return

  // Filter skills by category
  skillCategories.forEach((category) => {
    category.addEventListener("click", () => {
      // Remove active class from all categories
      skillCategories.forEach((cat) => cat.classList.remove("active"))
      // Add active class to clicked category
      category.classList.add("active")

      const selectedCategory = category.dataset.category

      // Show/hide skills based on category
      skillTags.forEach((tag) => {
        if (selectedCategory === "all" || tag.dataset.category === selectedCategory) {
          tag.classList.remove("hidden")
        } else {
          tag.classList.add("hidden")
        }
      })
    })
  })

  // Search skills
  if (skillSearch) {
    skillSearch.addEventListener("input", () => {
      const searchTerm = skillSearch.value.toLowerCase()

      skillTags.forEach((tag) => {
        const skillName = tag.textContent.toLowerCase()
        if (skillName.includes(searchTerm)) {
          tag.classList.remove("hidden")
          // Highlight matching skills
          if (searchTerm) {
            tag.classList.add("highlight")
          } else {
            tag.classList.remove("highlight")
          }
        } else {
          tag.classList.add("hidden")
          tag.classList.remove("highlight")
        }
      })
    })
  }

  // Add sample skill
  if (addSampleSkillBtn) {
    addSampleSkillBtn.addEventListener("click", () => {
      // Get all visible skills
      const visibleSkills = Array.from(skillTags).filter((tag) => !tag.classList.contains("hidden"))

      if (visibleSkills.length === 0) return

      // Select a random skill
      const randomSkill = visibleSkills[Math.floor(Math.random() * visibleSkills.length)]
      const skillName = randomSkill.textContent

      // Check if user is logged in
      const currentUser = JSON.parse(localStorage.getItem("currentUser"))

      if (currentUser) {
        // Randomly decide if it's a teaching or learning skill
        const isTeaching = Math.random() > 0.5
        const skillType = isTeaching ? "skillsToTeach" : "skillsToLearn"

        // Check if skill already exists
        if (currentUser[skillType].includes(skillName)) {
          showToast(
            "Skill exists",
            `You've already added ${skillName} to your ${isTeaching ? "teaching" : "learning"} skills.`,
            "warning",
          )
          return
        }

        // Add skill to user
        currentUser[skillType].push(skillName)

        // Update localStorage
        localStorage.setItem("currentUser", JSON.stringify(currentUser))

        // Update users array
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const updatedUsers = users.map((u) => (u.id === currentUser.id ? currentUser : u))
        localStorage.setItem("users", JSON.stringify(updatedUsers))

        // Show success message
        showToast("Skill added!", `${skillName} has been added to your ${isTeaching ? "teaching" : "learning"} skills.`)
      } else {
        // Redirect to signup
        showToast("Login required", "Please sign up or log in to add skills.", "warning")

        setTimeout(() => {
          window.location.href = "signup.html"
        }, 1500)
      }
    })
  }

  // Add click effect to skill tags
  skillTags.forEach((tag) => {
    tag.addEventListener("click", () => {
      tag.classList.add("pulse")
      setTimeout(() => {
        tag.classList.remove("pulse")
      }, 300)
    })
  })
}

// Setup floating skills animation
function setupFloatingSkills() {
  const floatingSkills = document.querySelectorAll(".floating-skill")

  if (!floatingSkills.length) return

  // Randomize positions
  floatingSkills.forEach((skill) => {
    const randomX = Math.floor(Math.random() * 70) + 10 // 10% to 80%
    const randomY = Math.floor(Math.random() * 60) + 10 // 10% to 70%

    skill.style.left = `${randomX}%`
    skill.style.top = `${randomY}%`
  })
}

// Tab functionality
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-button")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.dataset.tab

      // Remove active class from all buttons and panes
      document.querySelectorAll(".tab-button").forEach((btn) => {
        btn.classList.remove("active")
      })

      document.querySelectorAll(".tab-pane").forEach((pane) => {
        pane.classList.remove("active")
      })

      // Add active class to clicked button and corresponding pane
      button.classList.add("active")
      document.getElementById(`${tabId}-tab`).classList.add("active")
    })
  })
}
