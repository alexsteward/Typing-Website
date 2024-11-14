document.addEventListener("DOMContentLoaded", () => {
  const prompt = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");
  const speedCounter = document.getElementById("speed-counter");
  const errorMessage = document.getElementById("error-message");

  let currentPrompt = "";
  let startTime = null;
  let incorrectCount = 0;
  let completed = false;

  // Typing modes
  const modes = {
    words: [
      "give show last would that mean few fact time off",
      "the quick brown fox jumps over the lazy dog",
      "coding is fun and typing helps build skill",
    ],
    punctuation: [
      "The quick brown fox jumps over the lazy dog!",
      "Hello, world! How's it going?",
      "Wow, this is great; isn't it?"
    ],
    numbers: [
      "12345 67890 12345 67890",
      "98765 43210 98765 43210"
    ],
    time: [
      "Time flies when you're typing fast.",
      "Do you feel the time ticking away?"
    ],
    quote: [
      "The only limit to our realization of tomorrow is our doubts of today.",
      "In the middle of difficulty lies opportunity."
    ]
  };

  // Function to load a new prompt
  const updatePrompt = (mode = "words") => {
    const prompts = modes[mode];
    currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    prompt.innerHTML = currentPrompt
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
    inputArea.value = "";
    startTime = null;
    incorrectCount = 0;
    speedCounter.textContent = "0";
    completed = false;
    inputArea.disabled = false;
  };

  // Function to calculate WPM
  const calculateWPM = (elapsedTime) => {
    const totalChars = currentPrompt.length;
    const penalty = incorrectCount * 0.5;
    const wpm = Math.floor(((totalChars / 5) / elapsedTime) - penalty);
    return isNaN(wpm) || !isFinite(wpm) ? 0 : Math.max(0, wpm);
  };

  // Event listener for typing input
  inputArea.addEventListener("input", () => {
    if (completed) return;

    const userInput = inputArea.value;
    const promptChars = currentPrompt.split("");
    const spans = prompt.querySelectorAll("span");

    if (!startTime) startTime = new Date();

    incorrectCount = 0;
    spans.forEach((span, index) => {
      const userChar = userInput[index];
      if (userChar == null) {
        span.classList.remove("correct", "incorrect");
      } else if (userChar === span.textContent) {
        span.classList.add("correct");
        span.classList.remove("incorrect");
      } else {
        span.classList.add("incorrect");
        span.classList.remove("correct");
        incorrectCount++;
      }
    });

    const elapsedTime = (new Date() - startTime) / 1000 / 60;
    speedCounter.textContent = calculateWPM(elapsedTime);

    if (userInput === currentPrompt && incorrectCount === 0 && !completed) {
      completed = true;
      inputArea.disabled = true;
      const accuracy = Math.floor(((userInput.length - incorrectCount) / userInput.length) * 100);
      const wpm = calculateWPM(elapsedTime);
      showCompletionGUI(wpm, accuracy);
    }
  });

  // Show completion GUI with typing speed and accuracy
  const showCompletionGUI = (wpm, accuracy) => {
    const modal = document.createElement("div");
    modal.id = "completion-modal";
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Typing Test Complete!</h3>
        <p>Speed: ${wpm} WPM</p>
        <p>Accuracy: ${accuracy}%</p>
        <button id="close-modal">X</button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("close-modal").addEventListener("click", () => {
      document.body.removeChild(modal);
    });
  };

  // Mode switchers
  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", (e) => {
      document.querySelectorAll(".menu-item").forEach(el => el.classList.remove("active"));
      e.target.classList.add("active");
      updatePrompt(e.target.id);
    });
  });

  // Initialize first prompt
  updatePrompt("words");
});


