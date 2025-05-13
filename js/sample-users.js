// Sample users generator
document.addEventListener("DOMContentLoaded", () => {
  // Check if we already have users
  const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

  // Only generate sample users if there are none or very few
  if (existingUsers.length < 3) {
    generateSampleUsers()
  }

  // Add button to generate sample users
  const browseContainer = document.querySelector(".browse-container")
  if (browseContainer) {
    const generateButton = document.createElement("button")
    generateButton.className = "btn btn-outline"
    generateButton.innerHTML = '<i class="fas fa-users"></i> Generate Sample Users'
    generateButton.style.marginBottom = "1rem"

    generateButton.addEventListener("click", () => {
      generateSampleUsers()
      // Reload the page to show new users
      window.location.reload()
    })

    // Insert button after the h1
    const heading = browseContainer.querySelector("h1")
    if (heading) {
      heading.insertAdjacentElement("afterend", generateButton)
    }
  }
})

function generateSampleUsers() {
  // Sample data
  const names = [
    "Emma Johnson",
    "Liam Smith",
    "Olivia Williams",
    "Noah Brown",
    "Ava Jones",
    "Sophia Miller",
    "Jackson Davis",
    "Isabella Wilson",
    "Lucas Moore",
    "Mia Taylor",
    "Aiden Anderson",
    "Charlotte Thomas",
    "Ethan Jackson",
    "Amelia White",
    "Mason Harris",
  ]

  const avatarColors = [
    "#e0f2fe",
    "#d1fae5",
    "#fee2e2",
    "#fef3c7",
    "#e0e7ff",
    "#f5f3ff",
    "#fce7f3",
    "#ede9fe",
    "#dbeafe",
    "#ccfbf1",
    "#ecfccb",
    "#fef9c3",
    "#ffedd5",
    "#fee2e2",
    "#f3e8ff",
  ]

  const locations = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
    "Phoenix, AZ",
    "Philadelphia, PA",
    "San Antonio, TX",
    "San Diego, CA",
    "Dallas, TX",
    "San Jose, CA",
    "Austin, TX",
    "Jacksonville, FL",
    "Fort Worth, TX",
    "Columbus, OH",
    "Charlotte, NC",
  ]

  const bios = [
    "Passionate about learning new skills and sharing knowledge with others.",
    "Always looking to expand my horizons and connect with like-minded individuals.",
    "Lifelong learner with a diverse set of skills and interests.",
    "Excited to teach what I know and learn from others in the community.",
    "Believe in the power of knowledge exchange to build a better world.",
    "Love to collaborate and grow through mutual learning experiences.",
    "Dedicated to continuous improvement through skill swapping.",
    "Enthusiastic about connecting with others who share my passion for learning.",
    "Looking to build meaningful connections through knowledge sharing.",
    "Firm believer that teaching is the best way to master a skill.",
    "Eager to expand my skill set while helping others grow.",
    "Committed to personal growth through collaborative learning.",
    "Excited to be part of a community that values knowledge exchange.",
    "Passionate about both teaching and learning from others.",
    "Always seeking new opportunities to learn and share knowledge.",
  ]

  const teachingSkills = [
    ["JavaScript", "React", "Web Development"],
    ["Python", "Data Science", "Machine Learning"],
    ["Graphic Design", "Adobe Photoshop", "UI/UX Design"],
    ["Photography", "Adobe Lightroom", "Composition"],
    ["Spanish", "French", "Language Learning"],
    ["Guitar", "Music Theory", "Songwriting"],
    ["Cooking", "Baking", "Nutrition"],
    ["Yoga", "Meditation", "Fitness"],
    ["Digital Marketing", "SEO", "Content Writing"],
    ["Public Speaking", "Leadership", "Communication"],
    ["Woodworking", "DIY", "Crafts"],
    ["Drawing", "Painting", "Illustration"],
    ["Video Editing", "Filmmaking", "Storytelling"],
    ["Financial Planning", "Investing", "Budgeting"],
    ["Mobile App Development", "Swift", "Flutter"],
  ]

  const learningSkills = [
    ["Python", "Data Science", "Machine Learning"],
    ["JavaScript", "React", "Web Development"],
    ["Photography", "Adobe Lightroom", "Composition"],
    ["Graphic Design", "Adobe Photoshop", "UI/UX Design"],
    ["Guitar", "Music Theory", "Songwriting"],
    ["Spanish", "French", "Language Learning"],
    ["Yoga", "Meditation", "Fitness"],
    ["Cooking", "Baking", "Nutrition"],
    ["Public Speaking", "Leadership", "Communication"],
    ["Digital Marketing", "SEO", "Content Writing"],
    ["Drawing", "Painting", "Illustration"],
    ["Woodworking", "DIY", "Crafts"],
    ["Financial Planning", "Investing", "Budgeting"],
    ["Video Editing", "Filmmaking", "Storytelling"],
    ["Mobile App Development", "Swift", "Flutter"],
  ]

  const availabilities = ["flexible", "weekdays", "weekends", "evenings", "limited"]

  // Generate users
  const sampleUsers = []

  for (let i = 0; i < names.length; i++) {
    const user = {
      id: `sample-${Date.now()}-${i}`,
      name: names[i],
      email: names[i].toLowerCase().replace(" ", ".") + "@example.com",
      password: "password123", // In a real app, this would be hashed
      skillsToTeach: teachingSkills[i],
      skillsToLearn: learningSkills[i],
      avatarColor: avatarColors[i],
      location: locations[i],
      bio: bios[i],
      availability: availabilities[i % availabilities.length],
      social: {
        linkedin: "",
        github: "",
        twitter: "",
      },
      createdAt: new Date().toISOString(),
    }

    sampleUsers.push(user)
  }

  // Add to existing users
  const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")
  const updatedUsers = [...existingUsers, ...sampleUsers]

  // Save to localStorage
  localStorage.setItem("users", JSON.stringify(updatedUsers))

  console.log(`Generated ${sampleUsers.length} sample users`)
}
