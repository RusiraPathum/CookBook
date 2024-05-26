document.addEventListener("DOMContentLoaded", function() {
    // Logout functionality
    const logoutLink = document.getElementById('logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }

    // Set the src attribute of the image
    const profilePicture = document.getElementById('userImage')
    if(profilePicture){
        $.ajax({
            url: "http://localhost:3000/api/user/profile",
            type: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token") // Retrieve token from localStorage
            },
            success: function(response) {
            
                if (response.profilePicture) {
                    
                    var imagePath = response.profilePicture.replace(/\\/g, "/");
                    console.log("../.." + imagePath);
                    profilePicture.src = "../.." + imagePath;
                }
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error("Error fetching user profile:", error);
            }
        });
    }
    //.src = newImageUrl;

    // Get a reference to the My Profile link
    var profileLink = document.getElementById("myProfileLink");
    
    // Get a reference to the profile modal
    var profileModal = document.getElementById("profileModal");

    // Flag to check if the user wants to change the password
    var changePasswordClicked = false;

    // Attach a click event listener to the My Profile link
    profileLink.addEventListener("click", function() {
        // Show the profile modal
        $(profileModal).modal("show");

        console.log("token", localStorage.getItem("token"));
        
        // Fetch user profile details via AJAX
        $.ajax({
            url: "http://localhost:3000/api/user/profile",
            type: "GET",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token") // Retrieve token from localStorage
            },
            success: function(response) {
                // Populate form fields with profile details
                document.getElementById("name").value = response.name;
                document.getElementById("email").value = response.email;
                //document.getElementById("password").value = response.password;

                // Replace the src attribute of the profile picture with the backend response
            var profilePictureElement = document.getElementById("current-profile-picture");
            if (response.profilePicture) {
                // Remove double backslashes and prepend "../../" to the path
                var imagePath = response.profilePicture.replace(/\\/g, "/");
                console.log("../.." + imagePath);
                profilePictureElement.src = "../.." + imagePath;
            }
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error("Error fetching user profile:", error);
            }
        });
    });

    // Attach a submit event listener to the profile form
    var profileForm = document.getElementById("profile-form");
    profileForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the form from submitting the default way

        // Create a FormData object to handle the file upload
        // var formData = new FormData(profileForm);

        const formData = new FormData();
        formData.append("name", $("#name").val());
        formData.append("email", $("#email").val());

        var imageFile = $("#profile-picture")[0].files[0];
        if(imageFile)
            formData.append("image", imageFile);

        if (changePasswordClicked) {
            // If change password link is clicked, add new password to the form data
            formData.append("password", $("#new-password").val());
        }
        
        //formData.append("image", imageFile);
        
        formData.forEach((value, key) => {
            console.log(key, value);
        });

        // Make an AJAX call to update the user profile
        $.ajax({
            url: "http://localhost:3000/api/user/profile",
            type: "PUT",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token") // Retrieve token from localStorage
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                // Handle success
                alert("Profile updated successfully:", response);
                $(profileModal).modal("hide");
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error("Error updating profile:", error);
            }
        });
    });


     // Attach a click event listener to the Change Password link
     var changePasswordLink = document.getElementById("change-password-link");
     changePasswordLink.addEventListener("click", function(event) {
         event.preventDefault();
         document.getElementById("change-password-fields").classList.remove("d-none");
         // Set the flag to true indicating user wants to change password
         changePasswordClicked = true;
     });
});
