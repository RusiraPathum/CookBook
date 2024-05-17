$(document).ready(function() {
    // Fetch the recipe counts when the page loads
    fetchRecipeCounts();
});

function fetchRecipeCounts() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/recipe/count",
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
