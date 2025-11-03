document.addEventListener('DOMContentLoaded', () => {
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
    };

    const updateDisplay = () => {
        const display = document.getElementById('result');
        display.value = calculator.displayValue;
    };

    updateDisplay();

    const keys = document.querySelector('.keys');
    keys.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) {
            return;
        }

        if (target.dataset.action === 'operator') {
            handleOperator(target.textContent);
            updateDisplay();
            return;
        }

        if (target.dataset.action === 'decimal') {
            inputDecimal(target.textContent);
            updateDisplay();
            return;
        }

        if (target.dataset.action === 'clear') {
            resetCalculator();
            updateDisplay();
            return;
        }

        if (target.dataset.action === 'backspace') {
            backspace();
            updateDisplay();
            return;
        }

        if (target.dataset.action === 'calculate') {
            handleOperator('=');
            updateDisplay();
            return;
        }

        inputDigit(target.textContent);
        updateDisplay();
    });

    const inputDigit = (digit) => {
        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    };

    const inputDecimal = (dot) => {
        if (calculator.waitingForSecondOperand === true) {
            calculator.displayValue = '0.';
            calculator.waitingForSecondOperand = false;
            return;
        }

        if (!calculator.displayValue.includes(dot)) {
            calculator.displayValue += dot;
        }
    };

    const handleOperator = (nextOperator) => {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);

        if (operator && calculator.waitingForSecondOperand) {
            calculator.operator = nextOperator;
            return;
        }

        if (firstOperand == null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = performCalculation[operator](firstOperand, inputValue);

            calculator.displayValue = String(result);
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
    };

    const performCalculation = {
        '/': (firstOperand, secondOperand) => {
            if (secondOperand === 0) {
                return 'Error';
            }
            return firstOperand / secondOperand;
        },
        '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
        '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
        '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
        '=': (firstOperand, secondOperand) => secondOperand,
    };

    const resetCalculator = () => {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
    };

    const backspace = () => {
        calculator.displayValue = calculator.displayValue.slice(0, -1);
        if (calculator.displayValue === '') {
            calculator.displayValue = '0';
        }
    };
});
