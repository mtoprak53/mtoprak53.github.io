const calc = document.getElementById('calc');
const screen = document.getElementById('screen');
const buttons = document.getElementById('buttons');
let currentTotal = 0;
let currentOperator = '';
let afterOp = false;

buttons.addEventListener('click', (e) => {
    const buttonValue = e.target.id;

    if (Number.isInteger(+buttonValue)) {
        if (afterOp) {
            screen.innerText = '0';
            afterOp = false;
        }
        if (screen.innerText.length < 8) {
            screen.innerText = +screen.innerText * 10 + (+buttonValue);
        }
    }
    else if (buttonValue !== 'equals' && buttonValue !== 'C') {
        if (currentOperator) {
            // console.log(currentTotal, currentOperator, screen.innerText);
            currentTotal = operations[currentOperator](currentTotal, +screen.innerText);
            screen.innerText = trimmer(currentTotal);
        }
        // is operation button but not equals
        afterOp = true
        currentTotal = +screen.innerText;
        currentOperator = buttonValue;
    }
    else if (buttonValue === 'equals' && currentOperator) {
        // is equals
        // console.log(currentTotal, currentOperator, screen.innerText);
        currentTotal = operations[currentOperator](currentTotal, +screen.innerText);
        screen.innerText = trimmer(currentTotal);
    }
    else {
        // is clear
        currentTotal = 0;
        currentOperator = '';
        screen.innerText = '0';
        // console.log(currentTotal, currentOperator, screen.innerText);
    }
})

const operations = {
    'add': (num1, num2) => num1 + num2,
    'subtract': (num1, num2) => num1 - num2,
    'divide': (num1, num2) => num1 / num2,
    'multiply': (num1, num2) => num1 * num2,
}

function trimmer(currentTotal){
    const leftSide = Math.floor(currentTotal);
    const rightSide = currentTotal - leftSide;
    const leftDigits = leftSide.toString().length;

    console.log(leftSide, rightSide, leftDigits);
    if (leftDigits > 8) {

        currentTotal = 0;
        currentOperator = '';
        afterOp = false;
        return "ERR";
    }            
    else {
        const rightDigitsPower = 10 ** (8 - leftDigits);
        const trimmedRightSide = Math.floor(rightDigitsPower * rightSide) / rightDigitsPower;
        return leftSide + trimmedRightSide;
    }
}