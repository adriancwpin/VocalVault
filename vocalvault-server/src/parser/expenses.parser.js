import 'dotenv/config'; //because there is access to our category db
import wordToNumbers from 'word-to-numbers';
import { getAllCategories } from '../models/category.model.js';

const DOT_DECIMAL_PATTERN = /£?\s*(\d+)\.(\d{1,2})\b/;
const POINT_DECIMAL_PATTERN = /£?\s*(\d+)\s*point\s*(\d{1,2})\b/i;
const POUNDS_DECIMAL_PATTERN = /(\d+)\s*pounds?\s*(\d{1,2})\b/i;
const SYMBOL_WHOLE_PATTERN = /£\s*(\d+)\b/;
const WORD_WHOLE_PATTERN = /(\d+)\s*(pounds?|quid|£)\b/i;

function parseAmount(text) {
    let match;
    if ((match = text.match(DOT_DECIMAL_PATTERN))) {
        return parseFloat(`${match[1]}.${match[2]}`);
    }
    if ((match = text.match(POINT_DECIMAL_PATTERN))) {
        return parseFloat(`${match[1]}.${match[2]}`);
    }
    if ((match = text.match(POUNDS_DECIMAL_PATTERN))) {
        return parseFloat(`${match[1]}.${match[2]}`);
    }
    if ((match = text.match(SYMBOL_WHOLE_PATTERN))) {
        return parseFloat(match[1]);
    }
    if ((match = text.match(WORD_WHOLE_PATTERN))) {
        return parseFloat(match[1]);
    }
    return null;
}

function parseLeftover(text) {
    let leftover = text;
    if (DOT_DECIMAL_PATTERN.test(text)) {
        leftover = text.replace(DOT_DECIMAL_PATTERN, '');
    } else if (POINT_DECIMAL_PATTERN.test(text)) {
        leftover = text.replace(POINT_DECIMAL_PATTERN, '');
    } else if (POUNDS_DECIMAL_PATTERN.test(text)) {
        leftover = text.replace(POUNDS_DECIMAL_PATTERN, '');
    } else if (SYMBOL_WHOLE_PATTERN.test(text)) {
        leftover = text.replace(SYMBOL_WHOLE_PATTERN, '');
    } else if (WORD_WHOLE_PATTERN.test(text)) {
        leftover = text.replace(WORD_WHOLE_PATTERN, '');
    }

    const fillerWords = ['spent', 'on', 'for', 'paid', 'bought'];
    for (const word of fillerWords) {
        const pattern = new RegExp(`\\b${word}\\b`, 'gi');
        leftover = leftover.replace(pattern, '');
    }

    leftover = leftover.replace(/\s+/g, ' ').trim();
    return leftover;
}

function categoryMatching(leftoverText, categories) {
    //split the leftover text into individual words
    const text = leftoverText.toLowerCase().split(/\s+/);
    //loop through the categories 
    for (const category of categories) {
        for (const word of text) {
            if (Array.isArray(category.keywords) && category.keywords.includes(word)) {
                return category;
            }
        }
    }
    return null;
    //see which word fall into which category
    //return the matching category (else null)
    //
}

async function parseExpense(text) {
    let normalized = String(wordToNumbers(text));
    normalized = normalized.replace(/\b(lbs?)\b/gi, 'pounds');
    const amount = parseAmount(normalized);
    const description = parseLeftover(normalized);
    //category matching 
    const categories = await getAllCategories();
    const matchedCategory = categoryMatching(description, categories);
    const categoryId = matchedCategory ? matchedCategory.id : null;
    const categoryName = matchedCategory ? matchedCategory.name : null;

    return {
        amount,
        description,
        categoryId,
        categoryName,
        rawText: text
    };
}

export { parseExpense };

