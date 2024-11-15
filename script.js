document.addEventListener("DOMContentLoaded", () => {
  const promptEl = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");
  const completionMessage = document.getElementById("completion-message");
  const refreshButton = document.getElementById("refresh");
  const nextButton = document.getElementById("next");
  const wpmEl = document.getElementById("wpm");
  const accuracyEl = document.getElementById("accuracy-value");
  const regularModeButton = document.getElementById("regular-mode");
  const punctuationModeButton = document.getElementById("punctuation-mode");

  let currentPrompt = "";
  let startTime = null;
  let errorIndices = new Set();
  let allErrors = 0; // Total errors for accuracy tracking
  let charactersTyped = 0;
  let currentMode = "regular";

  const prompts = {
    regular: [
      "the quick brown fox",
      "typing is fun",
      "practice every day",
      "focus on accuracy",
    ],
    punctuation: [
      "Hello, world!",
      "How are you?",
      "It's a great day.",
      "Yes, indeed!",
    ],
  };

  // Load a new prompt
  const loadPrompt = () => {
    currentPrompt =
      prompts[currentMode][Math.floor(Math.random() * prompts[currentMode].length)];
    promptEl.innerHTML = currentPrompt
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
    inputArea.value = "";
    completionMessage.hidden = true;
    inputArea.disabled = false;
    startTime = null;
    errorIndices.clear();
    allErrors = 0;
    charactersTyped = 0;
    updateStats(0, 100);
  };

  // Calculate Words Per Minute (WPM)
  const calculateWPM = (elapsedTime) => {
  const correctChars = currentPrompt.length - errorIndices.size;
  const wordsTyped = correctChars / 5; // Average word length is 5 characters
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

  // Handle input events
 inputArea.addEventListener("input", () => {
  if (!startTime) startTime = new Date();

  const userInput = inputArea.value;
  const spans = promptEl.querySelectorAll("span");

  errorIndices.clear(); // Reset error tracking for this evaluation

  spans.forEach((span, index) => {
    const char = userInput[index];

    if (char == null) {
      // Reset styling for characters not yet typed
      span.classList.remove("correct", "incorrect");
    } else if (char === span.textContent) {
      // Mark correctly typed characters
      span.classList.add("correct");
      span.classList.remove("incorrect");
    } else {
      // Mark incorrectly typed characters
      span.classList.add("incorrect");
      span.classList.remove("correct");
      errorIndices.add(index); // Record this index as an error
    }
  });

  charactersTyped = userInput.length;

  // Recalculate stats
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

  // Mode selection
  regularModeButton.addEventListener("click", () => {
    currentMode = "regular";
    regularModeButton.classList.add("active");
    punctuationModeButton.classList.remove("active");
    loadPrompt();
  });

  punctuationModeButton.addEventListener("click", () => {
    currentMode = "punctuation";
    punctuationModeButton.classList.add("active");
    regularModeButton.classList.remove("active");
    loadPrompt();
  });

  // Initialize
  loadPrompt();
});



















