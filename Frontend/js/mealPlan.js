$(document).ready(function () {
    loadMealPlans();
  
    // $("#mealPlanModal").on("show.bs.modal", function () {
    //   $.ajax({
    //     type: "GET",
    //     url: "http://localhost:3000/api/mealPlan/select", // Update with your actual endpoint
    //     success: function (response) {
    //       // Clear existing options
    //       $("#recipeSelect").empty();
  
    //       // Add a default option
    //       $("#recipeSelect").append('<option value="">Select Recipe</option>');
  
    //       // Populate select input with recipe names
    //       response.recipes.forEach(function (recipe) {
    //         $("#recipeSelect").append(
    //           `<option value="${recipe._id}">${recipe.title}</option>` // Change recipe.name to recipe.title
    //         );
    //       });
    //     },
    //     error: function (error) {
    //       console.error("Error:", error);
    //       alert("Failed to load recipe names.");
    //     },
    //   });
    // });
  
  });
  
  function loadMealPlans() {
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/api/mealPlan", // Update the URL with your actual endpoint
      success: function (response) {
        $("#mealPlanContainer").empty(); // Clear previous meal plans
  
        var token = localStorage.getItem("token");
        var decodedToken = jwt_decode(token);
        var loggedInUserId = decodedToken.userId;
  
        // Loop through each meal plan and append it to the container
        // Loop through each meal plan and append it to the container
        response.mealPlans.forEach(function (mealPlan) {
          // Parse the date string to a Date object
          var planDate = new Date(mealPlan.date);
          // Get the date in a readable format (e.g., "YYYY-MM-DD")
          var formattedDate = planDate.toISOString().split("T")[0];
  
          var card = $(`
          <div class="col-lg-4 col-md-6">
              <div class="card">
                  <div class="el-card-item">
                      <div class="el-card-content">
                          <h4 class="mb-0">${mealPlan.title}</h4>
                          <span class="text-muted">${formattedDate}</span> <!-- Display formatted date -->
                          <div class="mt-3">
                              <button class="btn btn-success btn-sm text-white view-mealPlan" data-mealPlan-id="${
                                mealPlan._id
                              }">View</button>
                              ${
                                mealPlan.userId === loggedInUserId
                                  ? `
                                  <button class="btn btn-cyan btn-sm mr-1 text-white edit-mealPlan" data-mealPlan-id="${mealPlan._id}">Edit</button>
                                  <button class="btn btn-danger btn-sm text-white delete-mealPlan" data-mealPlan-id="${mealPlan._id}">Delete</button>
                                  `
                                  : ``
                              }
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      `);
  
          $("#mealPlanContainer").append(card);
        });
      },
      error: function (error) {
        console.error("Error:", error);
        alert("Failed to load meal plans.");
      },
    });
  }
  
  $("#submit-mealPlan").click(function (event) {
    event.preventDefault();
  
    var title = $("#title").val();
    var date = $("#date").val();
  
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/api/mealplan/create",
      data: JSON.stringify({ title: title, date: date }), // Send data as JSON string
      contentType: "application/json", // Set content type to JSON
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: function (response) {
        $("#mealPlanModal").modal("hide");
  
        Swal.fire({
          icon: "success",
          title: "Meal plan added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
  
        // Assuming you have a function to load meal plans
        loadMealPlans();
      },
      error: function (error) {
        console.error("Error:", error);
        alert("Failed to add meal plan.");
      },
    });
  });
  
  $(document).on("click", ".edit-mealPlan", function () {
    var mealPlanId = $(this).attr("data-mealPlan-id");
    $.ajax({
      type: "GET",
      url: "http://localhost:3000/api/mealPlan/" + mealPlanId,
      success: function (response) {
        $("#editTitle").val(response.mealPlan.title);
        $("#editDate").val(formatDate(response.mealPlan.date)); // Assuming response.mealPlan.date is in a compatible format
        $("#editMealPlanId").val(response.mealPlan._id);
  
        // Show the modal
        $("#editMealPlanModal").modal("show");
      },
      error: function (error) {
        console.error("Error:", error);
        alert("Failed to fetch meal plan data.");
      },
    });
  });
  
  // Function to format date to YYYY-MM-DD format
  function formatDate(date) {
    var formattedDate = new Date(date);
    var year = formattedDate.getFullYear();
    var month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    var day = String(formattedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  
  $("#editMealPlanForm").submit(function (event) {
    event.preventDefault();
  
    var form = document.querySelector("#editMealPlanForm");
  
    // Validation
    if (form.checkValidity() === false) {
      event.stopPropagation();
      form.classList.add("was-validated");
      return;
    }
  
    var title = $("#editTitle").val();
    var date = $("#editDate").val();
    var mealPlanId = $("#editMealPlanId").val();
  
    $.ajax({
      type: "PUT",
      url: "http://localhost:3000/api/mealPlan/update/" + mealPlanId,
      data: JSON.stringify({ title: title, date: date }), // Send data as JSON string
      contentType: "application/json", // Set content type to JSON
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: function (response) {
        loadMealPlans();
        // Close the modal
        $("#editMealPlanModal").modal("hide");
        Swal.fire({
          icon: "success",
          title: "Meal plan updated successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      },
      error: function (error) {
        console.error("Error:", error);
        alert("Failed to update meal plan.");
      },
    });
  });
  
  function deleteMealPlan(mealPlanId) {
    console.log(mealPlanId);
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this meal plan!",
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
          url: "http://localhost:3000/api/mealPlan/delete/" + mealPlanId,
          success: function (response) {
            $("#mealPlanRow_" + mealPlanId).remove();
            Swal.fire({
              icon: "success",
              title: "Meal plan deleted successfully!",
              showConfirmButton: false,
              timer: 1500,
            });
  
            loadMealPlans();
          },
          error: function (error) {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: "Failed to delete meal plan.",
              text: error.responseText,
            });
          },
        });
      }
    });
  }
  
  // Event handler for delete button click
  $(document).on("click", ".delete-mealPlan", function () {
    var mealPlanId = $(this).attr("data-mealPlan-id");
    deleteMealPlan(mealPlanId);
  });
  