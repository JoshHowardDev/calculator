const divide = (a, b) => a / b;
const multiply = (a, b) => a * b;
const subtract = (a, b) => a - b;
const add = (a, b) => a + b;

const numbers = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
    zero: '0',
    decimal: '.',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    '0': '0',
    '.': '.',
}

const operators = {
    divide: '/',
    multiply: '*',
    subtract: '-',
    add: '+',
    '/': '/',
    '*': '*',
    '-': '-',
    '+': '+',    
}

const displayBox = document.querySelector('.display');
const numberButtons = document.querySelectorAll('.num')
const operatorButtons = document.querySelectorAll('.operator')
const clearBtn = document.querySelector('#clearBtn')
const deleteBtn = document.querySelector('#deleteBtn')
const equalsBtn = document.querySelector('#equals')

let operand1 = '';
let operand1Reset = false;
let operand1Decimal = false;
let operand2 = '';
let operand2Decimal = false;
let operator = '';
let lastEdit = '';

function operate(num1, num2, operatorOption) {
    let evaluation;
    switch(operatorOption) {
        case 'divide':
            evaluation = divide(num1, num2);
            break;
        case 'multiply':
            evaluation = multiply(num1, num2);
            break;
        case 'subtract': 
            evaluation = subtract(num1, num2);
            break;
        case 'add':
            evaluation = add(num1, num2);
            break;            
    }

    if (evaluation === Infinity) {

    }

    return Math.round(evaluation * 10000000) / 10000000;
}   

function processInput(input) {

    if (input.key) {
        input = input.key.toString();
    } else {
        input = this.id.toString();
    }

    //Adjust for duplicate decimals
    if (input === "." || input === "Period") {
        if (operator) {
            if (operand2Decimal) {
                input = '';
            } else {
                operand2Decimal = true;
            }
        } else {
            if (operand1Decimal) {
                input = ''
            } else {
                operand1Decimal = true;
            }
        }
    }

    //If input is a number
    if (input in numbers) {
        if (!operator) {
            if (operand1Reset) {
                operand1 = numbers[input]
                operand1Reset = false;
            } else {
                operand1 = operand1 + numbers[input]
            }
            lastEdit = 'operand1'
            
        } else {
            operand2 = operand2 + numbers[input]
            lastEdit = 'operand2'
        }
    }

    //If input is an operator
    if (input in operators) {

        //If there is no operand1, do nothing
        if (operand1) {
            
            //If there is already an operand2, complete the operation and set the result to operand1
            if (operand2) {
                operand1 = operate(Number(operand1), Number(operand2), operator).toString();
                operand2 = '';
            }

            //Set operator to the word, not the symbol
            if (input.length < 2) {
                operator = Object.keys(operators).find(key => operators[key] === input)
            } else {
                operator = input
            }            
            
            //Reset operand1Reset to default
            operand1Reset = false;
            lastEdit = 'operator'

        }
    }

    //If input was equals
    if (input === 'equals' || input === '=' || input === 'Enter') {
        if (operand2) {
            operand1 = operate(Number(operand1), Number(operand2), operator).toString();
            operator = '';
            operand2 = '';
            operand1Decimal = false;
            operand2Decimal = false;
            operand1Reset = true;
        } else {
            operator = ''
        }
    }

    //If input was backspace or delete, call deleteLastEdit
    if (input === 'Backspace' || input === 'Delete') {
        deleteLastEdit();
    }

    populateDisplay();

}

function populateDisplay() {

    //Update display variable
    let displayContent = `${operand1}${(operator) ? ' ' + operators[operator] : ''}${(operand2) ? ' ' : ''}${operand2}`;
    //If operators and operands are empty, change dipslay to 0
    if (displayContent) {
        displayBox.textContent = displayContent;
    } else {
        displayBox.textContent = '0';
    }
}

function clearCalculator() {
    operand1 = ''
    operand2 = ''
    operator = ''
    operand1Reset = false;
    lastEdit = ''
    operand1Decimal = false;
    operand2Decimal = false;
    equalsBtn.focus();
    populateDisplay();
}

function deleteLastEdit() {
    switch(lastEdit) {
        case 'operand1':
            operand1 = operand1.slice(0, operand1.length - 1);
            break;
        case 'operand2':
            operand2 = operand2.slice(1);
            break;
        case 'operator':
            operator = ''
            break;
    }
    populateDisplay();
}

numberButtons.forEach(button => button.addEventListener('click', processInput));
operatorButtons.forEach(button => button.addEventListener('click', processInput));
document.addEventListener('keydown', (e) => processInput(e));
clearBtn.addEventListener('click', clearCalculator)
deleteBtn.addEventListener('click', deleteLastEdit)
equalsBtn.addEventListener('click', processInput);