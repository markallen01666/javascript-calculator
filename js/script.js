// Calculator webapp functionality
// M Allen: Freelance Web Developer - 2017

// Array to hold the entered calculation
var currentCalculation = [];

// Update calculator display with current calculation entries or result
function updateDisplay() {
  $("#displayVal").html("<strong>" + currentCalculation.join("") + "<strong>");
}

// Show result and clear down for next calculation
function showResult(result) {
  currentCalculation = [];
  currentCalculation.push(result);
  updateDisplay();
  currentCalculation = [];
}

// Calculate the result
function calculateResult() {
  var calculationResult = 0;
  //Check if first or last entries are erroneous mathematical operators. If so, return error
  switch (currentCalculation[0]) {
    case "/":
    case "x":
      showResult("Error");
      break;
    default:
      switch (currentCalculation[currentCalculation.length - 1]) {
        case "/":
        case "x":
        case "+":
        case "-":
          showResult("Error");
          break;
        default:
          // Sort array for BODMAS
          var finalCalculation = [];
          // Chop unnecessary leading +
          if (currentCalculation[0] == "+") {
            currentCalculation.shift();
          }
          // Handle negative first numbers by adding preceding zero
          if (currentCalculation[0] == "-") {
            currentCalculation.unshift("0");
          }
          // Resolve multiplication and division
          for (i=0; i<currentCalculation.length; i++) {
            switch (currentCalculation[i]) {
              case "/":
                var precedingValue = parseFloat(currentCalculation[i - 1]);
                var followingValue = parseFloat(currentCalculation[i + 1]);
                currentCalculation[i + 1] = precedingValue / followingValue;
                finalCalculation.pop();
                break;
              case "x":
                var precedingValue = parseFloat(currentCalculation[i - 1]);
                var followingValue = parseFloat(currentCalculation[i + 1]);
                currentCalculation[i + 1] = precedingValue * followingValue;
                finalCalculation.pop();
                break;
              case "0":
              case "1":
              case "2":
              case "3":
              case "4":
              case "5":
              case "6":
              case "7":
              case "8":
              case "9":
                finalCalculation.push(parseFloat(currentCalculation[i]));
                break;
              default:
                finalCalculation.push(currentCalculation[i]);
            }
          }
          // Calculate and show the result
          for (i=0; i<finalCalculation.length; i++) {
            switch (finalCalculation[i]) {
              case "+":
                i++;
                calculationResult += finalCalculation[i];
                break;
              case "-":
                i++;
                calculationResult -= finalCalculation[i];
                break;
              default:
                calculationResult += finalCalculation[i];
            }
          }
          showResult(calculationResult);
      }
  }
}

// Enable button functionality when document has loaded
$(document).ready(function() {
  // Restrict numbers to single decimal point
  var pointCount = 0;
  // Button fuctionality
  $(":button").click(function(event){
    switch ($(this).prop("value")) {
      // Number buttons
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        // Append digit to existing number element or add new element after operator
        if (currentCalculation.length !=0) {
          switch (currentCalculation.slice(-1).toString()) {
            case "/":
            case "x":
            case "+":
            case "-":
              currentCalculation.push($(this).prop("value"));
              updateDisplay();
              break;
            default:
              currentCalculation[currentCalculation.length - 1] += $(this).prop("value");
              updateDisplay();
              break;
          }
        } else {
          currentCalculation.push($(this).prop("value"));
          updateDisplay();
        }
        break;
      case ".":
        // Precede initial point with zero if necessary
        if (currentCalculation.length == 0 || isNaN(parseInt(currentCalculation.slice(-1)))) {
          currentCalculation.push("0" + $(this).prop("value"));
          pointCount = 1;
          updateDisplay();
        // Append point to number
        } else if (pointCount == 0) {
          currentCalculation[currentCalculation.length - 1] += $(this).prop("value");
          pointCount = 1;
          updateDisplay();
        }
        break;
      // Mathematical operators
      case "/":
      case "x":
      case "+":
      case "-":
        // Disable entry of two operators in sequence
        switch (currentCalculation.slice(-1)) {
          case "/":
          case "x":
          case "+":
          case "-":
            break;
          default:
            // Add to display and refresh
            currentCalculation.push($(this).prop("value"));
            pointCount = 0;
            updateDisplay();
            break;
        }
        break;
      case "=":
        calculateResult();
        break;
      case "AC":
        showResult(0);
        break;
      case "CE":
        currentCalculation.pop();
        if (currentCalculation.length == 0) {
          showResult(0);
        } else {
          updateDisplay();
        }
        break;
    }
  });
});
