document.addEventListener("DOMContentLoaded", () => {
  const promptElement = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");
  const wpmDisplay = document.getElementById("wpm");
  const accuracyDisplay = document.getElementById("accuracy-score");
  const refreshButton = document.getElementById("refresh");
  const nextButton = document.getElementById("next");
  const completionMessage = document.getElementById("completion-message");

  let prompts = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing fast requires practice and focus.",
    "Never give up on your goals, no matter what.",
    "Consistency is the key to mastering skills.",
  ];
  let currentPrompt = "";
  let startTime = null;
  let correctChars = 0;
  let totalTyped = 0;
  let isTyping = false;

  // Helper: Reset prompt and stats
  const resetStats = () => {
    startTime = null;
    correctChars = 0;
    totalTyped = 0;
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100%";
    completionMessage.hidden = true;
    inputArea.setAttribute("contenteditable", "true");
    isTyping = false;
    refreshButton.disabled = false;
    nextButton.disabled = false;
  };

  // Load a new prompt
  const loadPrompt = (index) => {
    resetStats();
    currentPrompt = prompts[index];
    promptElement.innerHTML = currentPrompt
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
    inputArea.textContent = "";
    refreshButton.disabled = true;
    nextButton.disabled = true;
  };

  // Calculate and update WPM and Accuracy
  const updateStats = () => {
    if (!startTime) return;
    const elapsedTime = (new Date() - startTime) / 1000 / 60; // in minutes
    const wpm = Math.round(correctChars / 5 / elapsedTime);
    const accuracy = Math.round((correctChars / totalTyped) * 100) || 100;
    wpmDisplay.textContent = isNaN(wpm) || wpm < 0 ? "0" : wpm;
    accuracyDisplay.textContent = `${accuracy}%`;
  };

  // Event listener for typing
  inputArea.addEventListener("input", (e) => {
    if (!isTyping) return;
    const inputText = e.target.textContent;
    const spans = promptElement.querySelectorAll("span");

    // Start timer on first keystroke
    if (!startTime) startTime = new Date();

    // Reset for real-time calculations
    correctChars = 0;
    totalTyped = inputText.length;

    // Validate each character
    spans.forEach((span, i) => {
      const typedChar = inputText[i];
      if (typedChar == null) {
        span.classList.remove("correct", "incorrect");
      } else if (typedChar === span.textContent) {
        span.classList.add("correct");
        span.classList.remove("incorrect");
        correctChars++;
      } else {
        span.classList.add("incorrect");
        span.classList.remove("correct");
      }
    });

    // Update stats
    updateStats();

    // Check if the prompt is complete
    if (inputText === currentPrompt) {
      inputArea.setAttribute("contenteditable", "false");
      completionMessage.hidden = false;
      isTyping = false;
      refreshButton.disabled = false;
      nextButton.disabled = false;
    }
  });

  // Event listeners for refresh and next buttons
  refreshButton.addEventListener("click", () => {
    loadPrompt(prompts.indexOf(currentPrompt));
  });

  nextButton.addEventListener("click", () => {
    const nextIndex = (prompts.indexOf(currentPrompt) + 1) % prompts.length;
    loadPrompt(nextIndex);
  });

  // Initialize the first prompt
  loadPrompt(0);

  // Allow focus by clicking on prompt
  promptElement.addEventListener("click", () => {
    if (!isTyping) {
      inputArea.setAttribute("contenteditable", "true");
      inputArea.focus();
      isTyping = true;
      refreshButton.disabled = false;
      nextButton.disabled = true;
    }
  });
});






