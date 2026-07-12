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
            handleOperator(target.dataset.value);
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

        if (target.dataset.action === 'negate') {
            negate();
            updateDisplay();
            return;
        }

        if (target.dataset.action === 'percentage') {
            percentage();
            updateDisplay();
            return;
        }

        inputDigit(target.textContent);
        updateDisplay();
    });

    const inputDigit = (digit) => {
        if (calculator.displayValue === 'Error') {
            resetCalculator();
        }

        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    };

    const inputDecimal = (dot) => {
        if (calculator.displayValue === 'Error') {
            resetCalculator();
        }

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
        if (calculator.displayValue === 'Error') {
            return; // Ignore operators if in error state
        }

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
            calculator.firstOperand = result === 'Error' ? null : result;
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
        if (calculator.displayValue === 'Error') {
            resetCalculator();
            return;
        }

        if (calculator.waitingForSecondOperand) {
            return;
        }

        calculator.displayValue = calculator.displayValue.slice(0, -1);
        if (calculator.displayValue === '' || calculator.displayValue === '-') {
            calculator.displayValue = '0';
        }
    };

    const negate = () => {
        if (calculator.displayValue === 'Error') return;

        const currentValue = parseFloat(calculator.displayValue);
        if (currentValue === 0) return; // Don't negate 0

        calculator.displayValue = String(currentValue * -1);
    };

    const percentage = () => {
        if (calculator.displayValue === 'Error') return;

        const currentValue = parseFloat(calculator.displayValue);
        calculator.displayValue = String(currentValue / 100);
    };
    // --- Tab Switching Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const calcViews = document.querySelectorAll('.calc-view');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs and views
            tabBtns.forEach(b => b.classList.remove('active'));
            calcViews.forEach(v => v.classList.remove('active'));

            // Add active class to clicked tab and corresponding view
            btn.classList.add('active');
            const targetId = btn.dataset.target;
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Age Calculator Logic ---
    const toggleDateModeBtn = document.getElementById('toggle-date-mode');
    const datePickerGroup = document.getElementById('date-picker-group');
    const manualDateGroup = document.getElementById('manual-date-group');
    let isManualMode = false;

    toggleDateModeBtn.addEventListener('click', () => {
        isManualMode = !isManualMode;
        if (isManualMode) {
            datePickerGroup.style.display = 'none';
            manualDateGroup.style.display = 'block';
            toggleDateModeBtn.textContent = 'Date Picker';
        } else {
            datePickerGroup.style.display = 'block';
            manualDateGroup.style.display = 'none';
            toggleDateModeBtn.textContent = 'Manual Entry';
        }
    });

    const calculateAgeBtn = document.getElementById('calculate-age-btn');
    const dobInput = document.getElementById('dob');
    const dobDayInput = document.getElementById('dob-day');
    const dobMonthInput = document.getElementById('dob-month');
    const dobYearInput = document.getElementById('dob-year');
    const ageResult = document.getElementById('age-result');

    const isValidDate = (year, month, day) => {
        const d = new Date(year, month - 1, day);
        return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
    };

    calculateAgeBtn.addEventListener('click', () => {
        let dob;

        if (isManualMode) {
            const day = parseInt(dobDayInput.value, 10);
            const month = parseInt(dobMonthInput.value, 10);
            const year = parseInt(dobYearInput.value, 10);

            if (isNaN(day) || isNaN(month) || isNaN(year) || !isValidDate(year, month, day)) {
                ageResult.innerHTML = '<div class="age-placeholder" style="color: #ffbaba;">Please enter a valid date</div>';
                return;
            }
            dob = new Date(year, month - 1, day);
        } else {
            const dobValue = dobInput.value;
            if (!dobValue) {
                ageResult.innerHTML = '<div class="age-placeholder" style="color: #ffbaba;">Please select a valid date</div>';
                return;
            }
            dob = new Date(dobValue);
        }

        const today = new Date();

        if (dob > today) {
            ageResult.innerHTML = '<div class="age-placeholder" style="color: #ffbaba;">Date of birth cannot be in the future</div>';
            return;
        }

        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        let days = today.getDate() - dob.getDate();

        // Adjust for negative days
        if (days < 0) {
            months--;
            // Get the number of days in the previous month
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }

        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }

        ageResult.innerHTML = `
            <div class="age-value">${years} Years</div>
            <div class="age-details">${months} Months | ${days} Days</div>
        `;
    });
});
