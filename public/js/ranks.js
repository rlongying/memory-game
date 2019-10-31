const restartBtn = document.getElementById("restart-btn");

if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    window.location = "/";
  });
}
