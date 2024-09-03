document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cf');

    // Ensure the form exists
    if (!form) {
        console.error('Form with ID "cf" not found');
        return;
    }

    const apiUrl = window.location.protocol === 'https:'
        ? 'https://www.avcontrolkode.com.au/send-email'
        : 'http://localhost:3000/send-email';

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            // Show a loading indicator (optional)
            document.getElementById('submit-button').disabled = true;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include a CSRF token if required by your backend
                    // 'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
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
            document.getElementById('submit-button').disabled = false;
        }
    });
});
