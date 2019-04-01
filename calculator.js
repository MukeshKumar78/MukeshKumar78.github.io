let onScreen = "0";
let answerOfEquation = "0";
let beforeValue = 0;
let afterValue = 0;
let operator = null;
let solutionOfEquation = 0;
let runningTotal = 0;
let answer = 0;

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
  let thirdLastIndex = onScreen[onScreen.length - 3];
  switch (lastIndex) {
    case "+": // signs replace eachother except negative sign
    case "÷":
    case "×":
      // after two signs(including negative) if third sign is pressed then third sign replaces both.
      if (
        containAnySign(secondLastIndex) &&
        containAnySign(thirdLastIndex) === false
      ) {
        onScreen = onScreen.substr(0, onScreen.length - 2) + lastIndex;
        break;
      } else if (
        containAnySign(secondLastIndex) &&
        containAnySign(thirdLastIndex)
      ) {
        onScreen = onScreen.substr(0, onScreen.length - 3) + lastIndex;
      }
      break;
    case "-": // negative sign remain after division and multiplication
      switch (secondLastIndex) {
        case "+":
        case "-": // positive and negative replace negative
          onScreen = onScreen.substr(0, onScreen.length - 2) + lastIndex;
          break;
      }
      break;
  }

  let firstIndex = onScreen[0];
  switch (
    firstIndex // first character should be a number, positive or negative
  ) {
    case "+":
    case "×":
    case "÷":
      onScreen = "0";
      answerOfEquation = "0";
      break;
  }
}

function handleSymbol(value) {
  switch (value) {
    case "C":
      onScreen = "0";
      answerOfEquation = " ";
      beforeValue = 0;
      afterValue = 0;
      operator = null;
      solutionOfEquation = 0;
      runningTotal = 0;
      break;
    case "=":
      // if decimal round it up.
      onScreen = answerOfEquation;
      answer = answerOfEquation;
      answerOfEquation = "";

      break;
    case "←":
      if (onScreen.length === 1) {
        buttonClick("C");
      } else {
        onScreen = onScreen.substring(0, onScreen.length - 1);
      }
      answerOfEquation = "0";
      solveForAnswer(onScreen); // recount answer
      break;
    default:
      return "Symbol Invalid!";
  }
}

function solveForAnswer(equation) {
  // change signs
  for (let i = 0; i < equation.length; i++) {
    if (equation[i] === "×") {
      equation = equation.replaceAt(i, "*");
    } else if (equation[i] === "÷") {
      equation = equation.replaceAt(i, "/");
    }
  }
  equation = removeLastSymbols(equation);
  solveEquation(equation); // change string into number and solve it.
  answerOfEquation = "" + solutionOfEquation;
  return answerOfEquation;
}

function solveEquation(equation) {
  equation = equation.split(""); // split strings and change it into array
  gatherNumbers(equation);
  changeIntoNumbers(equation);
  if (equation.length > 2) {
    // 3 things needed to do math.
    // BODMAS RULE
    division(equation);
    multiplication(equation);
    subtraction(equation);
    addition(equation);
    solutionOfEquation = equation[0]; // store answer from array to a variable.
    return solutionOfEquation;
  } else {
    solutionOfEquation = "0";
  }
}

function gatherNumbers(equation) {
  // because of split join strings that contain numbers.
  for (let i = 0; i < equation.length; i++) {
    if (containAnySign(equation[i]) === false) {
      for (let j = i + 1; j < equation.length; j++) {
        if (containAnySign(equation[j])) {
          break; // if find any sign then break
        } else {
          equation[i] += equation[j];
          equation.splice(j, 1);
          i = 0;
          j = 0;
        }
      }
    }
  }
  if (equation[0] === "-" && equation.length > 1) {
    // turn first number into negative number
    equation[0] += equation[1];
    equation.splice(1, 1);
  }
  for (let i = 0; i < equation.length; i++) {
    // negative sign after multiplication or division remain with number to make it a negative number
    if (equation[i] === "-" && containAnySign(equation[i - 1])) {
      equation[i] += equation[i + 1];
      equation.splice(i + 1, 1);
    }
  }
}

function changeIntoNumbers(equation) {
  // change strings into numbers except symbols
  for (let i = 0; i < equation.length; i++) {
    if (containAnySign(equation[i]) === false) {
      equation[i] = Number(equation[i]);
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

function containAnySign(sign) {
  switch (sign) {
    case "+":
    case "-":
    case "÷":
    case "×":
    case "*":
    case "/":
      return true;
    default:
      return false;
  }
}

function removeLastSymbols(equation) {
  // remove last symbol if any
  let lastIndex = equation[equation.length - 1];
  for (let i = 0; i < equation.length; i++) {
    if (containAnySign(lastIndex)) {
      equation = equation.slice(0, -1);
      lastIndex = equation[equation.length - 1];
      i = 0;
    }
  }
  return equation;
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
