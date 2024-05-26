$(document).ready(function() {
    // Initialize the date range picker
    $('#mealPlanDateRange').daterangepicker({
        locale: {
            format: 'MM/DD/YYYY'
        }
    });

    // Handle form submission
    $('#meal-plan-form').on('submit', async function(event) {
        event.preventDefault();
        
        // Validate the form
        if (!this.checkValidity()) {
            event.stopPropagation();
            this.classList.add('was-validated');
            return;
        }

        // Gather form data
        const formData = new FormData(this);
        formData.append('mealPlanDateRange', $('#mealPlanDateRange').val());

        try {
            // Send a POST request to your backend
            const response = await fetch('/api/meal-plans', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to submit the meal plan');
            }

            const result = await response.json();
            alert('Meal plan added successfully!');

            // Optionally close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('mealPlanModal'));
            modal.hide();

            // Optionally reset the form
            this.reset();
            this.classList.remove('was-validated');
        } catch (error) {
            alert(error.message);
        }
    });
});