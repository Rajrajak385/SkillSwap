document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUserJson = localStorage.getItem("currentUser")
  if (!currentUserJson) {
    window.location.href = "login.html"
    return
  }

  const currentUser = JSON.parse(currentUserJson)

  // Initialize user profile with default values if they don't exist
  if (!currentUser.avatarColor) currentUser.avatarColor = "#e0f2fe"
  if (!currentUser.location) currentUser.location = ""
  if (!currentUser.bio) currentUser.bio = ""
  if (!currentUser.social) {
    currentUser.social = {
      linkedin: "",
      github: "",
      twitter: "",
    }
  }
  if (!currentUser.availability) currentUser.availability = "flexible"

  // Set user name and profile details
  document.getElementById("user-name").textContent = currentUser.name
  updateProfileDisplay()

  // Setup tabs
  setupTabs()

  // Load user skills
  loadUserSkills()

  // Load potential matches
  loadPotentialMatches()

  // Update stats
  updateStats()

  // Add skill event listeners
  document.getElementById("add-teach-skill").addEventListener("click", () => {
    addSkill("teach")
  })

  document.getElementById("add-learn-skill").addEventListener("click", () => {
    addSkill("learn")
  })

  // Add skill on Enter key
  document.getElementById("teach-skill-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill("teach")
    }
  })

  document.getElementById("learn-skill-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill("learn")
    }
  })

  // Edit profile modal
  const editProfileBtn = document.getElementById("edit-profile-btn")
  const editProfileModal = document.getElementById("edit-profile-modal")
  const saveProfileBtn = document.getElementById("save-profile")
  const modalCloseButtons = document.querySelectorAll(".modal-close, .modal-cancel")

  if (editProfileBtn && editProfileModal) {
    // Populate form with current user data
    document.getElementById("edit-name").value = currentUser.name
    document.getElementById("edit-email").value = currentUser.email
    document.getElementById("edit-location").value = currentUser.location || ""
    document.getElementById("edit-bio").value = currentUser.bio || ""
    document.getElementById("edit-linkedin").value = currentUser.social?.linkedin || ""
    document.getElementById("edit-github").value = currentUser.social?.github || ""
    document.getElementById("edit-twitter").value = currentUser.social?.twitter || ""
    document.getElementById("edit-availability").value = currentUser.availability || "flexible"

    // Set avatar preview
    updateAvatarPreview(currentUser.avatarColor || "#e0f2fe")

    // Set active avatar color
    const colorOptions = document.querySelectorAll(".avatar-color-option")
    colorOptions.forEach((option) => {
      if (option.dataset.color === currentUser.avatarColor) {
        option.classList.add("active")
      }

      option.addEventListener("click", function () {
        // Remove active class from all options
        colorOptions.forEach((opt) => opt.classList.remove("active"))
        // Add active class to clicked option
        this.classList.add("active")
        // Update avatar preview
        updateAvatarPreview(this.dataset.color)
      })
    })

    // Open modal on button click
    editProfileBtn.addEventListener("click", () => {
      editProfileModal.classList.add("active")
    })

    // Close modal on close button click
    modalCloseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        editProfileModal.classList.remove("active")
        document.getElementById("message-modal").classList.remove("active")
      })
    })

    // Save profile changes
    saveProfileBtn.addEventListener("click", () => {
      const name = document.getElementById("edit-name").value.trim()
      const email = document.getElementById("edit-email").value.trim()
      const location = document.getElementById("edit-location").value.trim()
      const bio = document.getElementById("edit-bio").value.trim()
      const linkedin = document.getElementById("edit-linkedin").value.trim()
      const github = document.getElementById("edit-github").value.trim()
      const twitter = document.getElementById("edit-twitter").value.trim()
      const availability = document.getElementById("edit-availability").value
      const avatarColor = document.querySelector(".avatar-color-option.active").dataset.color

      if (!name || !email) {
        showToast("Error", "Name and email are required", "error")
        return
      }

      // Update user data
      currentUser.name = name
      currentUser.email = email
      currentUser.location = location
      currentUser.bio = bio
      currentUser.social = {
        linkedin,
        github,
        twitter,
      }
      currentUser.availability = availability
      currentUser.avatarColor = avatarColor

      // Update localStorage
      localStorage.setItem("currentUser", JSON.stringify(currentUser))

      // Update users array
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u) => (u.id === currentUser.id ? currentUser : u))
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // Update UI
      updateProfileDisplay()
      updateAuthUI()

      // Close modal
      editProfileModal.classList.remove("active")

      // Show success message
      showToast("Profile updated", "Your profile has been updated successfully.")
    })
  }

  // Message modal
  const messageModal = document.getElementById("message-modal")
  const sendMessageBtn = document.getElementById("send-message")

  if (sendMessageBtn) {
    sendMessageBtn.addEventListener("click", () => {
      const messageText = document.getElementById("message-text").value.trim()
      const recipientName = document.getElementById("message-recipient").textContent

      if (!messageText) return

      // In a real app, this would send the message to a backend
      showToast("Message sent!", `Your message has been sent to ${recipientName}.`)

      // Clear message text and close modal
      document.getElementById("message-text").value = ""
      messageModal.classList.remove("active")
    })
  }

  // Update profile display
  function updateProfileDisplay() {
    // Update name
    document.getElementById("user-name").textContent = currentUser.name

    // Update avatar
    const profileAvatar = document.getElementById("profile-avatar")
    const headerAvatar = document.getElementById("header-avatar")

    if (profileAvatar) {
      profileAvatar.style.backgroundColor = currentUser.avatarColor || "#e0f2fe"
      profileAvatar.textContent = currentUser.name.charAt(0).toUpperCase()
    }

    if (headerAvatar) {
      headerAvatar.style.backgroundColor = currentUser.avatarColor || "#e0f2fe"
      headerAvatar.textContent = currentUser.name.charAt(0).toUpperCase()
    }

    // Update location
    const locationElement = document.getElementById("user-location")
    if (locationElement) {
      if (currentUser.location) {
        locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${currentUser.location}`
      } else {
        locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> No location set`
      }
    }

    // Update bio
    const bioElement = document.getElementById("user-bio-preview")
    if (bioElement) {
      if (currentUser.bio) {
        bioElement.textContent = currentUser.bio
      } else {
        bioElement.textContent = "No bio added yet"
      }
    }
  }

  // Update avatar preview
  function updateAvatarPreview(color) {
    const avatarPreview = document.getElementById("avatar-preview")
    if (avatarPreview) {
      avatarPreview.style.backgroundColor = color
      avatarPreview.textContent = currentUser.name.charAt(0).toUpperCase()
    }
  }

  // Update stats
  function updateStats() {
    document.getElementById("teaching-count").textContent = currentUser.skillsToTeach.length
    document.getElementById("learning-count").textContent = currentUser.skillsToLearn.length

    // Get all users
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")

    // Filter out current user
    const otherUsers = allUsers.filter((u) => u.id !== currentUser.id)

    // Find potential matches
    const potentialMatches = otherUsers.filter((otherUser) => {
      // Check if any of the current user's teaching skills match the other user's learning skills
      const teachingMatch = currentUser.skillsToTeach.some((skill) => otherUser.skillsToLearn.includes(skill))

      // Check if any of the current user's learning skills match the other user's teaching skills
      const learningMatch = currentUser.skillsToLearn.some((skill) => otherUser.skillsToTeach.includes(skill))

      // Return true if there's at least one match in either direction
      return teachingMatch || learningMatch
    })

    document.getElementById("matches-count").textContent = potentialMatches.length
  }

  // Add skill function
  function addSkill(type) {
    const inputId = `${type}-skill-input`
    const containerId = `${type}-skills-container`

    const skillInput = document.getElementById(inputId)
    const skillsContainer = document.getElementById(containerId)

    const skill = skillInput.value.trim()

    if (!skill) return

    // Check if skill already exists
    const skillProperty = type === "teach" ? "skillsToTeach" : "skillsToLearn"
    if (currentUser[skillProperty].includes(skill)) {
      showToast(
        "Skill exists",
        `You've already added ${skill} to your ${type === "teach" ? "teaching" : "learning"} skills.`,
        "warning",
      )
      return
    }

    // Add skill to user
    currentUser[skillProperty].push(skill)

    // Update localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUser))

    // Update users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? currentUser : u))
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Clear input
    skillInput.value = ""

    // Reload skills
    loadUserSkills()

    // Update stats
    updateStats()

    // Show success message
    showToast("Skill added!", `${skill} has been added to your ${type === "teach" ? "teaching" : "learning"} skills.`)

    // Reload matches
    loadPotentialMatches()
  }

  // Remove skill function
  function removeSkill(skill, type) {
    const skillProperty = type === "teach" ? "skillsToTeach" : "skillsToLearn"

    // Remove skill from user
    currentUser[skillProperty] = currentUser[skillProperty].filter((s) => s !== skill)

    // Update localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUser))

    // Update users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? currentUser : u))
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    // Reload skills
    loadUserSkills()

    // Update stats
    updateStats()

    // Show success message
    showToast(
      "Skill removed",
      `${skill} has been removed from your ${type === "teach" ? "teaching" : "learning"} skills.`,
    )

    // Reload matches
    loadPotentialMatches()
  }

  // Load user skills
  function loadUserSkills() {
    const teachContainer = document.getElementById("teach-skills-container")
    const learnContainer = document.getElementById("learn-skills-container")

    // Clear containers
    teachContainer.innerHTML = ""
    learnContainer.innerHTML = ""

    // Load teaching skills
    if (currentUser.skillsToTeach.length === 0) {
      teachContainer.innerHTML = '<p class="empty-skills-message">No teaching skills added yet</p>'
    } else {
      currentUser.skillsToTeach.forEach((skill) => {
        const skillTag = document.createElement("span")
        skillTag.className = "skill-tag teaching"
        skillTag.innerHTML = `
          ${skill}
          <button class="remove-skill" title="Remove skill">
            <i class="fas fa-times"></i>
          </button>
        `

        const removeBtn = skillTag.querySelector(".remove-skill")
        removeBtn.addEventListener("click", () => removeSkill(skill, "teach"))

        teachContainer.appendChild(skillTag)
      })
    }

    // Load learning skills
    if (currentUser.skillsToLearn.length === 0) {
      learnContainer.innerHTML = '<p class="empty-skills-message">No learning skills added yet</p>'
    } else {
      currentUser.skillsToLearn.forEach((skill) => {
        const skillTag = document.createElement("span")
        skillTag.className = "skill-tag learning"
        skillTag.innerHTML = `
          ${skill}
          <button class="remove-skill" title="Remove skill">
            <i class="fas fa-times"></i>
          </button>
        `

        const removeBtn = skillTag.querySelector(".remove-skill")
        removeBtn.addEventListener("click", () => removeSkill(skill, "learn"))

        learnContainer.appendChild(skillTag)
      })
    }
  }

  // Load potential matches
  function loadPotentialMatches() {
    const matchesContainer = document.getElementById("matches-container")

    // Get all users
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]")

    // Filter out current user
    const otherUsers = allUsers.filter((u) => u.id !== currentUser.id)

    // Find potential matches
    const potentialMatches = otherUsers.filter((otherUser) => {
      // Check if any of the current user's teaching skills match the other user's learning skills
      const teachingMatch = currentUser.skillsToTeach.some((skill) => otherUser.skillsToLearn.includes(skill))

      // Check if any of the current user's learning skills match the other user's teaching skills
      const learningMatch = currentUser.skillsToLearn.some((skill) => otherUser.skillsToTeach.includes(skill))

      // Return true if there's at least one match in either direction
      return teachingMatch || learningMatch
    })

    // Calculate match score and add matching skills
    const matchesWithScore = potentialMatches.map((otherUser) => {
      const teachingMatches = currentUser.skillsToTeach.filter((skill) => otherUser.skillsToLearn.includes(skill))

      const learningMatches = currentUser.skillsToLearn.filter((skill) => otherUser.skillsToTeach.includes(skill))

      const matchScore = teachingMatches.length + learningMatches.length

      return {
        ...otherUser,
        matchScore,
        teachingMatches,
        learningMatches,
      }
    })

    // Sort by match score (highest first)
    matchesWithScore.sort((a, b) => b.matchScore - a.matchScore)

    // Update matches count
    updateStats()

    // Render matches
    if (matchesWithScore.length === 0) {
      matchesContainer.innerHTML = `
        <div class="card">
          <div class="card-body text-center">
            <h3>No matches found</h3>
            <p>Add more skills or browse all users to find potential matches.</p>
            <a href="browse.html" class="btn btn-primary">Browse All Users</a>
          </div>
        </div>
      `
    } else {
      matchesContainer.innerHTML = `
        <h2>Your Potential Matches</h2>
        <div class="users-grid">
          ${matchesWithScore
            .map(
              (match) => `
              <div class="user-card">
                <div class="user-card-header">
                  <div>
                    <h3>${match.name}</h3>
                    <p class="match-score">Match score: ${match.matchScore}</p>
                    ${match.location ? `<p><i class="fas fa-map-marker-alt"></i> ${match.location}</p>` : ""}
                  </div>
                  <div class="user-avatar" style="background-color: ${match.avatarColor || "#e0f2fe"}">${match.name.charAt(0)}</div>
                </div>
                <div class="user-card-body">
                  ${
                    match.bio
                      ? `<p class="user-bio">${match.bio.length > 100 ? match.bio.substring(0, 100) + "..." : match.bio}</p>`
                      : ""
                  }
                  
                  ${
                    match.teachingMatches.length > 0
                      ? `
                      <div class="skill-section">
                        <h4>Skills you can teach them:</h4>
                        <div class="skill-tags">
                          ${match.teachingMatches
                            .map(
                              (skill) => `
                              <span class="skill-tag teaching">${skill}</span>
                            `,
                            )
                            .join("")}
                        </div>
                      </div>
                    `
                      : ""
                  }
                  
                  ${
                    match.learningMatches.length > 0
                      ? `
                      <div class="skill-section">
                        <h4>Skills they can teach you:</h4>
                        <div class="skill-tags">
                          ${match.learningMatches
                            .map(
                              (skill) => `
                              <span class="skill-tag learning">${skill}</span>
                            `,
                            )
                            .join("")}
                        </div>
                      </div>
                    `
                      : ""
                  }
                  
                  <div class="user-availability">
                    <p><i class="fas fa-clock"></i> ${getAvailabilityText(match.availability || "flexible")}</p>
                  </div>
                  
                  <button class="btn btn-primary btn-block contact-btn" data-user-id="${match.id}" data-user-name="${match.name}">
                    Contact
                  </button>
                </div>
              </div>
            `,
            )
            .join("")}
        </div>
      `

      // Add event listeners to contact buttons
      const contactButtons = document.querySelectorAll(".contact-btn")
      contactButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const userId = this.dataset.userId
          const userName = this.dataset.userName

          // Set recipient name in modal
          document.getElementById("message-recipient").textContent = userName

          // Open message modal
          document.getElementById("message-modal").classList.add("active")
        })
      })
    }
  }

  // Get availability text
  function getAvailabilityText(availability) {
    const availabilityMap = {
      flexible: "Available anytime",
      weekdays: "Available on weekdays",
      weekends: "Available on weekends",
      evenings: "Available in evenings",
      limited: "Limited availability",
    }

    return availabilityMap[availability] || "Available anytime"
  }

  // Setup tabs
  function setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-button")
    const tabPanes = document.querySelectorAll(".tab-pane")

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons and panes
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        tabPanes.forEach((pane) => pane.classList.remove("active"))

        // Add active class to clicked button
        button.classList.add("active")

        // Get tab ID and activate corresponding pane
        const tabId = button.dataset.tab
        document.getElementById(`${tabId}-tab`).classList.add("active")
      })
    })
  }

  // Show toast notification
  function showToast(title, message, type = "success") {
    const toast = document.getElementById("toast")
    const toastTitle = document.querySelector(".toast-title")
    const toastDescription = document.querySelector(".toast-description")
    const toastIcon = document.querySelector(".toast-icon")

    // Set toast content
    toastTitle.textContent = title
    toastDescription.textContent = message

    // Set toast icon based on type
    if (type === "success") {
      toastIcon.className = "fas fa-check-circle toast-icon"
      toastIcon.style.color = "var(--success)"
    } else if (type === "error") {
      toastIcon.className = "fas fa-times-circle toast-icon"
      toastIcon.style.color = "var(--danger)"
    } else if (type === "warning") {
      toastIcon.className = "fas fa-exclamation-circle toast-icon"
      toastIcon.style.color = "var(--warning)"
    }

    // Show toast
    toast.classList.add("active")

    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove("active")
    }, 3000)
  }

  // Update auth UI
  function updateAuthUI() {
    const username = document.querySelector(".username")
    const avatar = document.querySelector(".avatar")

    if (username && avatar) {
      username.textContent = currentUser.name
      avatar.textContent = currentUser.name.charAt(0).toUpperCase()
      avatar.style.backgroundColor = currentUser.avatarColor || "#e0f2fe"
    }
  }
})
