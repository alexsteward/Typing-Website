document.addEventListener("DOMContentLoaded", () => {
  const promptEl = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");
  const completionMessage = document.getElementById("completion-message");
  const refreshButton = document.getElementById("refresh");
  const nextButton = document.getElementById("next");
  const wpmEl = document.getElementById("wpm");
  const accuracyEl = document.getElementById("accuracy-value");

  let currentPrompt = "";
  let startTime = null;
  let totalErrors = 0;

  const prompts = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing is fun and improves your speed.",
    "Accuracy and consistency are key.",
    "Test your skills with this challenge."
  ];

  const loadPrompt = () => {
    currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    promptEl.innerHTML = currentPrompt
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
    inputArea.value = "";
    completionMessage.hidden = true;
    inputArea.disabled = false;
    startTime = null;
    totalErrors = 0;
    updateStats(0, 100);
  };

  const calculateWPM = (elapsedTime) => {
    const wordsTyped = currentPrompt.length / 5;
    return Math.max(0, Math.floor(wordsTyped / elapsedTime));
  };

  const calculateAccuracy = (typedChars) => {
    const correctChars = typedChars - totalErrors;
    return Math.max(0, Math.floor((correctChars / typedChars) * 100));
  };

  const updateStats = (wpm, accuracy) => {
    wpmEl.textContent = wpm;
    accuracyEl.textContent = `${accuracy}%`;
  };

  inputArea.addEventListener("input", () => {
    if (!startTime) startTime = new Date();

    const userInput = inputArea.value;
    const spans = promptEl.querySelectorAll("span");
    let errors = 0;

    spans.forEach((span, index) => {
      const char = userInput[index];

      if (char == null) {
        span.classList.remove("correct", "incorrect");
      } else if (char === span.textContent) {
        span.classList.add("correct");
        span.classList.remove("incorrect");
      } else {
        span.classList.add("incorrect");
        span.classList.remove("correct");
        errors++;
      }
    });

    totalErrors = errors;

    const elapsedTime = (new Date() - startTime) / 1000 / 60; // Time in minutes
    const wpm = calculateWPM(elapsedTime);
    const accuracy = calculateAccuracy(userInput.length);

    updateStats(wpm, accuracy);

    if (userInput === currentPrompt) {
      completionMessage.hidden = false;
      inputArea.disabled = true;
    }
  });

  refreshButton.addEventListener("click", loadPrompt);
  nextButton.addEventListener("click", loadPrompt);

  loadPrompt();
});










