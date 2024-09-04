document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cf');

    // Ensure the form exists
    if (!form) {
        console.error('Form with ID "cf" not found');
        return;
    }

    // Ensure the submit button exists
    const submitButton = document.getElementById('cf-submit-1');
    if (!submitButton) {
        console.error('Submit button with ID "cf-submit-1" not found');
        return;
    }

    const apiUrl = window.location.protocol === 'https:'
        ? 'https://www.avcontrolkode.com.au/contact.php'
        : 'http://localhost:3000/contact.php';

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);

        try {
            // Show a loading indicator (optional)
            submitButton.disabled = true;

            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData, // Use FormData directly
            });

            if (response.ok) {
                // Handle response based on how your PHP script sends it
                const result = await response.text(); // Or use `response.json()` if PHP sends JSON
                alert('Message sent successfully!');
                form.reset();
            } else {
                // Log the response status and text for better debugging
                const errorText = await response.text();
                console.error('Failed to send message:', response.status, errorText);
                alert(`Failed to send message. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while sending the message.');
        } finally {
            // Hide the loading indicator
            submitButton.disabled = false;
        }
    });
});
