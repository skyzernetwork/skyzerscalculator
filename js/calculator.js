const display = document.getElementById("calculatorDisplay");
const buttons = document.querySelectorAll(".calculator_button");

let currentValue = "0";
let previousValue = null;
let operator = null;
let waitingForNext = false;      // 👈 MUST be false
let lastOperation = null;
let lastActionWasEquals = false; // 👈 MUST be false

function updateDisplay() {
    display.value = currentValue;
    updateClearButton();
}

function updateClearButton() {
    const clearBtn = document.querySelector('[data-action="clear"]');
    clearBtn.textContent = currentValue === "0" ? "AC" : "C";
}

function inputNumber(num) {
    if (waitingForNext || lastActionWasEquals) {
        currentValue = num;
        waitingForNext = false;
        lastActionWasEquals = false;
    } else {
        currentValue = currentValue === "0" ? num : currentValue + num;
    }
}

function inputDecimal() {
    if (!currentValue.includes(".")) {
        currentValue += ".";
    }
}

function clearCalculator() {
    if (currentValue !== "0") {
        currentValue = "0";
    } else {
        currentValue = "0";
        previousValue = null;
        operator = null;
        waitingForNext = false;
        lastOperation = null;
        lastActionWasEquals = false;
        clearOperatorHighlight();
    }
}

function toggleSign() {
    if (currentValue !== "0") {
        currentValue = (parseFloat(currentValue) * -1).toString();
    }
}

function percent() {
    currentValue = (parseFloat(currentValue) / 100).toString();
}

function setOperator(op) {
    if (operator && !waitingForNext) {
        calculate();
    }

    previousValue = currentValue;
    operator = op;
    waitingForNext = true;
    lastActionWasEquals = false;
}

function calculate() {
    if (!operator || previousValue === null) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);

    let result;

    switch (operator) {
        case "+":
            result = prev + current;
            break;
        case "-":
            result = prev - current;
            break;
        case "×":
            result = prev * current;
            break;
        case "÷":
            result = current === 0 ? 0 : prev / current;
            break;
    }

    lastOperation = { operator, value: current };
    currentValue = result.toString();

    operator = null;
    previousValue = null;
    waitingForNext = false;        // 👈 important
    lastActionWasEquals = true;    // 👈 new
}

function repeatLast() {
    if (!lastOperation) return;

    const current = parseFloat(currentValue);

    switch (lastOperation.operator) {
        case "+":
            currentValue = (current + lastOperation.value).toString();
            break;
        case "-":
            currentValue = (current - lastOperation.value).toString();
            break;
        case "×":
            currentValue = (current * lastOperation.value).toString();
            break;
        case "÷":
            currentValue = (current / lastOperation.value).toString();
            break;
    }
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const number = button.dataset.number;
        const action = button.dataset.action;
        const op = button.dataset.operator;

        if (number) inputNumber(number);
        else if (action === "decimal") inputDecimal();
        else if (action === "delete") backspace();
        else if (action === "clear") clearCalculator();
        else if (action === "plusminus") toggleSign();
        else if (action === "percent") percent();
        else if (op) setOperator(op);
        else if (action === "equals") {
            operator ? calculate() : repeatLast();
        }

        updateDisplay();
    });
});

function backspace() {
    if (waitingForNext) return;

    if (currentValue.length > 1) {
        currentValue = currentValue.slice(0, -1);
    } else {
        currentValue = "0";
    }

    lastActionWasEquals = false;
}

document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") {
        inputNumber(e.key);
    }

    if (e.key === ".") inputDecimal();

    if (e.key === "Backspace") backspace();

    if (e.key === "Enter" || e.key === "=") {
        operator ? calculate() : repeatLast();
    }

    if (e.key === "+") setOperator("+");
    if (e.key === "-") setOperator("-");
    if (e.key === "*") setOperator("×");
    if (e.key === "/") setOperator("÷");

    updateDisplay();
});

updateDisplay();