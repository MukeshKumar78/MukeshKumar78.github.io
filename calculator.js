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
    case "-": // negative only remain with division and multiplication
      switch (secondLastIndex) {
        case "+":
        case "-":
          onScreen = onScreen.substr(0, onScreen.length - 2) + lastIndex; // positive and negative replace negative
          break;
      }
      break;
    case "+": // signs replace eacahother except negative sign
    case "÷":
    case "×":
      if (containAnySign(secondLastIndex)) {
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
      answerOfEquation = " ";
      beforeValue = 0;
      afterValue = 0;
      operator = null;
      solutionOfEquation = 0;
      runningTotal = 0;
      break;
    case "=":
      // if decimal round it up.
      // onScreen = Number(answerOfEquation).toFixed(0) + "";
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
      return "Symbol Invalid!";
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
  if (containAnySign(lastIndex)) {
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
  if (equation.length > 2) {
    // 3 things needed to do math.
    // BODMAS RULE
    division(equation);
    multiplication(equation);
    subtraction(equation);
    addition(equation);
    solutionOfEquation = equation[0]; // store answer from array to a variable.
    return solutionOfEquation;
  }
}

function gatherNumbers(equation) {
  // because of split join strings that contain numbers.
  console.log(equation);
  for (let i = 0; i < equation.length; i++) {
    console.log(equation);
    if (containAnySign(equation[i]) === false) {
      console.log(equation);
      for (let j = i + 1; j < equation.length; j++) {
        console.log(equation);
        if (containAnySign(equation[j])) {
          console.log(equation);
          break; // if find any sign then break
        } else {
          console.log(equation);
          equation[i] += equation[j];
          console.log(equation);
          equation.splice(j, 1);
          console.log(equation);
          i = 0;
          j = 0;
          console.log(equation);
        }
      }
    }
  }
  console.log(equation);
  if (equation[0] === "-" && equation.length > 1) {
    // turn first number into negative number
    equation[0] += equation[1];
    console.log(equation);
    equation.splice(1, 1);
    console.log(equation);
  }
  console.log(equation);
  for (let i = 0; i < equation.length; i++) {
    //
    if (equation[i] === "-" && containAnySign(equation[i - 1])) {
      equation[i] += equation[i + 1];
    }
  }
  return equation;
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
