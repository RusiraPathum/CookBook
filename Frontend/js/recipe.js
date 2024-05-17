// Call loadRecipes function when the page is ready
$(document).ready(function () {
  loadRecipes();
});

// Function to load recipes
function loadRecipes() {
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/api/recipe", // Endpoint to fetch recipes
      success: function (response) {
        // Clear existing table rows
        $("#recipeTable tbody").empty();
  
        // Loop through the retrieved recipes and populate the table
        response.recipes.forEach(function (recipe) {
          // Create a new table row
          var row = $("<tr>");
  
          // Populate the table cells with recipe data
          $("<td>").text(recipe.title).appendTo(row);
          $("<td>").text(recipe.description).appendTo(row);
          $("<td>").text(recipe.ingredients).appendTo(row);
          $("<td>").text(recipe.instructions).appendTo(row);
          
          // Add the status column with appropriate styling
          var statusCell = $("<td>");
          if (recipe.status) {
            statusCell.text("Active").addClass("text-success");
          } else {
            statusCell.text("Inactive").addClass("text-danger");
          }
          statusCell.appendTo(row);
  
          // Add the recipe image to the table cell
          var imageCell = $("<td>");
          $("<img>")
            .attr("src", recipe.imageUrl)
            .addClass("recipe-image")
            .appendTo(imageCell);
          imageCell.appendTo(row);
  
          // Create action buttons (Edit, Change Status, Delete)
          var actions = $("<td>").addClass("action-buttons"); // Add a class for styling
          
          // Create the change status button with the appropriate data attribute
          var changeStatusButton = $("<button>")
            .addClass("btn btn-success btn-sm mr-1 text-white change-status")
            .text("Change Status");
  
          // Check if recipe._id exists and is not undefined before setting data attribute
          if (recipe._id) {
            changeStatusButton.attr("data-recipe-id", recipe._id); // Add recipe ID as data attribute
          }
  
          changeStatusButton.appendTo(actions); // Append change status button to actions
  
          // Create the edit button with the appropriate data attribute
          var editButton = $("<button>")
            .addClass("btn btn-cyan btn-sm mr-1 text-white edit-recipe")
            .text("Edit");
  
          // Check if recipe._id exists and is not undefined before setting data attribute
          if (recipe._id) {
            editButton.attr("data-recipe-id", recipe._id); // Add recipe ID as data attribute
          }
  
          editButton.appendTo(actions); // Append edit button to actions
  
          // Create the delete button with the appropriate data attribute
          var deleteButton = $("<button>")
            .addClass("btn btn-danger btn-sm text-white delete-recipe")
            .text("Delete");
  
          // Check if recipe._id exists and is not undefined before setting data attribute
          if (recipe._id) {
            deleteButton.attr("data-recipe-id", recipe._id); // Add recipe ID as data attribute
          }
  
          deleteButton.appendTo(actions); // Append delete button to actions
  
          // Append the action buttons to the table row
          actions.appendTo(row);
  
          // Append the row to the table body
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
  // Prevent the default form submission behavior
  event.preventDefault();

  const formData = new FormData();
  formData.append("title", $("#title").val());
  formData.append("description", $("#description").val());
  formData.append("ingredients", $("#ingredients").val());
  formData.append("instructions", $("#instructions").val());
  formData.append("image", $("#image")[0].files[0]);

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

      // Optionally, you can reload the recipe list here
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
  // Display a confirmation dialog
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
    // If user confirms deletion, proceed with the deletion
    if (result.isConfirmed) {
      $.ajax({
        type: "DELETE",
        url: "http://localhost:3000/api/recipe/delete/" + recipeId, // Endpoint to delete a recipe
        success: function (response) {
          // Optionally, you can remove the deleted recipe row from the table
          $("#recipeRow_" + recipeId).remove();
          // Show success message using swal
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
          // Show error message using swal
          Swal.fire({
            icon: "error",
            title: "Failed to delete recipe.",
            text: error.responseText, // Display error message from the server
          });
        },
      });
    }
  });
}

// Event handler for delete button click
$(document).on("click", ".delete-recipe", function () {
  // Get the recipe ID from the data attribute of the delete button
  var recipeId = $(this).data("recipe-id");
  // Call deleteRecipe function with the recipe ID
  deleteRecipe(recipeId);
});

// Handle click event for editing a recipe
$(document).on("click", ".edit-recipe", function () {
  var recipeId = $(this).attr("data-recipe-id");
  // Fetch the recipe data from the server
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/api/recipe/" + recipeId,
    success: function (response) {
      // Populate the modal with the recipe data
      $("#editTitle").val(response.recipe.title);
      $("#editDescription").val(response.recipe.description);
      $("#editIngredients").val(response.recipe.ingredients);
      $("#editInstructions").val(response.recipe.instructions);
      $("#editRecipeId").val(response.recipe._id);
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
  var formData = $(this).serialize();
  var recipeId = $("#editRecipeId").val();
  $.ajax({
    type: "PUT",
    url: "http://localhost:3000/api/recipe/update/" + recipeId,
    data: formData,
    success: function (response) {
      // If edit is successful, reload the recipes
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
  
    // Confirm if the user wants to change the status
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
        // Send an AJAX request to update the status
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
  