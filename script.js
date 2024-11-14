document.addEventListener("DOMContentLoaded", () => {
  const prompt = document.getElementById("prompt").textContent.trim();
  const inputArea = document.getElementById("input-area");

  inputArea.addEventListener("input", () => {
    const inputText = inputArea.value.trim();
    if (inputText === prompt) {
      inputArea.value = ""; // Reset input
      alert("Well done!");
    }
  });
});
