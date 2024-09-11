document.addEventListener('DOMContentLoaded', () => {
  const mockup = document.querySelector('.vs-code-mockup');
  const minimizeBtn = document.getElementById('minimize-btn');
  const maximizeBtn = document.getElementById('maximize-btn');
  const closeBtn = document.getElementById('close-btn');
  let isMaximized = false;

  // Minimize action
  minimizeBtn.addEventListener('click', () => {
    mockup.classList.toggle('minimized');
  });

  // Maximize/Restore action
  maximizeBtn.addEventListener('click', () => {
    if (isMaximized) {
      mockup.classList.remove('maximized');
      isMaximized = false;
      maximizeBtn.textContent = '[ ]'; // Restore maximize icon
    } else {
      mockup.classList.add('maximized');
      isMaximized = true;
      maximizeBtn.textContent = '❐'; // Change to restore size icon
    }
  });

  // Close action
  closeBtn.addEventListener('click', () => {
    mockup.style.display = 'none';
  });

  // Function to detect the user's browser
  function detectUserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";

    if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1 && userAgent.indexOf("OPR") === -1) {
      browserName = "Google Chrome";
    } else if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Mozilla Firefox";
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
      browserName = "Safari";
    } else if (userAgent.indexOf("Edg") > -1) {
      browserName = "Microsoft Edge";
    } else if (userAgent.indexOf("OPR") > -1) {
      browserName = "Opera";
    } else if (userAgent.indexOf("Trident") > -1) {
      browserName = "Internet Explorer";
    }

    return browserName;
  }

  // Function to fetch the user's IP address
  async function fetchIpAddress() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return 'Unable to fetch IP';
    }
  }

  // Function to generate and type out the code
  async function generateCode() {
    const browserName = detectUserInfo();
    const ipAddress = await fetchIpAddress();

    // Log the IP address and browser name
    console.log('Browser Name:', browserName);
    console.log('IP Address:', ipAddress);

    const codeSnippet = `using System;
using Crestron.SimplSharp;
using Crestron.SimplSharpPro;
using Crestron.SimplSharpPro.DeviceSupport;
using Crestron.SimplSharp.CrestronIO;
using Crestron.SimplSharpPro.UI;
using System.Collections.Generic;
 
namespace CrestronWebpageProgram
{
  public partial class UserInterface
   {
     public uint Ipid 
      { private set; get; }
        string _sgdFile;BasicTriListWithSmartObject _device;
 
public UserInterface
    (uint ipid, CrestronControlSystem controlSystem, string sgdFile)

{
  _UserInterfaceConstructor
    (ipid, controlSystem, sgdFile, "");
}

public UserInterface
    (uint ipid, CrestronControlSystem controlSystem, string sgdFile, string projectName)

{
    _UserInterfaceConstructor
        (ipid, controlSystem, sgdFile, projectName);
}

void _UserInterfaceConstructor
    (uint ipid, CrestronControlSystem controlSystem, string sgdFile, string projectName)

{
    AddUIDevice(ipid, controlSystem, sgdFile, projectName);
}

Void RetrieveUserInfo()
{
    string _BrowserType = "${browserName}";
    string _IPAddress = "${ipAddress}";
   
}
  `;

    const codeElement = document.getElementById('code-snippet');

    if (codeElement) {
      codeElement.innerHTML = codeSnippet; // Set code snippet with syntax highlighting
      Prism.highlightElement(codeElement); // Apply Prism.js syntax highlighting

      let index = 0;
      const typingSpeed = 50;

      function typeWriter() {
        if (index < codeSnippet.length) {
          codeElement.textContent += codeSnippet.charAt(index);
          index++;

          // Scroll up as new text is added by adjusting scrollTop
          codeElement.scrollTop = codeElement.scrollHeight;

          setTimeout(typeWriter, typingSpeed);
        } else {
          setTimeout(() => {
            codeElement.textContent = ''; // Clear text after 60 seconds
            index = 0;
            typeWriter(); // Restart the typing
          }, 60000);
        }
      }

      // Clear existing content and start typing
      codeElement.textContent = '';
      typeWriter();
    } else {
      console.error('Element with id "code-snippet" not found.');
    }
  }

  // Call the code generation function when the window loads
  generateCode();
});
