// Call loadRecipes function when the page is ready
$(document).ready(function () {
  loadRecipes();
});

// Function to load recipes
function loadRecipes() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/api/recipe",
    success: function (response) {
      $("#recipeTable tbody").empty();

      response.recipes.forEach(function (recipe) {
        var row = $("<tr>");

        $("<td>").text(recipe.title).appendTo(row);
        $("<td>").text(recipe.ingredients).appendTo(row);

        var statusCell = $("<td>");
        if (recipe.status) {
          statusCell.text("Active").addClass("text-success");
        } else {
          statusCell.text("Inactive").addClass("text-danger");
        }
        statusCell.appendTo(row);

        var imageCell = $("<td>");
        $("<img>")
          .attr("src", recipe.imageUrl)
          .addClass("recipe-image")
          .appendTo(imageCell);
        imageCell.appendTo(row);

        var actions = $("<td>").addClass("action-buttons");

        var viewButton = $("<button>")
          .addClass("btn btn-info btn-sm mr-1 text-white view-recipe")
          .text("View");
        viewButton.attr("data-recipe-id", recipe._id);
        viewButton.appendTo(actions);

        var changeStatusButton = $("<button>")
          .addClass("btn btn-success btn-sm mr-1 text-white change-status")
          .text("Change Status");
        changeStatusButton.attr("data-recipe-id", recipe._id);
        changeStatusButton.appendTo(actions);

        var editButton = $("<button>")
          .addClass("btn btn-cyan btn-sm mr-1 text-white edit-recipe")
          .text("Edit");
        editButton.attr("data-recipe-id", recipe._id);
        editButton.appendTo(actions);

        var deleteButton = $("<button>")
          .addClass("btn btn-danger btn-sm text-white delete-recipe")
          .text("Delete");
        deleteButton.attr("data-recipe-id", recipe._id);
        deleteButton.appendTo(actions);

        actions.appendTo(row);

        row.appendTo("#recipeTable tbody");
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

  var form = document.querySelector('#editRecipeForm');

  //validation
  if (form.checkValidity() === false) {
    event.stopPropagation();
    form.classList.add('was-validated');
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
});
