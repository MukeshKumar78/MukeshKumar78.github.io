let onScreen = "0";
let answerOfEquation = "0";
let beforeValue = 0;
let afterValue = 0;
let operator = null;
let solutionOfEquation = 0;
let runningTotal = 0;

const CALC_SCREEN = document.querySelector(".calc-screen");
const SCREEN = document.querySelector(".screen");
document
  .querySelector(".calc-buttons")
  .addEventListener("click", function(event) {
    buttonClick(event.target.innerText);
  });

function buttonClick(value) {
  if (value !== "C" && value !== "=" && value !== "←") {
    storeEverything(value);
    display();
    solveForAnswer(onScreen);
  } else {
    handleSymbol(value);
  }
  display();
}

function storeEverything(value) {
  if (onScreen === "0") {
    onScreen = value;
  } else {
    onScreen += value;
  }
  let lastIndex = onScreen[onScreen.length - 1];
  let secondLastIndex = onScreen[onScreen.length - 2];
  let firstIndex = onScreen[0];

  switch (lastIndex) {
    case "+":
    case "-": // signs replace eachother
    case "÷":
    case "×":
      switch (secondLastIndex) {
        case "+":
        case "-":
        case "÷":
        case "×":
          onScreen = onScreen.substr(0, onScreen.length - 2) + lastIndex;
          break;
      }
      break;
  }
  switch (firstIndex) {
    case "+":
    case "×":
    case "÷":
      onScreen = "0";
      answerOfEquation = "0";
  }
}

function handleSymbol(value) {
  switch (value) {
    case "C":
      onScreen = "0";
      answerOfEquation = "0";
      beforeValue = 0;
      afterValue = 0;
      operator = null;
      solutionOfEquation = 0;
      runningTotal = 0;
      break;
    case "=":
      onScreen = answerOfEquation;
      answerOfEquation = "";
      break;
    case "←":
      if (onScreen.length === 1) {
        onScreen = "0";
      } else {
        onScreen = onScreen.substring(0, onScreen.length - 1);
      }
      solveForAnswer(onScreen); // recount answer
      break;
    default:
      console.log("Symbol invalid!");
      break;
  }
}

function solveForAnswer(equation) {
  let lastIndex = equation[equation.length - 1];

  for (let i = 0; i < equation.length; i++) {
    // change signs
    if (equation[i] === "×") {
      equation = equation.replaceAt(i, "*");
    } else if (equation[i] === "÷") {
      equation = equation.replaceAt(i, "/");
    }
  }

  // remove last sign if any
  if (
    lastIndex === "×" ||
    lastIndex === "÷" ||
    lastIndex === "+" ||
    lastIndex === "-"
  ) {
    equation = equation.slice(0, -1);
  }
  solveEquation(equation); // change string into number and solve it.
  answerOfEquation = "" + solutionOfEquation;
  return answerOfEquation;
}

function solveEquation(equation) {
  equation = equation.split(""); // split strings and change it into array
  gatherNumbers(equation);
  changeIntoNumbers(equation);
  // BODMAS RULE
  division(equation);
  multiplication(equation);
  subtraction(equation);
  addition(equation);
  solutionOfEquation = equation[0]; // store answer from array to a variable.
  return solutionOfEquation;
}

function gatherNumbers(equation) {
  // because of split. Turn different strings(numbers) into one.
  for (let i = 0; i < equation.length; i++) {
    if (
      equation[i] !== "*" &&
      equation[i] !== "/" &&
      equation[i] !== "+" &&
      equation[i] !== "-"
    ) {
      for (let j = i + 1; j < equation.length; j++) {
        if (
          equation[j] === "*" ||
          equation[j] === "/" ||
          equation[j] === "+" ||
          equation[j] === "-"
        ) {
          break;
        } else {
          equation[i] += equation[j];
          equation.splice(j, 1);
          i = 0;
          j = 0;
        }
      }
    }
  }
  if (equation[0] === "-" && equation.length > 1) { // turn first number into negative  
    equation[0] += equation[1];
    equation.splice(1, 1);
  }
  return equation;
}

function changeIntoNumbers(equation) {
  // change strings into numbers except symbols
  for (let i = 0; i < equation.length; i++) {
    if (isNaN(parseInt(equation[i]))) {
    } else {
      equation[i] = parseInt(equation[i]);
    }
  }
}

function division(equation) {
  // do all division operations and return value
  for (let i = 0; i < equation.length; i++) {
    if (equation[i] === "/") {
      beforeValue = equation[i - 1];
      afterValue = equation[i + 1];
      operator = "/";
      doMath(beforeValue, operator, afterValue);
      equation.splice(i - 1, 1);
      equation.splice(i, 1);
      equation[i - 1] = runningTotal;
      i = 0;
    }
  }
}

function multiplication(equation) {
  // do all multiplication operations and return value
  for (let i = 0; i < equation.length; i++) {
    if (equation[i] === "*") {
      beforeValue = equation[i - 1];
      afterValue = equation[i + 1];
      operator = "*";
      doMath(beforeValue, operator, afterValue);
      equation.splice(i - 1, 1);
      equation.splice(i, 1);
      equation[i - 1] = runningTotal;
      i = 0;
    }
  }
}

function addition(equation) {
  // do all addition operations and return value
  for (let i = 0; i < equation.length; i++) {
    if (equation[i] === "+") {
      beforeValue = equation[i - 1];
      afterValue = equation[i + 1];
      operator = "+";
      doMath(beforeValue, operator, afterValue);
      equation.splice(i - 1, 1);
      equation.splice(i, 1);
      equation[i - 1] = runningTotal;
      i = 0;
    }
  }
}

function subtraction(equation) {
  // do all subtraction operations and return value
  for (let i = 0; i < equation.length; i++) {
    if (equation[i] === "-") {
      beforeValue = equation[i - 1];
      afterValue = equation[i + 1];
      operator = "-";
      doMath(beforeValue, operator, afterValue);
      equation.splice(i - 1, 1);
      equation.splice(i, 1);
      equation[i - 1] = runningTotal;
      i = 0;
    }
  }
}

function doMath(a, sign, b) {
  if (sign === "/") {
    runningTotal = a / b;
  } else if (sign === "*") {
    runningTotal = a * b;
  } else if (sign === "+") {
    runningTotal = a + b;
  } else if (sign === "-") {
    runningTotal = a - b;
  }
  return runningTotal;
}

function display() {
  CALC_SCREEN.innerText = onScreen;
  SCREEN.innerText = answerOfEquation;
}

// define replaceAt function
String.prototype.replaceAt = function(index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};
