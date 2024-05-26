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
