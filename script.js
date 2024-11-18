document.addEventListener("DOMContentLoaded", function() {
  const preloader = document.getElementById("preloader");
  const content = document.getElementById("content");

  // Эмулируем задержку для демонстрации загрузочного экрана
  setTimeout(() => {
    preloader.style.display = "none";
    content.classList.remove("hidden");
  }, 2000); // Задержка в 2 секунды
});
