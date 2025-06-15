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

// Function to evaluate operations
function evaluateExpression(expression) {
  try {
    const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**'));
    return result;
  } catch {
    return "Error";
  }
}

// Calculate percentages
function calculatePercentage(value) {
  const num = parseFloat(value);
  return isNaN(num) ? "Error" : (num / 100).toString();
}

// Function to handle history generation
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
      if (justEvaluated) justEvaluated = false;
      if (value === '%') {
        const result = calculatePercentage(currentInput);
        if (result !== "Error") {
          currentInput = result;
          updateHistory(currentInput + '%', result);
        } else {
          currentInput = "";
        }
      } else {
        currentInput += value;
      }
      updateDisplay(currentInput);
    }

    else if (button.classList.contains("equal")) {
      if (currentInput.trim() === "") return; // Prevent empty evaluation and returning of undefined when there is no action on the display and equal to is clicked.

      
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



// Allow keyboard input
document.addEventListener("keydown", (e) => {
  const key = e.key;

  
  if (!isNaN(key) || ["+", "-", "*", "/", ".", "^"].includes(key)) {
    if (justEvaluated && !isNaN(key)) {
      currentInput = key; // Start new input if last operation was evaluated
    } else {
      currentInput += key;
    }
    justEvaluated = false;
    updateDisplay(currentInput);
  } 
  else if (key === "%") {
    const result = calculatePercentage(currentInput);
    if (result !== "Error") {
      currentInput = result;
      updateHistory(currentInput + '%', result);
      updateDisplay(currentInput);
      justEvaluated = true;
    }
  } 
  else if (key === "Enter") {
    if (currentInput.trim() === "") return;

    const expression = currentInput;
    const result = evaluateExpression(expression);

    // updateDisplay(result) for keyboard events;
    if (result !== "Error") {
      updateHistory(expression, result);
      currentInput = result.toString();
      justEvaluated = true;
      updateDisplay(currentInput);
    } else {
      currentInput = "";
      justEvaluated = false;
      updateDisplay("Error");
    }
    e.preventDefault(); // Prevent default Enter behavior

  } 
  else if (key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
    justEvaluated = false;
  } 
  else if (key.toLowerCase() === "c") {
    currentInput = "";
    updateDisplay(currentInput);
    justEvaluated = false;
  }
});






