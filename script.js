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

  const resetStats = () => {
    startTime = null;
    correctChars = 0;
    totalTyped = 0;
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100%";
    completionMessage.hidden = true;
    inputArea.textContent = "";
    inputArea.setAttribute("contenteditable", "false");
    isTyping = false;
  };

  const loadPrompt = (index) => {
    resetStats();
    currentPrompt = prompts[index];
    promptElement.innerHTML = currentPrompt
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
  };

  const updateStats = () => {
    if (!startTime) return;
    const elapsedTime = (new Date() - startTime) / 1000 / 60; // minutes
    const wpm = Math.round(correctChars / 5 / elapsedTime);
    const accuracy = Math.round((correctChars / totalTyped) * 100) || 100;
    wpmDisplay.textContent = Math.max(wpm, 0);
    accuracyDisplay.textContent = `${accuracy}%`;
  };

  inputArea.addEventListener("input", () => {
    if (!isTyping) return;

    const userInput = inputArea.textContent;
    const spans = promptElement.querySelectorAll("span");

    if (!startTime) startTime = new Date();

    correctChars = 0;
    totalTyped = userInput.length;

    spans.forEach((span, i) => {
      const typedChar = userInput[i];
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

    updateStats();

    if (userInput === currentPrompt) {
      inputArea.setAttribute("contenteditable", "false");
      completionMessage.hidden = false;
      isTyping = false;
    }
  });

  refreshButton.addEventListener("click", () => {
    loadPrompt(prompts.indexOf(currentPrompt));
  });

  nextButton.addEventListener("click", () => {
    const nextIndex = (prompts.indexOf(currentPrompt) + 1) % prompts.length;
    loadPrompt(nextIndex);
  });

  promptElement.addEventListener("click", () => {
    if (!isTyping) {
      inputArea.setAttribute("contenteditable", "true");
      inputArea.focus();
      isTyping = true;
    }
  });

  loadPrompt(0);
});








