document.addEventListener("DOMContentLoaded", () => {
  const prompt = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");
  const speedCounter = document.getElementById("speed-counter");
  const leaderboardForm = document.getElementById("leaderboard-form");
  const leaderboardList = document.getElementById("leaderboard-list");

  let currentPrompt = "";
  let startTime = null;
  let wordCount = 0;
  let incorrectCount = 0;

  const modes = {
    words: [
      "give show last would that mean few fact time off",
      "the quick brown fox jumps over the lazy dog",
      "coding is fun and typing helps build skill",
    ],
  };

  const updatePrompt = () => {
    const prompts = modes.words;
    currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    prompt.innerHTML = currentPrompt
      .split(" ")
      .map((word) => `<span>${word}</span>`)
      .join(" ");
    inputArea.value = "";
    startTime = null;
    wordCount = currentPrompt.split(" ").length;
    incorrectCount = 0;
    speedCounter.textContent = "0";
  };

  inputArea.addEventListener("input", () => {
    if (!startTime) startTime = new Date();
    const words = inputArea.value.trim().split(" ");
    const spans = prompt.querySelectorAll("span");

    spans.forEach((span, index) => {
      const word = words[index];
      if (!word) {
        span.classList.remove("correct", "incorrect");
        return;
      }
      if (word === span.textContent) {
        span.classList.add("correct");
        span.classList.remove("incorrect");
      } else {
        span.classList.add("incorrect");
        span.classList.remove("correct");
        incorrectCount++;
      }
    });

    const elapsedTime = (new Date() - startTime) / 1000 / 60;
    const correctWords = spans.length - incorrectCount;
    const speed = Math.floor(correctWords / elapsedTime);
    speedCounter.textContent = isNaN(speed) || !isFinite(speed) ? "0" : speed;
  });

  leaderboardForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const score = speedCounter.textContent;
    leaderboardList.innerHTML += `<li>${name}: ${score} WPM</li>`;
    leaderboardForm.reset();
    updatePrompt();
  });

  updatePrompt();
});


