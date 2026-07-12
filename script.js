document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Switching Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const calcViews = document.querySelectorAll('.calc-view');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            calcViews.forEach(v => v.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.dataset.target;
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Scientific Calculator Logic ---
    let expression = '';
    const expressionDisplay = document.getElementById('expression');
    const resultDisplay = document.getElementById('result');
    const angleUnitSelect = document.getElementById('angle-unit');

    const updateDisplay = (isError = false) => {
        expressionDisplay.textContent = expression;
        if (isError) {
            resultDisplay.value = 'Error';
        }
    };

    const calculate = () => {
        if (!expression) return;
        try {
            let evalExpr = expression.replace(/%/g, '/100');
            let scope = {};

            if (angleUnitSelect.value === 'deg') {
                const toRad = (deg) => deg * (Math.PI / 180);
                scope = {
                    sin: (x) => math.sin(toRad(x)),
                    cos: (x) => math.cos(toRad(x)),
                    tan: (x) => math.tan(toRad(x))
                };
            }

            const result = math.evaluate(evalExpr, scope);

            if (result === undefined || result === null || isNaN(result)) {
                 updateDisplay(true);
            } else {
                 resultDisplay.value = math.format(result, { precision: 14 });
            }
        } catch (e) {
            updateDisplay(true);
        }
    };

    const keys = document.querySelector('.scientific-keys');
    keys.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) return;

        const action = target.dataset.action;
        const value = target.dataset.value;

        if (resultDisplay.value === 'Error') {
             expression = '';
             resultDisplay.value = '0';
        }

        if (action === 'clear') {
            expression = '';
            resultDisplay.value = '0';
            updateDisplay();
            return;
        }

        if (action === 'backspace') {
            expression = expression.slice(0, -1);
            if (expression === '') {
                resultDisplay.value = '0';
            }
            updateDisplay();
            return;
        }

        if (action === 'calculate') {
            calculate();
            return;
        }

        if (action === 'append') {
            expression += value;
            updateDisplay();
            return;
        }
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

        if (days < 0) {
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += prevMonth.getDate();
        }

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
