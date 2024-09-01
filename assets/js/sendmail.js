document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cf');

    const apiUrl = window.location.protocol === 'https:'
        ? 'https://www.avcontorlkode.com.au/send-email'
        : 'https://localhost:3000/send-email';

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);
        const data = {};

        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert('Message sent successfully!');
                form.reset();
            } else {
                alert('Failed to send message.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while sending the message.');
        }
    });
});
