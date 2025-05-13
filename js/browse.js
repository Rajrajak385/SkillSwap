document.addEventListener("DOMContentLoaded", () => {
  // Get current user
  const currentUserJson = localStorage.getItem("currentUser")
  const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null

  // Get all users
  const allUsers = JSON.parse(localStorage.getItem("users") || "[]")

  // Filter out current user if logged in
  const users = currentUser ? allUsers.filter((u) => u.id !== currentUser.id) : allUsers

  // Get all unique skills
  const allSkills = Array.from(
    new Set(users.flatMap((user) => [...(user.skillsToTeach || []), ...(user.skillsToLearn || [])])),
  ).sort()

  // Populate skill filter dropdown
  const skillFilter = document.getElementById("skill-filter")
  allSkills.forEach((skill) => {
    const option = document.createElement("option")
    option.value = skill
    option.textContent = skill
    skillFilter.appendChild(option)
  })

  // Initial render
  renderUsers(users)

  // Search input
  const searchInput = document.getElementById("search-input")
  searchInput.addEventListener("input", filterUsers)

  // Skill filter
  skillFilter.addEventListener("change", filterUsers)

  // Skill type filter
  const skillTypeFilter = document.getElementById("skill-type-filter")
  skillTypeFilter.addEventListener("change", filterUsers)

  // Sort filter
  const sortFilter = document.getElementById("sort-filter")
  sortFilter.addEventListener("change", filterUsers)

  // Generate sample users button
  const generateSampleUsersBtn = document.getElementById("generate-sample-users")
  if (generateSampleUsersBtn) {
    generateSampleUsersBtn.addEventListener("click", generateSampleUsers)
  }

  // Find matches button
  const findMatchesBtn = document.getElementById("find-matches")
  if (findMatchesBtn && currentUser) {
    findMatchesBtn.addEventListener("click", () => {
      showMatchSummary()
      filterUsers(true) // true means show only matches
    })
  }

  // Filter users
  function filterUsers(showOnlyMatches = false) {
    const searchQuery = searchInput.value.trim().toLowerCase()
    const selectedSkill = skillFilter.value
    const skillType = skillTypeFilter.value
    const sortBy = sortFilter.value

    let filteredUsers = users

    // Filter by search query
    if (searchQuery) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery) ||
          (user.skillsToTeach || []).some((skill) => skill.toLowerCase().includes(searchQuery)) ||
          (user.skillsToLearn || []).some((skill) => skill.toLowerCase().includes(searchQuery)) ||
          (user.location || "").toLowerCase().includes(searchQuery),
      )
    }

    // Filter by selected skill
    if (selectedSkill) {
      if (skillType === "all") {
        filteredUsers = filteredUsers.filter(
          (user) =>
            (user.skillsToTeach || []).includes(selectedSkill) || (user.skillsToLearn || []).includes(selectedSkill),
        )
      } else if (skillType === "teach") {
        filteredUsers = filteredUsers.filter((user) => (user.skillsToTeach || []).includes(selectedSkill))
      } else {
        filteredUsers = filteredUsers.filter((user) => (user.skillsToLearn || []).includes(selectedSkill))
      }
    }

    // Filter by matches if requested and user is logged in
    if (showOnlyMatches && currentUser) {
      filteredUsers = filteredUsers.filter((user) => {
        // Check if any of the current user's teaching skills match the other user's learning skills
        const teachingMatch = (currentUser.skillsToTeach || []).some((skill) =>
          (user.skillsToLearn || []).includes(skill),
        )

        // Check if any of the current user's learning skills match the other user's teaching skills
        const learningMatch = (currentUser.skillsToLearn || []).some((skill) =>
          (user.skillsToTeach || []).includes(skill),
        )

        // Return true if there's at least one match in either direction
        return teachingMatch || learningMatch
      })
    }

    // Calculate match scores if user is logged in
    if (currentUser) {
      filteredUsers = filteredUsers.map((user) => {
        const teachingMatches = (currentUser.skillsToTeach || []).filter((skill) =>
          (user.skillsToLearn || []).includes(skill),
        )

        const learningMatches = (currentUser.skillsToLearn || []).filter((skill) =>
          (user.skillsToTeach || []).includes(skill),
        )

        const matchScore = teachingMatches.length + learningMatches.length

        return {
          ...user,
          matchScore,
          teachingMatches,
          learningMatches,
        }
      })
    }

    // Sort users
    switch (sortBy) {
      case "match":
        if (currentUser) {
          filteredUsers.sort((a, b) => b.matchScore - a.matchScore)
        }
        break
      case "name":
        filteredUsers.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // do nothing
        break
    }

    renderUsers(filteredUsers)
  }

  // Dummy render users function - replace with your actual rendering logic
  function renderUsers(users) {
    const usersContainer = document.getElementById("users-container")
    if (!usersContainer) return // Exit if the container doesn't exist

    usersContainer.innerHTML = "" // Clear existing content

    if (users.length === 0) {
      usersContainer.innerHTML = "<p>No users found.</p>"
      return
    }

    users.forEach((user) => {
      const userDiv = document.createElement("div")
      userDiv.classList.add("user")

      const skillsToTeachHtml = user.skillsToTeach
        ? user.skillsToTeach.map((skill) => `<span class="skill teach">${skill}</span>`).join("")
        : ""
      const skillsToLearnHtml = user.skillsToLearn
        ? user.skillsToLearn.map((skill) => `<span class="skill learn">${skill}</span>`).join("")
        : ""

      userDiv.innerHTML = `
                <h3>${user.name}</h3>
                <p>Location: ${user.location || "N/A"}</p>
                <p>Skills to Teach: ${skillsToTeachHtml || "None"}</p>
                <p>Skills to Learn: ${skillsToLearnHtml || "None"}</p>
                ${currentUser ? `<p>Match Score: ${user.matchScore || 0}</p>` : ""}
            `
      usersContainer.appendChild(userDiv)
    })
  }

  // Dummy generate sample users function - replace with your actual logic
  function generateSampleUsers() {
    alert("Generate Sample Users function called!")
  }

  // Dummy show match summary function - replace with your actual logic
  function showMatchSummary() {
    alert("Show Match Summary function called!")
  }
})
