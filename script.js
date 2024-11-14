document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".menu-item");
  const prompt = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");

  // Typing Modes
  const modes = {
    punctuation: [
      "Hello, world!",
      "Do you know the time?",
      "Why? Because I said so.",
      "Oh, no! The cat's outside.",
    ],
    numbers: [
      "123 456 789 101",
      "2023 1987 42 7",
      "1 2 3 4 5 6 7 8 9",
    ],
    time: [
      "Type as much as you can in 30 seconds.",
      "Keep going until the timer runs out.",
    ],
    words: [
      "give show last would that mean few fact time off",
      "the quick brown fox jumps over the lazy dog",
      "coding is fun and typing helps build skill",
    ],
    quote: [
      "To be or not to be, that is the question.",
      "All that glitters is not gold.",
      "A journey of a thousand miles begins with a single step.",
    ],
  };

  // Default mode
  let currentMode = "words";
  let currentPrompt = "";

  // Function to update prompt
  const updatePrompt = () => {
    const prompts = modes[currentMode];
    currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    prompt.textContent = currentPrompt;
    inputArea.value = "";
  };

  // Handle menu clicks
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove active class from all
      menuItems.forEach((menu) => menu.classList.remove("active"));
      // Set active class to clicked item
      item.classList.add("active");

      // Update current mode
      currentMode = item.id;
      updatePrompt();
    });
  });

  // Check input matches the prompt
  inputArea.addEventListener("input", () => {
    const inputText = inputArea.value.trim();
    if (inputText === currentPrompt) {
      alert("You completed the prompt!");
      updatePrompt();
    }
  });

  // Initialize first prompt
  updatePrompt();
});
