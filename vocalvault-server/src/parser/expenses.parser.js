import 'dotenv/config'; //because there is access to our category db
import wordToNumbers from 'word-to-numbers';
import { getAllCategories } from '../models/category.model.js';
 
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

function categoryMatching(leftoverText, categories){
    //split the leftover text into individual words
    const text = leftoverText.toLowerCase().split(/\s+/);
    //loop through the categories 
    for (const category of categories){
        for(const word of text){
            if(category.keywords.includes(word)){
                return category;
            }
        }
    }
    return null; 
    //see which word fall into which category
    //return the matching category (else null)
    //
}

async function parseExpense(text){
    const normalized = wordToNumbers(text); 
    const amount = parseAmount(normalized);
    const descriptions = parseLeftover(normalized);
    //category matching 
    const categories = await getAllCategories();
    const matchedCategory = categoryMatching(descriptions, categories);
    const categoryId = matchedCategory ? matchedCategory.id : null;
    const categoryName = matchedCategory ? matchedCategory.name : null;

    return {
        amount, 
        descriptions,
        categoryId,
        categoryName,
        rawText: text
    };
}

const result = await parseExpense("spent fifteen pounds on coffee");
console.log(result);
//ToDo: 4. wire to API endpoint and curl it

