document.addEventListener("DOMContentLoaded", function() {
  const preloader = document.getElementById("preloader");
  const content = document.getElementById("content");

  setTimeout(() => {
    preloader.style.opacity = "0";
    preloader.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
      preloader.style.display = "none";
      content.classList.remove("hidden");
      content.style.opacity = "1";
      content.style.transition = "opacity 0.5s ease";
    }, 500);
  }, 2000);
});
