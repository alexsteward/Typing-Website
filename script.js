document.addEventListener("DOMContentLoaded", () => {
  const promptEl = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");
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
    const wordsTyped = correctChars / 5; // Assume 5 characters per word
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

  // Popup elements
  const popup = document.createElement("div");
popup.id = "completion-popup";
popup.innerHTML = `
  <div id="popup-content">
    <button id="close-popup">&times;</button>
    <h2>Completed!</h2>
    <p id="popup-wpm">WPM: 0</p>
    <p id="popup-accuracy">Accuracy: 100%</p>
  </div>
`;
document.body.appendChild(popup);

// Show the popup with stats
const showCompletionPopup = (wpm, accuracy) => {
  document.getElementById("popup-wpm").textContent = `WPM: ${wpm}`;
  document.getElementById("popup-accuracy").textContent = `Accuracy: ${accuracy}%`;
  popup.style.display = "block"; // Show the popup

  // Attach the event listener for closing the popup
  const closePopupButton = popup.querySelector("#close-popup"); // Make sure it's attached to the right popup
  closePopupButton.addEventListener("click", () => {
    console.log("Close button clicked!");  // Debugging line
    popup.style.display = "none"; // Hide the popup
  });
};

// Example of calling showCompletionPopup with dummy data
// showCompletionPopup(120, 98); // This line would show the popup with the stats


  // Handle input events
  inputArea.addEventListener("input", () => {
    if (!startTime) startTime = new Date();

    const userInput = inputArea.value;
    const spans = promptEl.querySelectorAll("span");

    const previouslyIncorrect = new Set([...errorIndices]); // Keep track of previously recorded errors
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
        errorIndices.add(index);
      }
    });

    // Ensure all previous errors remain counted for accuracy deduction
    previouslyIncorrect.forEach((index) => errorIndices.add(index));

    charactersTyped = userInput.length;

    // Calculate stats dynamically
    const elapsedTime = (new Date() - startTime) / 1000 / 60; // Time in minutes
    const wpm = calculateWPM(elapsedTime);
    const accuracy = calculateAccuracy();

    updateStats(wpm, accuracy);

    // Prompt completion
    if (userInput.length === currentPrompt.length) {
      inputArea.disabled = true; // Disable input after completion
      showCompletionPopup(wpm, accuracy); // Show the popup
    }
  });

  // Button event listeners
  refreshButton.addEventListener("click", () => {
    inputArea.value = "";
    errorIndices.clear();
    charactersTyped = 0;
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
});




















