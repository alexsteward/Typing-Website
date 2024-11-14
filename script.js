document.addEventListener("DOMContentLoaded", () => {
  const prompt = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");
  const speedCounter = document.getElementById("speed-counter");
  const leaderboardForm = document.getElementById("leaderboard-form");
  const leaderboardList = document.getElementById("leaderboard-list");

  let currentPrompt = "";
  let startTime = null;
  let incorrectCount = 0;

  // Prompts for typing
  const modes = {
    words: [
      "give show last would that mean few fact time off",
      "the quick brown fox jumps over the lazy dog",
      "coding is fun and typing helps build skill",
    ],
  };

  // Function to load a new prompt
  const updatePrompt = () => {
    const prompts = modes.words;
    currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    prompt.innerHTML = currentPrompt
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
    inputArea.value = "";
    startTime = null;
    incorrectCount = 0;
    speedCounter.textContent = "0";
  };

  // Function to calculate WPM
  const calculateWPM = (elapsedTime) => {
    const totalChars = currentPrompt.length;
    const penalty = incorrectCount * 0.5; // Each incorrect character deducts 0.5 WPM
    const wpm = Math.floor(((totalChars / 5) / elapsedTime) - penalty);
    return isNaN(wpm) || !isFinite(wpm) ? 0 : Math.max(0, wpm); // Ensure WPM is not negative
  };

  // Event listener for typing input
  inputArea.addEventListener("input", () => {
    const userInput = inputArea.value;
    const promptChars = currentPrompt.split("");
    const spans = prompt.querySelectorAll("span");

    // Start timer on the first keystroke
    if (!startTime) startTime = new Date();

    // Reset incorrect count
    incorrectCount = 0;

    // Compare user input with prompt characters
    spans.forEach((span, index) => {
      const userChar = userInput[index];
      if (userChar == null) {
        // Character not yet typed
        span.classList.remove("correct", "incorrect");
      } else if (userChar === span.textContent) {
        // Correct character
        span.classList.add("correct");
        span.classList.remove("incorrect");
      } else {
        // Incorrect character
        span.classList.add("incorrect");
        span.classList.remove("correct");
        incorrectCount++;
      }
    });

    // Calculate elapsed time in minutes
    const elapsedTime = (new Date() - startTime) / 1000 / 60;
    speedCounter.textContent = calculateWPM(elapsedTime);
  });

  // Submit score to leaderboard
  leaderboardForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const score = speedCounter.textContent;
    if (name) {
      leaderboardList.innerHTML += `<li>${name}: ${score} WPM</li>`;
    }
    leaderboardForm.reset();
    updatePrompt(); // Load a new prompt after submission
  });

  // Initialize the first prompt
  updatePrompt();
});
