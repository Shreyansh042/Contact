// Get form elements
const form = document.getElementById("contact-form");
const name = document.getElementById("contact-form-name");
const email = document.getElementById("contact-form-email");
const message = document.getElementById("contact-form-message");
const submitButton = document.getElementById("contact-form-submit");

// Validate form input
function validateContactForm(form) {
  const nameValue = name.value.trim();
  const emailValue = email.value.trim();
  const messageValue = message.value.trim();

  if (nameValue === "" || emailValue === "" || messageValue === "") {
    return false;
  }

  if (!isValidEmail(emailValue)) {
    return false;
  }

  return true;
}

// Display error message
function displayError(form, message) {
  const errorDiv = document.createElement("div");
  errorDiv.classList.add("form-error");
  errorDiv.textContent = message;

  const container = form.parentElement;
  container.insertBefore(errorDiv, form.nextSibling);

  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

// Validate email address
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

// Handle form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateContactForm(form)) {
    event.preventDefault();
    displayError(form, "Please fill out all required fields and provide a valid email address.");
    return;
  }

  // Send form data to server
  const formData = new FormData(form);
  const mail = {
    from: formData.get("name") + " <" + formData.get("email") + ">",
    to: process.env.EMAIL,
    subject: formData.get("subject"),
    text: formData.get("message"),
  };

  sendMail(mail);
});

// Send form data to server
function sendMail(mail) {
  fetch("/send", {
    method: "post",
    body: mail,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        form.reset();
        hidePopupForm();
        displayError(form, "Your message has been sent. We will get back to you soon.", "success");
      } else {
        displayError(form, "Something went wrong. Please try again later.");
      }
    })
    .catch((error) => {
      displayError(form, "Something went wrong. Please try again later.");
    });
}

// Show/hide popup form
function showPopupForm() {
  document.getElementById("popup-form-container").style.display = "block";
}

function hidePopupForm() {
  document.getElementById("popup-form-container").style.display = "none";
}

// Add event listener to show popup form
document.getElementById("show-popup").addEventListener("click", showPopupForm);

// Add event listener to hide popup form on Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hidePopupForm();
  }
});