let activeRecipeCountForChart = 0;
let inActiveRecipeCountForChart = 0;

$(document).ready(function () {
  // Fetch the recipe counts when the page loads
  fetchRecipeCounts().then(() => {
    // Create the chart using the fetched data
    const statusLabels = ["Active", "Inactive"];
    const statusCounts = [activeRecipeCountForChart, inActiveRecipeCountForChart];
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
    createRecipeStatusChart(statusLabels, statusCounts, options);
  });

});

$("#searchForm").on("submit", function (event) {

  event.preventDefault(); // Prevent the form from submitting via the browser
  var query = $("input[name='query']").val(); // Get the value from the search input

  if (query === '') {
    $('#searchInput').addClass('is-invalid');
    form.classList.add('was-validated');
  } else {

    $.ajax({
      type: "GET",
      url: "http://localhost:3000/api/search/recipe?query=" + encodeURIComponent(query),
      success: function (response) {
        $("#recipeContainer").empty(); // Clear the existing recipe cards

        // var token = localStorage.getItem("token");
        // var decodedToken = jwt_decode(token);
        // var loggedInUserId = decodedToken.userId;
        console.log(response);

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
                          <a class="btn default btn-outline image-popup-vertical-fit el-link" href="${recipe.imageUrl}">
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
                      <button class="btn btn-success btn-sm text-white view-recipe" data-recipe-id="${recipe._id}">View</button>
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
      }
    });
  }



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

function fetchRecipeCounts() {
  return Promise.all([fetchActiveRecipeCounts(), fetchInactiveRecipeCounts()]);
}

function fetchActiveRecipeCounts() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/api/recipe/active-count",
      success: function (response) {
        // Update the content of the activeRecipeCount span with the fetched count
        $("#activeRecipeCount").text(response.activeRecipeCount);
        activeRecipeCountForChart = response.activeRecipeCount;
        console.log(response.activeRecipeCount);
        resolve();
      },
      error: function (error) {
        console.error("Error fetching recipe counts:", error);
        reject(error);
      },
    });
  });
}

function fetchInactiveRecipeCounts() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/api/recipe/inactive-count",
      success: function (response) {
        // Update the content of the activeRecipeCount span with the fetched count
        $("#inactiveRecipeCount").text(response.inactiveRecipeCount);
        inActiveRecipeCountForChart = response.inactiveRecipeCount;
        console.log(response.inactiveRecipeCount);
        resolve();
      },
      error: function (error) {
        console.error("Error fetching recipe counts:", error);
        reject(error);
      },
    });
  });
}

function createRecipeStatusChart(labels, counts, options) {
  console.log(activeRecipeCountForChart, inActiveRecipeCountForChart);
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
