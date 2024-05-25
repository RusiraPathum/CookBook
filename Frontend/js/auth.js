// Function to handle login form submission
async function handleLoginForm(event) {
  event.preventDefault();

  const email = $("#email").val();
  const password = $("#password").val();

  try {
    const response = await $.ajax({
      type: "POST",
      url: "http://localhost:3000/api/auth/login",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", response.token);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.responseJSON.message);
  }
}

// Function to handle registration form submission
async function handleRegistrationForm(event) {
  event.preventDefault();

  // Disable the submit button to prevent multiple submissions
  $("#registrationForm button[type='submit']").prop("disabled", true);

  // var imageFile = $("#profilePicture")[0].files[0];

  const formData = new FormData();
  formData.append("name", $("#name").val());
  formData.append("password", $("#password").val());
  formData.append("email", $("#email").val());
  // formData.append("image", imageFile);

  try {
    const response = await $.ajax({
      type: "POST",
      url: "http://localhost:3000/api/auth/register",
      contentType: false,
      processData: false,
      data: formData,
    });

    // Enable the submit button
    $("#registrationForm button[type='submit']").prop("disabled", false);

    alert("User Registration Successful!");
    // Redirect to login page after successful registration
    window.location.href = "login.html";
  } catch (error) {
    // Enable the submit button
    $("#registrationForm button[type='submit']").prop("disabled", false);

    console.error("Error:", error);
    alert("Registration failed. Please try again.");
    // Optionally, you can choose not to navigate to the login page here
    // window.location.href = "login.html";
  }
}


$(document).ready(function () {
  $("#loginForm").submit(handleLoginForm);
  $("#registrationForm").submit(handleRegistrationForm);
});
