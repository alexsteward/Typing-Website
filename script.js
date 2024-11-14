document.addEventListener("DOMContentLoaded", () => {
  const promptElement = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");
  const speedCounter = document.getElementById("speed-counter");
  const accuracyCounter = document.getElementById("accuracy-counter");
  const navItems = document.querySelectorAll(".menu-item");

  let currentPrompt = "";
  let startTime = null;
  let incorrectCount = 0;

  // Prompts for different modes
  const modes = {
    punctuation: [
      "Hello, world! Can you type this accurately?",
      "It's a great day; let's practice typing!",
      "Don't forget: punctuation matters, even in simple sentences.",
    ],
    regular: [
      "practice typing to improve skill",
      "the quick brown fox jumps over",
      "coding is fun and improves speed"
    ],
    numbers: [
      "12345 67890",
      "98765 43210",
      "2468 13579 0"
    ]
  };

  let selectedMode = "punctuation";

  // Update the prompt
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
  };

  // Calculate WPM
  const calculateWPM = (elapsedTime) => {
    const totalChars = currentPrompt.length;
    const penalty = incorrectCount * 0.5; // Deduction per incorrect character
    const wpm = Math.floor(((totalChars / 5) / elapsedTime) - penalty);
    return Math.max(0, wpm); // Ensure WPM is not negative
  };

  // Calculate accuracy
  const calculateAccuracy = () => {
    const totalChars = currentPrompt.length;
    const correctChars = totalChars - incorrectCount;
    return ((correctChars / totalChars) * 100).toFixed(2);
  };

  // Handle typing input
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

    if (userInput === currentPrompt) {
      const elapsedTime = (new Date() - startTime) / 1000 / 60;
      speedCounter.textContent = calculateWPM(elapsedTime);
      accuracyCounter.textContent = calculateAccuracy();
      inputArea.disabled = true;
    }
  });

  // Mode navigation
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
















