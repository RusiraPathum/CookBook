$("#submit-feedback").click(function (event) {
    event.preventDefault();
  
    var form = document.querySelector("#feedback-form");
  
    // Validation
    // if (form.checkValidity() === false) {
    //   event.stopPropagation();
    //   form.classList.add("was-validated");
    //   return;
    // }
  
    // const formData = new FormData();
    // formData.append("comment", $("#comment").val());
    console.log("comment",$("#comment").val())
   
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/api/feedback/create",
      data: {comment:$("#comment").val()},
      contentType: false,
      processData: false,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      success: function (response) {
        $("#feedbackModal").modal("hide");
  
        Swal.fire({
          icon: "success",
          title: "Feedback added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
  
        // loadFeedback();
      },
      error: function (error) {
        console.error("Error:", error);
        alert("Failed to add feedback.");
      },
    });
});
