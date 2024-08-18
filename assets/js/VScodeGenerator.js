// Function to generate and type out the code in the VS Code mockup
function generateCode() {
  const codeSnippet = `
#DEFINE_CONSTANT Teams_INPUT 3
#DEFINE_CONSTANT Zoom_INPUT 4
#DEFINE_CONSTANT VPROJ_OUTPUT 2

PUSH teams_select {
    switcher_input = Teams_INPUT;
    switcher_output = VPROJ_OUTPUT; // video projector
}
PUSH zoom_select {
    switcher_input = Zoom_INPUT;
    switcher_output = VPROJ_OUTPUT; // video projector
}
  `;
  
  // Find the code snippet element
  const codeElement = document.getElementById('code-snippet');
  
  // Check if the element exists
  if (codeElement) {
    // Function to simulate typing effect
    let index = 0;
    const typingSpeed = 100; // Increase this value to slow down the typing speed

    function typeWriter() {
      if (index < codeSnippet.length) {
        codeElement.textContent += codeSnippet.charAt(index);
        index++;
        setTimeout(typeWriter, typingSpeed);
      } else {
        // Restart the typing effect after 60 seconds
        setTimeout(() => {
          codeElement.textContent = '';
          index = 0;
          typeWriter();
        }, 60000); // 60 seconds
      }
    }

    // Clear any existing content and start typing
    codeElement.textContent = '';
    typeWriter();
  } else {
    console.error('Element with id "code-snippet" not found.');
  }
}

// Call the function initially to populate the code snippet
window.addEventListener('load', () => {
  generateCode();
});
