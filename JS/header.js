let currentIndex = 0;
const images = document.querySelectorAll('.static-carousel-container img'); 
const totalImages = images.length;

function showNextImage() {
    images[currentIndex].classList.remove('active'); 
    currentIndex = (currentIndex + 1) % totalImages; 
    images[currentIndex].classList.add('active'); 
}


images[currentIndex].classList.add('active'); 
setInterval(showNextImage, 5000); 

