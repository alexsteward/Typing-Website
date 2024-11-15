document.addEventListener("DOMContentLoaded", () => {
  const promptEl = document.getElementById("prompt");
  const inputArea = document.getElementById("input-area");
  const refreshButton = document.getElementById("refresh");
  const nextButton = document.getElementById("next");
  const wpmEl = document.getElementById("wpm");
  const accuracyEl = document.getElementById("accuracy-value");
  const regularModeButton = document.getElementById("regular-mode");
  const punctuationModeButton = document.getElementById("punctuation-mode");
  const completionMessageEl = document.getElementById("completion-message"); 

  let currentPrompt = "";
  let startTime = null;
  let errorIndices = new Set();
  let charactersTyped = 0;
  let currentMode = "regular";

  const prompts = {
    regular: [
       "the quick brown fox",
    "typing is fun",
    "practice every day",
    "focus on accuracy",
    "improve your skills",
    "typing can be easy",
    "keep typing to learn",
    "consistency is key",
    "practice makes perfect",
    "typing helps your brain",
    "read and type often",
    "always stay focused",
    "typing improves speed",
    "take your time typing",
    "challenge yourself daily",
    "take breaks to refresh",
    "learn to type quickly",
    "develop good habits",
    "learn from mistakes",
    "becoming a pro takes time",
    "speed up your typing",
    "learn from your errors",
    "accuracy is important",
    "the best way to learn",
    "type without looking down",
    "typing games can help",
    "typing is a valuable skill",
    "keyboard shortcuts save time",
    "work on your rhythm",
    "focus on the task at hand",
    "small steps lead to success",
    "practice typing often",
    "repetition helps mastery",
    "keep pushing forward",
    "type every day for progress",
    "accuracy over speed first",
    "type at a comfortable pace",
    "focus on the flow of words",
    "concentration leads to success",
    "don't rush your typing",
    "take time to type correctly",
    "type with confidence",
    "typing with precision matters",
    "typing teaches patience",
    "practice builds muscle memory",
    "type and improve daily",
    "keep your posture straight",
    "a relaxed hand improves typing",
    "typing builds mental strength",
    "mastering the keyboard takes time",
    "Romello can type fast",
    ],
     punctuation: [
    "Hello, how are you today?",
    "Do you want to go to the movies tonight?",
    "I can't believe it's already December!",
    "Are you coming to the party on Friday?",
    "It's a beautiful day outside, isn't it?",
    "I think we should go for a walk.",
    "What time does the train leave?",
    "I love reading books, especially mysteries.",
    "Can you help me with this project?",
    "It's so hot outside; let's go swimming.",
    "Do you like coffee, or do you prefer tea?",
    "I can't wait for the weekend to come.",
    "Wow! That was an amazing performance!",
    "Are we going out for dinner tonight?",
    "I'm so excited for the concert tomorrow.",
    "Don't forget to call me when you get home.",
    "It's raining outside; we should stay inside.",
    "You should definitely try the chocolate cake; it's delicious!",
    "Could you please pass the salt?",
    "I can't believe how quickly the year has passed.",
    "My dog loves to play fetch. It's his favorite game!",
    "Did you hear about the new movie coming out?",
    "I hope you have a great weekend ahead!",
    "I can't believe I won the prize!",
    "I'm sorry, I didn't mean to interrupt you.",
    "How are you doing? Everything okay?",
    "Can you believe the price of gas these days?",
    "The kids are playing outside, having a great time!",
    "Please make sure to lock the door when you leave.",
    "The dinner party was so much fun, thanks for hosting!",
    "I can't wait to see you later!",
    "What are you doing this weekend?",
    "She said, 'I'll meet you at the park.'",
    "My favorite color is blue; what's yours?",
    "I got a new phone, and it's amazing!",
    "I'm really looking forward to the holiday season.",
    "Are you planning to visit your family for the holidays?",
    "I don't think I can make it to the meeting today.",
    "I love going to the beach, especially in the summer!",
    "That's a great idea, I agree!",
    "She asked, 'Are you coming to the event?'",
    "It's so quiet here, I could hear a pin drop!",
    "I don't understand why that happened, do you?",
    "I'm thinking about going for a run later.",
    "Can you believe how much snow we got?",
    "Did you know that I'm learning to cook?",
    "The teacher said, 'Please be quiet during the exam.'",
    "It's so good to see you after all these years!",
    "I hope you enjoy your vacation!",
    "I'm not sure if I can attend the meeting."
  ]
};

  const loadPrompt = () => {
    currentPrompt =
      prompts[currentMode][Math.floor(Math.random() * prompts[currentMode].length)];
    promptEl.innerHTML = currentPrompt
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
    inputArea.value = "";
    inputArea.disabled = false;
    errorIndices.clear();
    charactersTyped = 0;
    startTime = null;
    updateStats(0, 100);
    completionMessageEl.hidden = true; 
  };

  const calculateWPM = (elapsedTime) => {
    const correctChars = currentPrompt.length - errorIndices.size;
    const wordsTyped = correctChars / 5; 
    return Math.max(0, Math.floor(wordsTyped / elapsedTime));
  };

  const calculateAccuracy = () => {
    const totalChars = currentPrompt.length;
    const incorrectChars = errorIndices.size;
    const correctChars = totalChars - incorrectChars;
    return Math.max(0, Math.floor((correctChars / totalChars) * 100));
  };

  const updateStats = (wpm, accuracy) => {
    wpmEl.textContent = wpm;
    accuracyEl.textContent = `${accuracy}%`;
  };

  inputArea.addEventListener("input", () => {
    if (!startTime) startTime = new Date();

    const userInput = inputArea.value;
    const spans = promptEl.querySelectorAll("span");

    const previouslyIncorrect = new Set([...errorIndices]); 
    errorIndices.clear();
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

    previouslyIncorrect.forEach((index) => errorIndices.add(index));

    charactersTyped = userInput.length;

    const elapsedTime = (new Date() - startTime) / 1000 / 60; 
    const wpm = calculateWPM(elapsedTime);
    const accuracy = calculateAccuracy();

    updateStats(wpm, accuracy);

    if (userInput.length === currentPrompt.length) {
      completionMessageEl.hidden = false; 
      inputArea.disabled = true; 
    }
  });

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
    completionMessageEl.hidden = true; 
  });

  nextButton.addEventListener("click", loadPrompt);

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
  loadPrompt();
});





















