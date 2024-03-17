document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector(".contact-form");
  const inputs = form.querySelectorAll(".input-field");
  const sendBtn = form.querySelector(".send-btn");

  sendBtn.addEventListener("click", function(event) {
      event.preventDefault();
      let isValid = true;

      inputs.forEach(input => {
          if (input.value.trim() === "") {
              isValid = false;
              showErrorMessage(input, "This field is required.");
          } else {
              hideErrorMessage(input);
          }
      });

      if (isValid) {
          alert("Message sent!");
          form.reset();
      }
  });

  function showErrorMessage(input, message) {
      const errorDiv = input.parentNode.querySelector(".error");
      errorDiv.textContent = message;
      errorDiv.style.color = "red"; 
  }

  function hideErrorMessage(input) {
      const errorDiv = input.parentNode.querySelector(".error");
      errorDiv.textContent = ""; 
  }
});