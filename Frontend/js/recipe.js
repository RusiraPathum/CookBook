// Call loadRecipes function when the page is ready
$(document).ready(function () {
  loadRecipes();
});

function loadRecipes() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/api/recipe",
    success: function (response) {
      $("#recipeContainer").empty(); // Assuming you have a container with this ID to hold the cards

      var token = localStorage.getItem("token");
      var decodedToken = jwt_decode(token);
      var loggedInUserId = decodedToken.userId;

      response.recipes.forEach(function (recipe) {
        var card = $(`
          <div class="col-lg-4 col-md-6">
            <div class="card">
              <div class="el-card-item">
                <div class="el-card-avatar el-overlay-1">
                  <img src="${recipe.imageUrl}" alt="recipe" />
                  <div class="el-overlay">
                    <ul class="list-style-none el-info">
                      <li class="el-item">
                        <a class="btn default btn-outline image-popup-vertical-fit el-link" href="${
                          recipe.imageUrl
                        }">
                          <i class="mdi mdi-magnify-plus"></i>
                        </a>
                      </li>
                      
                    </ul>
                  </div>
                </div>
                <div class="el-card-content">
                  <h4 class="mb-0">${recipe.title}</h4>
                  <span class="text-muted">${recipe.ingredients}</span>
                  <div class="mt-3">
                  <button class="btn btn-success btn-sm text-white view-recipe" data-recipe-id="${
                    recipe._id
                  }">View</button>
                    ${
                      recipe.userId === loggedInUserId
                        ? `
                          <button class="btn btn-cyan btn-sm mr-1 text-white edit-recipe" data-recipe-id="${recipe._id}">Edit</button>
                          <button class="btn btn-danger btn-sm text-white delete-recipe" data-recipe-id="${recipe._id}">Delete</button>
                        `
                        : ""
                    }
                    ${
                      recipe.userId !== loggedInUserId
                        ? `
                        <button class="btn btn-info btn-sm text-white feedback-recipe" data-recipe-id="${recipe._id}">Feedback</button>
                        `
                        : ""
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        `);

        // Append the card to the container
        $("#recipeContainer").append(card);
      });
    },
    error: function (error) {
      console.error("Error:", error);
      alert("Failed to load recipes.");
    },
  });
}

$("#submit-recipe").click(function (event) {
  event.preventDefault();

  var form = document.querySelector("#recipe-form");

  //validation
  if (form.checkValidity() === false) {
    event.stopPropagation();
    form.classList.add("was-validated");
    return;
  }

  var imageFile = $("#image")[0].files[0];
  if (imageFile && !imageFile.type.match("image.*")) {
    $("#image").addClass("is-invalid");
    return;
  } else {
    $("#image").removeClass("is-invalid");
  }

  const formData = new FormData();
  formData.append("title", $("#title").val());
  formData.append("description", $("#description").val());
  formData.append("ingredients", $("#ingredients").val());
  formData.append("instructions", $("#instructions").val());
  formData.append("image", imageFile);

  $.ajax({
    type: "POST",
    url: "http://localhost:3000/api/recipe/create",
    data: formData,
    contentType: false,
    processData: false,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"), // Retrieve token from localStorage
    },
    success: function (response) {
      $("#recipeModal").modal("hide");

      Swal.fire({
        icon: "success",
        title: "Recipe added successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      loadRecipes();
    },
    error: function (error) {
      console.error("Error:", error);
      alert("Failed to add recipe.");
    },
  });
});

// Function to handle recipe deletion
function deleteRecipe(recipeId) {
  Swal.fire({
    title: "Are you sure?",
    text: "You are about to delete this recipe!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "DELETE",
        url: "http://localhost:3000/api/recipe/delete/" + recipeId,
        success: function (response) {
          $("#recipeRow_" + recipeId).remove();
          Swal.fire({
            icon: "success",
            title: "Recipe deleted successfully!",
            showConfirmButton: false,
            timer: 1500,
          });

          loadRecipes();
        },
        error: function (error) {
          console.error("Error:", error);
          Swal.fire({
            icon: "error",
            title: "Failed to delete recipe.",
            text: error.responseText,
          });
        },
      });
    }
  });
}

// Event handler for delete button click
$(document).on("click", ".delete-recipe", function () {
  var recipeId = $(this).data("recipe-id");
  deleteRecipe(recipeId);
});

// Handle click event for editing a recipe
$(document).on("click", ".edit-recipe", function () {
  var recipeId = $(this).attr("data-recipe-id");
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/api/recipe/" + recipeId,
    success: function (response) {
      $("#editTitle").val(response.recipe.title);
      $("#editDescription").val(response.recipe.description);
      $("#editIngredients").val(response.recipe.ingredients);
      $("#editInstructions").val(response.recipe.instructions);
      $("#editRecipeId").val(response.recipe._id);

      var currentImage = response.recipe.imageUrl;
      if (currentImage) {
        $("#editCurrentImage").attr("src", currentImage);
      } else {
        $("#editCurrentImage").attr("src", "");
      }

      // Show the modal
      $("#editRecipeModal").modal("show");
    },
    error: function (error) {
      console.error("Error:", error);
      alert("Failed to fetch recipe data.");
    },
  });
});

