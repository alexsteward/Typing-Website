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
  let errorIndices = new Set(); // Tracks indices of errors for accuracy
  let charactersTyped = 0;

  const prompts = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing is fun and improves your speed.",
    "Accuracy and consistency are key.",
    "Test your skills with this challenge."
  ];

  // Load a new prompt
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
    errorIndices.clear();
    charactersTyped = 0;
    updateStats(0, 100);
  };

  // Calculate Words Per Minute (WPM)
  const calculateWPM = (elapsedTime) => {
    const wordsTyped = currentPrompt.length / 5;
    return Math.max(0, Math.floor(wordsTyped / elapsedTime));
  };

  // Calculate Accuracy
  const calculateAccuracy = () => {
    const totalChars = currentPrompt.length;
    const incorrectChars = errorIndices.size;
    const correctChars = totalChars - incorrectChars;
    return Math.max(0, Math.floor((correctChars / totalChars) * 100));
  };

  // Update WPM and Accuracy
  const updateStats = (wpm, accuracy) => {
    wpmEl.textContent = wpm;
    accuracyEl.textContent = `${accuracy}%`;
  };

  // Input event listener
  inputArea.addEventListener("input", () => {
    if (!startTime) startTime = new Date();

    const userInput = inputArea.value;
    const spans = promptEl.querySelectorAll("span");

    errorIndices.clear(); // Reset error tracking for this evaluation

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
        errorIndices.add(index); // Mark this index as an error
      }
    });

    charactersTyped = userInput.length;

    // Calculate WPM and accuracy
    const elapsedTime = (new Date() - startTime) / 1000 / 60; // Time in minutes
    const wpm = calculateWPM(elapsedTime);
    const accuracy = calculateAccuracy();

    updateStats(wpm, accuracy);

    // Check if the prompt is fully typed
    if (userInput.length === currentPrompt.length) {
      completionMessage.hidden = false;
      inputArea.disabled = true; // Disable input after completion
    }
  });

  // Button event listeners
  refreshButton.addEventListener("click", loadPrompt);
  nextButton.addEventListener("click", loadPrompt);

  // Initialize
  loadPrompt();
});















