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
      .split(" ")
      .map((char) => `<span>${char}</span>`)
      .join(" ");
    inputArea.value = "";
    startTime = null;
    incorrectCount = 0;
    speedCounter.textContent = "0";
  };

  // Function to calculate WPM and accuracy
  const calculateWPM = (elapsedTime) => {
    const totalChars = currentPrompt.length;
    const totalCorrectChars = currentPrompt.split("").filter((char, index) => {
      return inputArea.value[index] === char;
    }).length;
    
    const accuracy = (totalCorrectChars / totalChars) * 100;
    const penalty = incorrectCount * 0.5; // Each incorrect character deducts 0.5 WPM
    const wpm = Math.floor(((totalChars / 5) / elapsedTime) - penalty);

    return {
      wpm: isNaN(wpm) || !isFinite(wpm) ? 0 : Math.max(0, wpm),
      accuracy: accuracy.toFixed(2)
    };
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
    const { wpm, accuracy } = calculateWPM(elapsedTime);
    speedCounter.textContent = wpm;

    // Check if the user has completed the prompt
    if (userInput === currentPrompt) {
      displayResultPopup(wpm, accuracy, elapsedTime);
    }
  });

  // Function to display result popup
  const displayResultPopup = (wpm, accuracy, elapsedTime) => {
    const resultPopup = document.getElementById("result-popup");
    const finalSpeed = document.getElementById("final-speed");
    const finalAccuracy = document.getElementById("final-accuracy");
    const speedGraph = document.getElementById("speed-graph").getContext("2d");

    finalSpeed.textContent = wpm;
    finalAccuracy.textContent = accuracy;

    // Create the graph for typing speed
    const data = {
      labels: Array.from({ length: elapsedTime * 60 }, (_, i) => i + 1), // 1 point per second
      datasets: [{
        label: 'Typing Speed (WPM)',
        data: generateSpeedData(elapsedTime, wpm),
        borderColor: '#ffcc00',
        fill: false,
      }]
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        scales: {
          x: { type: 'linear', position: 'bottom' },
          y: { min: 0 }
        }
      }
    };

    new Chart(speedGraph, config);

    // Show the popup
    resultPopup.style.display = 'block';

    // Close the popup on click
    document.getElementById("close-popup").addEventListener("click", () => {
      resultPopup.style.display = 'none';
      updatePrompt(); // Reload a new prompt after closing
    });
  };

  // Function to generate speed data for graph
  const generateSpeedData = (elapsedTime, wpm) => {
    const dataPoints = [];
    const points = Math.floor(elapsedTime * 60); // Convert minutes to seconds

    for (let i = 0; i < points; i++) {
      dataPoints.push(Math.max(0, wpm - (incorrectCount * 0.5 * i))); // Speed reduces based on incorrect characters
    }
    return dataPoints;
  };

  // Initial prompt load
  updatePrompt();
});
