document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cf');

    // Ensure the form exists
    if (!form) {
        console.error('Form with ID "cf" not found');
        return;
    }

    // Ensure the submit button exists
    const submitButton = document.getElementById('cf-submit');
    if (!submitButton) {
        console.error('Submit button with ID "cf-submit" not found');
        return;
    }

    // Set Formspree API URL
    const apiUrl = 'https://formspree.io/f/mwpezypg';

    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        const formData = new FormData(form); // Gather form data

        try {
            // Disable the submit button and show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...'; // Optional loading text

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData, // Use FormData for form data submission
            });

            if (response.ok) {
                const result = await response.json(); // Parse JSON response
                alert('Message sent successfully!');
                form.reset(); // Reset the form after successful submission
            } else {
                const errorData = await response.json();
                console.error('Failed to send message:', response.status, errorData);
                alert(`Failed to send message: ${errorData.errors.map(e => e.message).join(', ')}`);
            }
        } catch (error) {
            console.error('Error occurred while sending message:', error);
            alert('An error occurred while sending the message. Please try again later.');
        } finally {
            // Re-enable the submit button and reset the text
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message'; // Restore button text
        }
    });
});
