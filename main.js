let faMoon = document.querySelector(".fa-moon");
let faSun = document.querySelector(".fa-sun");
let mainContainer = document.querySelector(".main-container");

faMoon.addEventListener("click", () => {
  mainContainer.classList.toggle("dark-theme");
  if (faMoon.classList.contains("fa-moon")) {
    faMoon.classList.replace("fa-moon", "fa-sun");
  } else {
    faMoon.classList.replace("fa-sun", "fa-moon");
  }
});
