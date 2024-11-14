document.addEventListener("DOMContentLoaded", () => {
  const prompt = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");
  const speedCounter = document.getElementById("speed-counter");
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

  // Function to calculate WPM
  const calculateWPM = (elapsedTime) => {
    const totalChars = currentPrompt.length;
    const wpm = Math.floor(((totalChars / 5) / elapsedTime)); // Simple WPM formula
    return isNaN(wpm) || !isFinite(wpm) ? 0 : Math.max(0, wpm);
  };

  // Function to update the prompt
  const updatePrompt = () => {
    completed = false;
    inputArea.disabled = false; // Enable the input area
    inputArea.value = ""; // Clear input area
    prompt.textContent = currentPrompt; // Set the prompt text
    errorMessage.textContent = ""; // Clear error message
    startTime = null; // Reset the timer
    speedCounter.textContent = "0"; // Reset WPM counter
  };

  // Event listener for typing input
  inputArea.addEventListener("input", () => {
    if (completed) return;

    const userInput = inputArea.value;

    // Start timer on first keystroke
    if (!startTime) startTime = new Date();

    // Check for completion
    if (userInput === currentPrompt) {
      completed = true;
      inputArea.disabled = true;  // Disable input once prompt is completed

      const elapsedTime = (new Date() - startTime) / 1000 / 60; // Elapsed time in minutes
      const wpm = calculateWPM(elapsedTime);

      showCompletionMessage(wpm);
    }

    // Calculate WPM in real-time
    const elapsedTime = (new Date() - startTime) / 1000 / 60;
    speedCounter.textContent = calculateWPM(elapsedTime);
  });

  // Show completion message with WPM
  const showCompletionMessage = (wpm) => {
    errorMessage.textContent = `Completed! Your typing speed: ${wpm} WPM`;
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
