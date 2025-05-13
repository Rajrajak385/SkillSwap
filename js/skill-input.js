document.addEventListener("DOMContentLoaded", () => {
  // Common skills for autocomplete suggestions
  const COMMON_SKILLS = [
    "Web Development",
    "JavaScript",
    "React",
    "Python",
    "Graphic Design",
    "Photography",
    "Cooking",
    "Baking",
    "Spanish",
    "French",
    "Guitar",
    "Piano",
    "Yoga",
    "Meditation",
    "Digital Marketing",
    "SEO",
    "Content Writing",
    "Video Editing",
    "Public Speaking",
    "Data Analysis",
    "Machine Learning",
    "Painting",
    "Drawing",
    "Singing",
    "Dancing",
    "Fitness Training",
    "Nutrition",
    "Gardening",
    "Woodworking",
    "Knitting",
    "Sewing",
    "3D Modeling",
    "Game Development",
    "UI/UX Design",
    "Mobile App Development",
    "Blockchain",
    "Cryptocurrency",
    "Financial Planning",
    "Investing",
    "Accounting",
    "Project Management",
    "Leadership",
    "Time Management",
    "Negotiation",
    "Sales",
    "Customer Service",
  ]

  // Setup skill inputs with autocomplete
  setupSkillInput("teach-skill-input", "teach-skill-suggestions")
  setupSkillInput("learn-skill-input", "learn-skill-suggestions")

  function setupSkillInput(inputId, suggestionsId) {
    const input = document.getElementById(inputId)
    const suggestionsContainer = document.getElementById(suggestionsId)

    if (!input || !suggestionsContainer) return

    let activeSuggestionIndex = -1

    // Input event for filtering suggestions
    input.addEventListener("input", function () {
      const value = this.value.trim().toLowerCase()

      if (value) {
        // Filter suggestions based on input
        const filteredSkills = COMMON_SKILLS.filter((skill) => skill.toLowerCase().includes(value)).slice(0, 5) // Limit to 5 suggestions

        // Render suggestions
        renderSuggestions(filteredSkills)

        if (filteredSkills.length > 0) {
          suggestionsContainer.classList.add("active")
        } else {
          suggestionsContainer.classList.remove("active")
        }
      } else {
        suggestionsContainer.innerHTML = ""
        suggestionsContainer.classList.remove("active")
      }

      activeSuggestionIndex = -1
    })

    // Focus event to show suggestions
    input.addEventListener("focus", function () {
      const value = this.value.trim().toLowerCase()
      if (value) {
        const filteredSkills = COMMON_SKILLS.filter((skill) => skill.toLowerCase().includes(value)).slice(0, 5)

        if (filteredSkills.length > 0) {
          renderSuggestions(filteredSkills)
          suggestionsContainer.classList.add("active")
        }
      }
    })

    // Keyboard navigation for suggestions
    input.addEventListener("keydown", (e) => {
      const suggestions = suggestionsContainer.querySelectorAll(".suggestion-item")

      if (suggestions.length === 0) return

      // Arrow down
      if (e.key === "ArrowDown") {
        e.preventDefault()
        activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, suggestions.length - 1)
        updateActiveSuggestion(suggestions)
      }
      // Arrow up
      else if (e.key === "ArrowUp") {
        e.preventDefault()
        activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, 0)
        updateActiveSuggestion(suggestions)
      }
      // Enter key
      else if (e.key === "Enter") {
        e.preventDefault()
        if (activeSuggestionIndex >= 0) {
          input.value = suggestions[activeSuggestionIndex].textContent
          suggestionsContainer.classList.remove("active")
        }
      }
      // Escape key
      else if (e.key === "Escape") {
        suggestionsContainer.classList.remove("active")
      }
    })

    // Click outside to close suggestions
    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.classList.remove("active")
      }
    })

    // Render suggestions
    function renderSuggestions(skills) {
      suggestionsContainer.innerHTML = ""

      skills.forEach((skill) => {
        const item = document.createElement("div")
        item.className = "suggestion-item"
        item.textContent = skill

        item.addEventListener("click", () => {
          input.value = skill
          suggestionsContainer.classList.remove("active")
        })

        suggestionsContainer.appendChild(item)
      })
    }

    // Update active suggestion
    function updateActiveSuggestion(suggestions) {
      suggestions.forEach((item, index) => {
        if (index === activeSuggestionIndex) {
          item.classList.add("active")
        } else {
          item.classList.remove("active")
        }
      })
    }
  }
})
