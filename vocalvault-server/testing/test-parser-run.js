import wordToNumbers from 'word-to-numbers';

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

function countAmountMatches(text) {
    let count = 0;
    let tempText = text;
    const patterns = [
        DOT_DECIMAL_PATTERN,
        POINT_DECIMAL_PATTERN,
        POUNDS_DECIMAL_PATTERN,
        SYMBOL_WHOLE_PATTERN,
        WORD_WHOLE_PATTERN
    ];
    
    let matched = true;
    while (matched) {
        matched = false;
        for (const pattern of patterns) {
            const match = tempText.match(pattern);
            if (match) {
                count++;
                tempText = tempText.replace(pattern, '');
                matched = true;
                break;
            }
        }
    }
    return count;
}

function test(text) {
    let normalized = String(wordToNumbers(text));
    normalized = normalized.replace(/\b(lbs?)\b/gi, 'pounds');
    const matchesCount = countAmountMatches(normalized);
    const warning = matchesCount > 1 ? "Sounds like multiple expenses, please record one at a time." : null;
    const amount = parseAmount(normalized);
    const description = parseLeftover(normalized);
    console.log(`Input: "${text}"`);
    console.log(`Normalized: "${normalized}"`);
    console.log(`Amount: ${amount}`);
    console.log(`Description: "${description}"`);
    console.log(`Warning: "${warning}"`);
    console.log('---');
}

test("50 lb in food");
test("£50 note");
test("spent 10.50 on lunch");
test("spent 10 pounds on coffee and 5 pounds on lunch");
test("spent £10 on coffee and £5 on tea");
