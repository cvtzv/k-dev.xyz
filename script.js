document.addEventListener("DOMContentLoaded", function() {
  const preloader = document.getElementById("preloader");
  const content = document.getElementById("content");
  const avatar = document.getElementById("avatar");
  const easterEgg = document.getElementById("easter-egg");

  setTimeout(() => {
    preloader.style.opacity = "0";
    preloader.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
      preloader.style.display = "none";
      content.classList.remove("hidden");
    }, 500);
  }, 2000);

  avatar.addEventListener("click", () => {
    easterEgg.classList.toggle("hidden");
  });
});
