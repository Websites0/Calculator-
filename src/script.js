document.addEventListener('DOMContentLoaded', () => {
  const resultInput = document.getElementById('result');
  const keys = document.querySelector('.keys');

  keys.addEventListener('click', (event) => {
    if (!event.target.matches('button')) {
      return;
    }

    const key = event.target;
    const action = key.dataset.action;
    const keyContent = key.textContent;
    const displayedNum = resultInput.value;

    if (!action) {
      if (displayedNum === '0' || resultInput.dataset.previousKeyType === 'operator') {
        resultInput.value = keyContent;
      } else {
        resultInput.value = displayedNum + keyContent;
      }
      resultInput.dataset.previousKeyType = 'number';
    }

    if (
      action === 'add' ||
      action === 'subtract' ||
      action === 'multiply' ||
      action === 'divide'
    ) {
      resultInput.dataset.firstValue = displayedNum;
      resultInput.dataset.operator = action;
      resultInput.dataset.previousKeyType = 'operator';
    }

    if (action === 'decimal') {
      resultInput.value = displayedNum + '.';
      resultInput.dataset.previousKeyType = 'decimal';
    }

    if (action === 'clear') {
      resultInput.value = '';
      resultInput.dataset.previousKeyType = 'clear';
    }

    if (action === 'backspace') {
        resultInput.value = resultInput.value.slice(0, -1);
        resultInput.dataset.previousKeyType = 'backspace';
    }

    if (action === 'calculate') {
        const firstValue = resultInput.dataset.firstValue;
        const operator = resultInput.dataset.operator;
        const secondValue = displayedNum;

        if (firstValue && operator) {
            resultInput.value = calculate(firstValue, operator, secondValue);
        }

        resultInput.dataset.previousKeyType = 'calculate';
    }
  });

  function calculate(n1, operator, n2) {
    let result = '';
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);

    if (operator === 'add') {
      result = num1 + num2;
    } else if (operator === 'subtract') {
      result = num1 - num2;
    } else if (operator === 'multiply') {
      result = num1 * num2;
    } else if (operator === 'divide') {
      result = num1 / num2;
    }

    return result;
  }
});
