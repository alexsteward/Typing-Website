document.addEventListener("DOMContentLoaded", () => {
  const prompt = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");
  const speedCounter = document.getElementById("speed-counter");
  const errorMessage = document.getElementById("error-message");

  let currentPrompt = "Type this sentence exactly.";
  let startTime = null;
  let completed = false;

  // Function to calculate WPM
  const calculateWPM = (elapsedTime) => {
    const totalChars = currentPrompt.length;
    const wpm = Math.floor(((totalChars / 5) / elapsedTime)); // Simple WPM formula
    return isNaN(wpm) || !isFinite(wpm) ? 0 : Math.max(0, wpm);
  };

  // Event listener for typing input
  inputArea.addEventListener("input", () => {
    if (completed) return;

    const userInput = inputArea.value;
    const promptChars = currentPrompt.split("");

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
});
