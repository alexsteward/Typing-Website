document.addEventListener("DOMContentLoaded", () => {
  const promptElement = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");
  const speedCounter = document.getElementById("speed-counter");
  const accuracyCounter = document.getElementById("accuracy-counter");
  const refreshButton = document.getElementById("refresh-button");
  const nextButton = document.getElementById("next-button");
  const navItems = document.querySelectorAll(".menu-item");

  let currentPrompt = "";
  let startTime = null;
  let incorrectCount = 0;

  const modes = {
    punctuation: [
      "Hello, world!",
      "It's a great day.",
      "Don't forget: punctuation matters."
    ],
    regular: [
      "practice typing fast",
      "the quick brown fox",
      "coding is fun always"
    ],
    numbers: [
      "12345 67890",
      "98765 43210",
      "2468 13579 0"
    ]
  };

  let selectedMode = "punctuation";

  const updatePrompt = () => {
    const prompts = modes[selectedMode];
    currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    promptElement.innerHTML = currentPrompt
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
    inputArea.value = "";
    startTime = null;
    incorrectCount = 0;
    speedCounter.textContent = "0";
    accuracyCounter.textContent = "100";
    inputArea.disabled = false;
  };

  const calculateWPM = (elapsedTime) => {
    const totalChars = currentPrompt.length;
    return Math.floor((totalChars / 5) / elapsedTime);
  };

  const calculateAccuracy = () => {
    const totalChars = currentPrompt.length;
    const correctChars = totalChars - incorrectCount;
    return ((correctChars / totalChars) * 100).toFixed(2);
  };

  inputArea.addEventListener("input", () => {
    const userInput = inputArea.value;
    const promptChars = currentPrompt.split("");
    const spans = promptElement.querySelectorAll("span");

    if (!startTime) startTime = new Date();

    incorrectCount = 0;

    spans.forEach((span, index) => {
      const userChar = userInput[index];
      if (userChar == null) {
        span.classList.remove("correct", "incorrect");
      } else if (userChar === span.textContent) {
        span.classList.add("correct");
        span.classList.remove("incorrect");
      } else {
        span.classList.add("incorrect");
        span.classList.remove("correct");
        incorrectCount++;
      }
    });

    if (userInput.length === currentPrompt.length) {
      const elapsedTime = (new Date() - startTime) / 1000 / 60;
      speedCounter.textContent = calculateWPM(elapsedTime);
      accuracyCounter.textContent = calculateAccuracy();
      inputArea.disabled = true;
    }
  });

  refreshButton.addEventListener("click", () => updatePrompt());

  nextButton.addEventListener("click", () => updatePrompt());

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
      selectedMode = item.id;
      updatePrompt();
    });
  });

  updatePrompt();
});

















