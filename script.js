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
  const submitButton = document.getElementById("submit-score"); // Button for submitting score
  const leaderboardEl = document.getElementById("leaderboard"); // To display leaderboard

  let currentPrompt = "";
  let startTime = null;
  let errorIndices = new Set();
  let allErrors = 0;
  let charactersTyped = 0;
  let currentMode = "regular";
  let currentWpm = 0;
  let currentAccuracy = 100;

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

  // Load leaderboard from localStorage
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  const loadPrompt = () => {
    currentPrompt =
      prompts[currentMode][Math.floor(Math.random() * prompts[currentMode].length)];
    promptEl.innerHTML = currentPrompt
      .split(" ")
      .map((char) => `<span>${char}</span>`)
      .join(" ");
    inputArea.value = "";
    completionMessage.hidden = true;
    inputArea.disabled = false;
    startTime = null;
    errorIndices.clear();
    allErrors = 0;
    charactersTyped = 0;
    updateStats(0, 100);
  };

  const calculateWPM = (elapsedTime) => {
    const correctChars = currentPrompt.length - errorIndices.size;
    const wordsTyped = correctChars / 5; // Assume 5 characters per word
    return Math.max(0, Math.floor(wordsTyped / elapsedTime));
  };

  const calculateAccuracy = () => {
    const totalChars = currentPrompt.length;
    const incorrectChars = errorIndices.size;
    const correctChars = totalChars - incorrectChars;
    return Math.max(0, Math.floor((correctChars / totalChars) * 100));
  };

  const updateStats = (wpm, accuracy) => {
    wpmEl.textContent = wpm;
    accuracyEl.textContent = `${accuracy}%`;
  };

  const updateLeaderboard = () => {
    leaderboardEl.innerHTML = leaderboard
      .sort((a, b) => b.wpm - a.wpm) // Sort leaderboard by WPM in descending order
      .slice(0, 10) // Get top 10 scores
      .map(
        (entry, index) => `
        <li>${index + 1}. ${entry.wpm} WPM - ${entry.accuracy}% Accuracy</li>
      `
      )
      .join("");
  };

  // Handle input events
  inputArea.addEventListener("input", () => {
    if (!startTime) startTime = new Date();

    const userInput = inputArea.value;
    const spans = promptEl.querySelectorAll("span");

    const previouslyIncorrect = new Set([...errorIndices]);
    errorIndices.clear();

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
        errorIndices.add(index);
      }
    });

    previouslyIncorrect.forEach((index) => errorIndices.add(index));
    charactersTyped = userInput.length;

    const elapsedTime = (new Date() - startTime) / 1000 / 60; // Time in minutes
    currentWpm = calculateWPM(elapsedTime);
    currentAccuracy = calculateAccuracy();

    updateStats(currentWpm, currentAccuracy);

    if (userInput.length === currentPrompt.length) {
      completionMessage.hidden = false;
      inputArea.disabled = true;
    }
  });

  // Handle score submission
  submitButton.addEventListener("click", () => {
    if (currentWpm > 0 && currentAccuracy >= 0) {
      const newEntry = { wpm: currentWpm, accuracy: currentAccuracy };
      leaderboard.push(newEntry);
      leaderboard = leaderboard.sort((a, b) => b.wpm - a.wpm).slice(0, 10); // Keep top 10
      localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
      updateLeaderboard();
    }
  });

  // Button event listeners
  refreshButton.addEventListener("click", () => {
    inputArea.value = "";
    errorIndices.clear();
    charactersTyped = 0;
    completionMessage.hidden = true;
    inputArea.disabled = false;
    updateStats(0, 100);
    const spans = promptEl.querySelectorAll("span");
    spans.forEach(span => {
      span.classList.remove("correct", "incorrect");
    });
    startTime = null;
  });

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
  updateLeaderboard();
});




















