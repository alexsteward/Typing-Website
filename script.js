document.addEventListener("DOMContentLoaded", () => {
  const prompt = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");
  const speedCounter = document.getElementById("speed-counter");
  const accuracyCounter = document.getElementById("accuracy-counter");
  const errorMessage = document.getElementById("error-message");
  const refreshButton = document.getElementById("refresh-button");
  const nextButton = document.getElementById("next-button");

  const prompts = [
    "Type this sentence exactly.",
    "The quick brown fox jumps over the lazy dog.",
    "Coding is fun and typing helps build skill.",
    "Hello world! This is a typing test.",
    "I am learning to type faster and more accurately."
  ];

  let currentPrompt = prompts[0];
  let startTime = null;
  let completed = false;
  let correctCount = 0;

  // Function to calculate WPM
  const calculateWPM = (elapsedTime) => {
    const totalChars = currentPrompt.length;
    const wpm = Math.floor(((totalChars / 5) / elapsedTime)); // Simple WPM formula
    return isNaN(wpm) || !isFinite(wpm) ? 0 : Math.max(0, wpm);
  };

  // Function to calculate accuracy
  const calculateAccuracy = () => {
    const accuracy = (correctCount / currentPrompt.length) * 100;
    return accuracy.toFixed(2);
  };

  // Function to update the prompt
  const updatePrompt = () => {
    completed = false;
    correctCount = 0;
    inputArea.disabled = false; // Enable the input area
    inputArea.value = ""; // Clear input area
    prompt.textContent = currentPrompt; // Set the prompt text
    errorMessage.textContent = ""; // Clear error message
    speedCounter.textContent = "0"; // Reset WPM counter
    accuracyCounter.textContent = "100%"; // Reset accuracy
    startTime = null; // Reset the timer
    nextButton.disabled = true; // Disable next button initially
  };

  // Event listener for typing input
  inputArea.addEventListener("input", () => {
    if (completed) return;

    const userInput = inputArea.value;

    // Start timer on first keystroke
    if (!startTime) startTime = new Date();

    // Calculate correct characters count
    correctCount = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentPrompt[i]) {
        correctCount++;
      }
    }

    // Update accuracy
    accuracyCounter.textContent = `${calculateAccuracy()}%`;

    // Check for completion (exact match)
    if (userInput === currentPrompt) {
      completed = true;
      inputArea.disabled = true; // Disable input once prompt is completed

      const elapsedTime = (new Date() - startTime) / 1000 / 60; // Elapsed time in minutes
      const wpm = calculateWPM(elapsedTime);

      showCompletionMessage(wpm);
    }

    // Calculate WPM in real-time
    const elapsedTime = (new Date() - startTime) / 1000 / 60;
    speedCounter.textContent = calculateWPM(elapsedTime);
  });

  // Show completion message with WPM and Accuracy
  const showCompletionMessage = (wpm) => {
    errorMessage.textContent = `Completed! Your typing speed: ${wpm} WPM, Accuracy: ${calculateAccuracy()}%`;
    nextButton.disabled = false; // Enable next button after completion
  };

  // Refresh button event listener
  refreshButton.addEventListener("click", () => {
    updatePrompt();
  });

  // Next button event listener
  nextButton.addEventListener("click", () => {
    // Move to the next prompt
    const currentIndex = prompts.indexOf(currentPrompt);
    const nextIndex = (currentIndex + 1) % prompts.length; // Loop back to the start if at the end
    currentPrompt = prompts[nextIndex];
    updatePrompt();
  });

  // Initialize the first prompt
  updatePrompt();
});