// Handle form submission for editing a recipe
$("#editRecipeForm").submit(function (event) {
  event.preventDefault();

  var form = document.querySelector("#editRecipeForm");

  //validation
  if (form.checkValidity() === false) {
    event.stopPropagation();
    form.classList.add("was-validated");
    return;
  }

  // var imageFile = $("#editImage")[0].files[0];
  // if (imageFile && !imageFile.type.match('image.*')) {
  //   $("#editImage").addClass("is-invalid");
  //   return;
  // } else {
  //   $("#editImage").removeClass("is-invalid");
  // }

  // Create FormData object to handle file uploads
  var formData = new FormData(this);
  var recipeId = $("#editRecipeId").val();

  $.ajax({
    type: "PUT",
    url: "http://localhost:3000/api/recipe/update/" + recipeId,
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      loadRecipes();
      // Close the modal
      $("#editRecipeModal").modal("hide");
      Swal.fire({
        icon: "success",
        title: "Recipe updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    error: function (error) {
      console.error("Error:", error);
      alert("Failed to update recipe.");
    },
  });
});

$(document).on("click", ".change-status", function () {
  var recipeId = $(this).data("recipe-id");

  Swal.fire({
    title: "Are you sure you want to change the status?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "PUT",
        url: "http://localhost:3000/api/recipe/update-status/" + recipeId,
        success: function (response) {
          // Reload the recipes after updating the status
          loadRecipes();
          Swal.fire("Status Changed!", "", "success");
        },
        error: function (error) {
          console.error("Error:", error);
          alert("Failed to change status.");
        },
      });
    }
  });
});

// Handle click event for viewing a single recipe
$(document).on("click", ".view-recipe", function () {
  var recipeId = $(this).attr("data-recipe-id");
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/api/recipe/" + recipeId,
    success: function (response) {
      $("#viewTitle").text(response.recipe.title);
      $("#viewDescription").text(response.recipe.description);
      $("#viewIngredients").text(response.recipe.ingredients);
      $("#viewInstructions").text(response.recipe.instructions);
      $("#viewImage").attr("src", response.recipe.imageUrl);
      $("#viewRecipeModal").modal("show");
    },
    error: function (error) {
      console.error("Error:", error);
      alert("Failed to fetch recipe data.");
    },
  });

  $.ajax({
    type: "GET",
    url: "http://localhost:3000/api/feedback/" + recipeId,
    success: function (response) {
      console.log("Feedbacks:", response);
      var feedbackContainer = $("#viewFeedbacks");
      feedbackContainer.empty(); // Clear previous feedbacks

      if (response.length === 0) {
        feedbackContainer.append(
          "<p>No feedbacks available for this recipe.</p>"
        );
      } else {
        response.forEach(function (feedback) {
          var feedbackElement = `
          <div class="d-flex flex-row comment-row p-3 mt-3" style="background-color: #f8f9fa; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <div class="comment-text row w-100">
              <div class="col-3 d-flex align-items-center">
                <h6 class="font-medium mb-0">${feedback.userId.name}</h6>
              </div>
              <div class="col-9">
                <span class="mb-3 d-block">${feedback.comment}</span>
              </div>
            </div>
          </div>
          <hr class="my-2" style="border: none; border-top: 1px solid #e9ecef;">
        `;
          feedbackContainer.append(feedbackElement);
        });
      }
    },
    error: function (error) {
      console.error("Error:", error);
      // alert("Failed to fetch recipe data.");
    },
  });
});

$(document).on("click", ".feedback-recipe", function () {
  var recipeId = $(this).attr("data-recipe-id");
  // console.log(recipeId);
  $("#recipeId").val(recipeId);
  $("#feedbackRecipeModal").modal("show");
});

$("#submit-feedback").click(function (event) {
  event.preventDefault();

  var form = document.querySelector("#feedback-form");

  $.ajax({
    type: "POST",
    url: "http://localhost:3000/api/feedback/create",
    data: JSON.stringify({
      comment: $("#comment").val(),
      recipeId: $("#recipeId").val(),
    }),
    contentType: "application/json; charset=utf-8",
    processData: false,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      //$("#feedbackModal").modal("hide");

      Swal.fire({
        icon: "success",
        title: "Feedback added successfully!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        // Reset the feedback form
        form.reset();
        // Hide the feedback modal
        $("#feedbackRecipeModal").modal("hide");
      });

      // loadFeedback();
    },
    error: function (error) {
      console.error("Error:", error);
      alert("Failed to add feedback.");
    },
  });
});
