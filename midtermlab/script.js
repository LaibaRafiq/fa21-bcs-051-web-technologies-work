function displayImageSrc() {
  
    var images = document.getElementsByTagName('img');

    var displaySpan = document.getElementById('image-src-display');
    for (var i = 0; i < images.length; i++) {
      images[i].addEventListener('mouseenter', function() {

        displaySpan.innerHTML = this.src;
      });

      images[i].addEventListener('mouseleave', function() {
        displaySpan.innerHTML = '';
      });
    }
  }

  window.onload = displayImageSrc;