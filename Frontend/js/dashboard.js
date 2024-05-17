$(document).ready(function() {
    // Fetch the recipe counts when the page loads
    fetchActiveRecipeCounts();
    fetchInactiveRecipeCounts();
    // fetchRecentRecipe();
});

function fetchActiveRecipeCounts() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/recipe/active-count",
        success: function(response) {
            // Update the content of the activeRecipeCount span with the fetched count
            $("#activeRecipeCount").text(response.activeRecipeCount);
            console.log(response.activeRecipeCount);
        },
        error: function(error) {
            console.error("Error fetching recipe counts:", error);
        }
    });
}

function fetchInactiveRecipeCounts() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/recipe/inactive-count",
        success: function(response) {
            // Update the content of the activeRecipeCount span with the fetched count
            $("#inactiveRecipeCount").text(response.inactiveRecipeCount);
            console.log(response.inactiveRecipeCount);
        },
        error: function(error) {
            console.error("Error fetching recipe counts:", error);
        }
    });
}

// function fetchRecentRecipe() {
//     $.ajax({
//       type: "GET",
//       url: "http://localhost:3000/api/recipe/recent",
//       success: function(response) {
//         if (response.recipe) {
//           $('#recentRecipeTitle').text(response.recipe.title);
//           $('#recentRecipeDescription').text(response.recipe.description);
//           $('#recentRecipeIngredients').text('Ingredients: ' + response.recipe.ingredients);
//           $('#recentRecipeInstructions').text('Instructions: ' + response.recipe.instructions);
//           $('#recentRecipeImage').attr('src', response.recipe.imageUrl);
//           $('#recentRecipeViewBtn').attr('data-recipe-id', response.recipe._id);
//           $('#recentRecipeEditBtn').attr('data-recipe-id', response.recipe._id);
//           $('#recent-recipe').show();
//         }
//       },
//       error: function(error) {
//         console.error("Error fetching the most recent recipe:", error);
//       }
//     });
//   }