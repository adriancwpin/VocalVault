import wordToNumbers from 'word-to-numbers';

//focus more on only numeric no decimal for now
function parseAmount(text){
    const decimalPattern = /(\d+)\s*point\s*(\d{1,2})/;
    const poundsPattern = /(\d+)\s*pounds?\s*(\d{1,2})/;
    const wholeNumberPattern = /(\d+)\s*(pounds?|quid|£)/;

    const decimalMatch = text.match(decimalPattern);
    if (decimalMatch) {
        return parseFloat(`${decimalMatch[1]}.${decimalMatch[2]}`);
    }

    const poundsMatch = text.match(poundsPattern);
    if (poundsMatch) {
        return parseFloat(`${poundsMatch[1]}.${poundsMatch[2]}`);
    }

    const wholeMatch = text.match(wholeNumberPattern);
    if (wholeMatch) {
        return parseFloat(wholeMatch[1]);
    }

    return null;
}

//test case
console.log(parseAmount("spent 10 point 50 pounds on coffee"));  // expect 10.5
console.log(parseAmount("spent 10 pounds 50 on coffee"));        // expect 10.5
console.log(parseAmount("spent 15 pounds on coffee"));           // expect 15
console.log(parseAmount("just saying hello"));                   // expect null

//ToDo: separate the number from the text and filter the category
function parseLeftover(text){
    const leftover = text.replace(/\d+\s*(pounds?|quid|£)/, '');
    //ToDo: deal with the filtering text part tmr 
    return leftover;
}

console.log(parseLeftover("spent 15 pounds on coffee"));

//ToDo: 1. finish filler word stripping and whitespace cleanup (edge cases)
//ToDo: 2. Category matching 
//ToDo: 3.combine everything into one parseExpense(transcript) function 
//ToDo: 4. wire to API endpoint and curl it
