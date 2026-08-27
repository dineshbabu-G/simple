/* =========================================================
   STUDENT ACTIVITY HUB — SCRIPT
   Beginner-friendly, commented JavaScript.
   Handles: mobile menu, smooth scrolling, the "Add Activity"
   form (with validation), and the contact form (with validation).
   ========================================================= */

// Run our code only after the whole page has loaded
document.addEventListener("DOMContentLoaded", function () {

  /* -------------------------------------------------------
     1. MOBILE NAVIGATION MENU
     Toggles the nav links open/closed on small screens.
     ------------------------------------------------------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  menuToggle.addEventListener("click", function () {
    menuToggle.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  // Close the mobile menu whenever a nav link is clicked
  const allNavLinks = document.querySelectorAll(".nav-link");
  allNavLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      menuToggle.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });

  /* -------------------------------------------------------
     2. SMOOTH SCROLLING FOR NAVIGATION LINKS
     Intercepts clicks on any link that points to an on-page
     section (href starts with "#") and scrolls there smoothly.
     ------------------------------------------------------- */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        event.preventDefault(); // stop the instant browser jump
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* -------------------------------------------------------
     3. ADD ACTIVITY FEATURE
     Shows/hides the form, validates input, and appends a new
     activity card to the page without reloading.
     ------------------------------------------------------- */
  const addActivityBtn = document.getElementById("addActivityBtn");
  const cancelActivityBtn = document.getElementById("cancelActivityBtn");
  const activityForm = document.getElementById("activityForm");
  const activitySuccess = document.getElementById("activitySuccess");
  const activityList = document.getElementById("activityList");

  // Show the form when "+ Add Activity" is clicked
  addActivityBtn.addEventListener("click", function () {
    activityForm.classList.remove("hidden");
    activitySuccess.classList.add("hidden");
    addActivityBtn.classList.add("hidden");
  });

  // Hide the form again if the user clicks "Cancel"
  cancelActivityBtn.addEventListener("click", function () {
    activityForm.reset();
    clearErrors(activityForm);
    activityForm.classList.add("hidden");
    addActivityBtn.classList.remove("hidden");
  });

  activityForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from refreshing

    // Grab the field values
    const nameInput = document.getElementById("studentName");
    const activityInput = document.getElementById("activityName");
    const categoryInput = document.getElementById("activityCategory");

    const studentName = nameInput.value.trim();
    const activityName = activityInput.value.trim();
    const activityCategory = categoryInput.value;

    let isValid = true;

    // Validate: student name must not be empty
    if (studentName === "") {
      showError(nameInput, "studentNameError", "Please enter the student's name.");
      isValid = false;
    } else {
      clearError(nameInput, "studentNameError");
    }

    // Validate: activity name must not be empty
    if (activityName === "") {
      showError(activityInput, "activityNameError", "Please enter an activity name.");
      isValid = false;
    } else {
      clearError(activityInput, "activityNameError");
    }

    // Validate: a category must be selected
    if (activityCategory === "") {
      showError(categoryInput, "activityCategoryError", "Please choose a category.");
      isValid = false;
    } else {
      clearError(categoryInput, "activityCategoryError");
    }

    // Stop here if any field failed validation
    if (!isValid) {
      return;
    }

    // All good — add the new activity card to the page
    addActivityCard(studentName, activityName, activityCategory);

    // Reset and hide the form, show a success message
    activityForm.reset();
    activityForm.classList.add("hidden");
    addActivityBtn.classList.remove("hidden");
    activitySuccess.classList.remove("hidden");

    // Hide the success message automatically after a few seconds
    setTimeout(function () {
      activitySuccess.classList.add("hidden");
    }, 4000);
  });

  // Builds and inserts a new activity card into the activity list
  function addActivityCard(studentName, activityName, category) {
    const card = document.createElement("div");
    card.className = "activity-item";

    card.innerHTML =
      '<span class="activity-category">' + category + '</span>' +
      '<h4>' + activityName + '</h4>' +
      '<p>Logged by ' + studentName + '</p>';

    // Newest activity appears first
    activityList.prepend(card);
  }

  /* -------------------------------------------------------
     4. CONTACT FORM
     Validates name, email, and message before "sending".
     ------------------------------------------------------- */
  const contactForm = document.getElementById("contactForm");
  const contactSuccess = document.getElementById("contactSuccess");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const messageInput = document.getElementById("contactMessage");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    let isValid = true;

    if (name === "") {
      showError(nameInput, "contactNameError", "Please enter your name.");
      isValid = false;
    } else {
      clearError(nameInput, "contactNameError");
    }

    if (!isValidEmail(email)) {
      showError(emailInput, "contactEmailError", "Please enter a valid email address.");
      isValid = false;
    } else {
      clearError(emailInput, "contactEmailError");
    }

    if (message === "") {
      showError(messageInput, "contactMessageError", "Please write a short message.");
      isValid = false;
    } else {
      clearError(messageInput, "contactMessageError");
    }

    if (!isValid) {
      return;
    }

    // In a real project this is where you'd send data to a server.
    // Here we just show a success message, since this is a static site.
fetch("YOUR_RENDER_BACKEND_URL/api/contact", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: name,
    email: email,
    message: message
  })
})
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      contactForm.reset();
      contactSuccess.classList.remove("hidden");

      setTimeout(function () {
        contactSuccess.classList.add("hidden");
      }, 4000);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Could not connect to the server.");
  });

    setTimeout(function () {
      contactSuccess.classList.add("hidden");
    }, 4000);
  });

  // Simple email format check (good enough for client-side validation)
  function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  /* -------------------------------------------------------
     SHARED HELPER FUNCTIONS for showing/clearing form errors
     ------------------------------------------------------- */
  function showError(inputEl, errorId, message) {
    inputEl.classList.add("invalid");
    document.getElementById(errorId).textContent = message;
  }

  function clearError(inputEl, errorId) {
    inputEl.classList.remove("invalid");
    document.getElementById(errorId).textContent = "";
  }

  // Clears every error message inside a given form (used on Cancel)
  function clearErrors(formEl) {
    const invalidFields = formEl.querySelectorAll(".invalid");
    invalidFields.forEach(function (field) {
      field.classList.remove("invalid");
    });

    const errorMessages = formEl.querySelectorAll(".error-message");
    errorMessages.forEach(function (span) {
      span.textContent = "";
    });
  }

});
