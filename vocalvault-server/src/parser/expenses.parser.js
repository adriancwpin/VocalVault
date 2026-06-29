import wordToNumbers from 'word-to-numbers';

const DECIMAL_PATTERN = /(\d+)\s*point\s*(\d{1,2})\s*(pounds?|quid|£)?/;
const POUNDS_PATTERN = /(\d+)\s*pounds?\s*(\d{1,2})/;
const WHOLE_NUMBER_PATTERN = /(\d+)\s*(pounds?|quid|£)/;

function parseAmount(text) {
    const decimalMatch = text.match(DECIMAL_PATTERN);
    if (decimalMatch) {
        return parseFloat(`${decimalMatch[1]}.${decimalMatch[2]}`);
    }
    const poundsMatch = text.match(POUNDS_PATTERN);
    if (poundsMatch) {
        return parseFloat(`${poundsMatch[1]}.${poundsMatch[2]}`);
    }
    const wholeMatch = text.match(WHOLE_NUMBER_PATTERN);
    if (wholeMatch) {
        return parseFloat(wholeMatch[1]);
    }
    return null;
}

function parseLeftover(text) {
    let leftover = text;
    if (DECIMAL_PATTERN.test(text)) {
        leftover = text.replace(DECIMAL_PATTERN, '');
    } else if (POUNDS_PATTERN.test(text)) {
        leftover = text.replace(POUNDS_PATTERN, '');
    } else if (WHOLE_NUMBER_PATTERN.test(text)) {
        leftover = text.replace(WHOLE_NUMBER_PATTERN, '');
    }
    const fillerWord = ['spent','on', 'for','paid','bought'];

    //strip filler words
    for(const word of fillerWord){
        const pattern = new RegExp(`\\b${word}\\b`, 'gi');
        leftover = leftover.replace(pattern, ''); 
    }
    
    //trim whitespace
    leftover = leftover.replace(/\s+/g, ' ').trim();
    return leftover;
}

function parseExpense(text){
    const normalized = wordToNumbers(text); 
    const amount = parseAmount(normalized);
    const descriptions = parseLeftover(normalized);
    
    return {amount, descriptions};
}

//test
console.log(parseExpense("spent fifteen pounds on coffee"));
//ToDo: 2. Category matching 
//ToDo: 3.combine everything into one parseExpense(transcript) function 
//ToDo: 4. wire to API endpoint and curl it

