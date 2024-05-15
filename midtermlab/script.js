
  // Function to change the image source text on hover
  function initImageHover() {
    // Get the span element below the logo where the src will be displayed
    const srcDisplay = document.createElement('span');
    srcDisplay.id = 'image-src-display';
    // Place the span element in the DOM, right after the logo (STUFF) text
    const logo = document.querySelector('.navbar-brand h1');
    logo.appendChild(srcDisplay);

    // Get all images in the document
    const images = document.querySelectorAll('img');

    // Attach hover event listeners to each image
    images.forEach(img => {
      img.addEventListener('mouseenter', function() {
        // When hovered, set the innerHTML of the span to this image's src
        srcDisplay.textContent = ' ' + this.getAttribute('src');
      });
      img.addEventListener('mouseleave', function() {
        // When mouse leaves, clear the innerHTML of the span
        srcDisplay.textContent = '';
      });
    });
  }

  window.addEventListener('load', initImageHover);

