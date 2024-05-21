$(document).ready(function () {
  // Fetch the recipe counts when the page loads
  fetchActiveRecipeCounts();
  fetchInactiveRecipeCounts();
  // fetchRecentRecipe();
});

function fetchActiveRecipeCounts() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/api/recipe/active-count",
    success: function (response) {
      // Update the content of the activeRecipeCount span with the fetched count
      $("#activeRecipeCount").text(response.activeRecipeCount);
      console.log(response.activeRecipeCount);
    },
    error: function (error) {
      console.error("Error fetching recipe counts:", error);
    },
  });
}

function fetchInactiveRecipeCounts() {
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/api/recipe/inactive-count",
    success: function (response) {
      // Update the content of the activeRecipeCount span with the fetched count
      $("#inactiveRecipeCount").text(response.inactiveRecipeCount);
      console.log(response.inactiveRecipeCount);
    },
    error: function (error) {
      console.error("Error fetching recipe counts:", error);
    },
  });
}

function createRecipeStatusChart(labels, counts, options) {
    // Get the canvas context
    const ctx = document.getElementById("statusBarChart").getContext("2d");
  
    // Create the chart
    const statusBarChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Recipe Status",
            data: counts,
            backgroundColor: options.backgroundColor,
          },
        ],
      },
      options: options.chartOptions,
    });
  
    return statusBarChart;
  }
  
  // Example data (replace with actual data from your database)
  const statusLabels = ["Active", "Inactive"];
  const statusCounts = [1, 1]; // Number of recipes for each status
  
  // Chart options
  const options = {
    backgroundColor: ["#36A2EB", "#FF6384"],
    chartOptions: {
      responsive: true,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 10, // Customize step size as needed
            },
          },
        ],
      },
    },
  };
  
  // Create the chart using the function
  const statusBarChart = createRecipeStatusChart(statusLabels, statusCounts, options);
  

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
