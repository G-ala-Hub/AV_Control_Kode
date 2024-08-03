// Function to generate and display code in the VS Code mockup
function generateCode() {
    // Define the code snippet
    const codeSnippet = `
  #DEFINE_CONSTANT VCR_INPUT 3
  #DEFINE_CONSTANT DVD_INPUT 4
#DEFINE_CONSTANT VPROJ_OUTPUT 2
PUSH vcr_select
{
    switcher_input = VCR_INPUT;
    switcher_output = VPROJ_OUTPUT; // video projector
}
PUSH dvd_select
{
    switcher_input = DVD_INPUT;
    switcher_output = VPROJ_OUTPUT; // video projector
}
    `;
  
    // Find the code snippet element
    const codeElement = document.getElementById('code-snippet');
    
    // Set the code snippet as the text content of the code element
    codeElement.textContent = codeSnippet;
  }
  
  // Call the function initially to populate the code snippet
  window.addEventListener('load', () => {
    generateCode();
  });
  