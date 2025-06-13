const display = document.getElementById("display");
const historyEl = document.getElementById("history-content");
const buttons = document.querySelectorAll(".btn");
const historyContainer = document.getElementById("history");
const toggleHistoryBtn = document.getElementById("toggle-history");
const clearHistoryBtn = document.getElementById("clear-history");


let currentInput = "";
let history = [];
let justEvaluated = false;


function updateDisplay(value) {
  display.textContent = value;
}


function evaluateExpression(expression) {
  try {
    const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**'));
    return result;
  } catch {
    return "Error";
  }
}


function updateHistory(expression, result) {
  history.push(`${expression} = ${result}`);
  historyEl.innerHTML = history.slice(-5).map(item => `<div>${item}</div>`).join("");
}


buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (button.classList.contains("number") || button.classList.contains("dot")) {
      if (justEvaluated) {
        currentInput = value; // Start new input if the last operation after equal to is a number or dot click
      } else {
        currentInput += value;
      }
      justEvaluated = false;
      updateDisplay(currentInput);
    }

    else if (button.classList.contains("operator")) {
      if (justEvaluated) justEvaluated = false; // allow continuation
      currentInput += value;
      updateDisplay(currentInput);
    }

    else if (button.classList.contains("equal")) {
      if (currentInput.trim() === "") return; // <-- Preventing empty evaluation and returning undefined when there is no action on the display and equal to is clicked.

      
      const expression = currentInput;
      const result = evaluateExpression(expression);
      updateDisplay(result);

      if (result !== "Error") {
        updateHistory(expression, result);
        currentInput = result.toString();
        justEvaluated = true;
      } else {
        currentInput = "";
        justEvaluated = false;
      }
    }

    else if (button.classList.contains("clear")) {
      currentInput = "";
      justEvaluated = false;
      updateDisplay(currentInput);
    }

    else if (button.classList.contains("backspace")) {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput);
    }
  });
});


// Adding a toggle history button
toggleHistoryBtn.addEventListener("click", () => {
  historyContainer.classList.toggle("hidden");
});

// Add a clear history button to ensure that the history list does not grow arbitrarilly
clearHistoryBtn.addEventListener("click", () => {
  history = [];
  historyEl.innerHTML = "";
});

// Allowing keyboard input
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key) || ["+", "-", "*", "/", ".", "^", "%"].includes(key)) {
    currentInput += key;
    updateDisplay(currentInput);
  } else if (key === "Enter") {
      if (currentInput.trim() === "") return;  // <-- Skip logging empty inputs in the history.

      const expression = currentInput;
      const result = evaluateExpression(expression);
      updateDisplay(result);
      if (result !== "Error") {
        updateHistory(expression, result);
        currentInput = result.toString();
      } else {
        currentInput = "";
      }
  } else if (key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
  } else if (key.toLowerCase() === "c") {
    currentInput = "";
    updateDisplay(currentInput);
  }
});
