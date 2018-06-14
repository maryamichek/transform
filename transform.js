'use strict';

function sum(a, b) {
    if (!isString(a) || !isString(b)) {
        throw new Error('Wrong argument type in sum');
    }
    return a + b;
}

function mul(a, b) {
    let str, num;

    if (!isNaN(a) && isString(b)) {
        str = b;
        num = +a;
    } else if (!isNaN(b) && isString(a)) {
        str = a;
        num = +b;
    } else {
        throw new Error('Wrong argument type in mul');
    }

    return new Array(num + 1).join(str);
}

function sub(a, b) {
    if (!isString(a) || !isString(b)) {
        throw new Error('Wrong argument type in sub');
    } else if (a.length != 1 || b.length !=1) {
        throw new Error('Wrong argument length in sub');
    }
    let alphabet = 'abcdefjhigklmnopqrstuvwxyz';

    let position1 = alphabet.indexOf(a);
    let position2 = alphabet.indexOf(b);
    let sub = position1 - position2;

    if (sub == 0) {
        throw new Error('Wrong argument value in sub');
    }
    if (sub > 0) return alphabet[sub - 1];
    return alphabet[alphabet.length + sub];
}

function isString(str) {
    return  (typeof str == 'string' || (typeof str == 'object' && str.constructor == String)) && isNaN(parseInt(str));
}

function rpn(input) {
    input = input.replace(/\s/g,'');
    let output  = [];
    let stack = [];
    let operators = new Map([
        ['*', '2'],
        ['+', '1'],
        ['-', '1'],
        ['(', '0'],
        [')', '0']
    ]);

    for (let i = 0; i < input.length; i++) {
        if (operators.has(input[i])) {
            if (input[i] == ')') {
                let start = stack.lastIndexOf('(');
                let elemsToOutput = stack.splice(start);
                elemsToOutput.reverse().pop();
                output = output.concat(elemsToOutput);
            } else {
                if (input[i] != '(') {
                    while (operators.get(input[i]) <= operators.get(stack[stack.length - 1])) {
                        output.push(stack.pop());
                    }
                }
                stack.push(input[i]);
            }
        } else {
            if (i == 0 || operators.has(input[i - 1])) {
                output.push(input[i]);
            }
            else {
                output[output.length - 1] += input[i];
            }
        }
    }

    output = output.concat(stack.reverse());
    return output;
}

function execute(input) {
    let operations = new Map([
        ['+', sum],
        ['-', sub],
        ['*', mul]
    ]);

    let operationsArr = ['+', '-', '*'];

    function isHaveOperation(item) {
        return operationsArr.indexOf(item) > -1;
    }

    while (input.some(isHaveOperation)) {
        for (let i = 0; i < input.length; i++) {
            if (operationsArr.indexOf(input[i]) > -1) {
                input.splice(i - 2, 3, operations.get(input[i])(input[i - 2].toLowerCase(), input[i - 1].toLowerCase()));
                break;
            }
        }
    }

    return input.join('');
}

function doEvaluation(input) {
    try {
        return execute(rpn(input));
    } catch (e) {
        console.log(e.message);
    }
}

console.log('a+(b-c)*2 =', doEvaluation('a+(b-c)*2'));
console.log('ad+(b-c)*3 =', doEvaluation('ad+(b-c)*3'));
console.log('ad*2+(b-c)*3 =', doEvaluation('ad*2+(b-c)*3'));
console.log('a+b*2+bc =', doEvaluation('a+b*2+bc'));
console.log('b-v+am+nn*2 =', doEvaluation('b-v+am+nn*2'));

