document.addEventListener("DOMContentLoaded", function () {
  const slideshows = document.querySelectorAll(".hero-slideshow");

  slideshows.forEach((slideshow) => {
    const slides = slideshow.querySelectorAll(".slide");
    let current = 0;

    if (slides.length > 1) {
      setInterval(() => {
        slides[current].classList.remove("active");
        current = (current + 1) % slides.length;
        slides[current].classList.add("active");
      }, 3000);
    }
  });
});
