const testSize = 1024;

function generateTrueFalseArray(count=0, fillValue=null) {
    const returnResult = [];

    for(let i=0; i<count; ++i) {
        if(typeof(fillValue) === 'boolean') {
            returnResult.push(fillValue);
        } else if(typeof(fillValue) === 'function') {
            returnResult.push(fillValue(i));
        } else {
            if(Math.random() < 0.5) {
                returnResult.push(true);
            } else {
                returnResult.push(false);
            }
        }
    }

    return returnResult;
}

function getMatchPercentage(a, b) {
    if(!Array.isArray(a) || !Array.isArray(b)) {
        throw new Error('Please give arrays.');
    }

    if(a.length !== b.length) {
        throw new Error('Array lengths dont match');
    }

    let correctAmount = 0;

    for(let i=0; i<a.length; ++i) {
        if(a[i] === b[i]) {
            ++correctAmount
        }
    }

    return correctAmount / a.length;
}

const allResults = [];

function sortResults() {
    allResults.sort((a, b) => {
        if(a.matchPercent > b.matchPercent) return -1;
        if(a.matchPercent < b.matchPercent) return 1;
        return 0;
    });
}

let totalTests = 0;
function logResult(guess, answer) {
    const matchPercent = getMatchPercentage(guess, answer);

    const resultInfo = {
        guess,
        answer,
        matchPercent,
    };
    allResults.push(resultInfo);

    ++totalTests;
    console.log(totalTests + ': Got a match of ' + (matchPercent * 100).toFixed(2));

    return resultInfo;
}

function invertArray(arr) {
    return arr.map(res => !res);
}

const answerArray = generateTrueFalseArray(testSize);
const straightGuess = generateTrueFalseArray(testSize, true);

// At this point, we know exactly how many 0s and how many 1s there are
const matchResult = logResult(straightGuess, answerArray);

const total1s = straightGuess.length * matchResult.matchPercent;
const total0s = (straightGuess.length - total1s);
console.log('There are ' + total1s + ' ones and ' + total0s + ' zeros.');

function improveResult(resultInfo) {
    if(resultInfo.matchPercent < 0.5) {
        const newResult = {
            guess: invertArray(resultInfo.guess),
            answer: resultInfo.answer,
            matchPercent: 1 - resultInfo.matchPercent
        };

        return newResult;
    }

    return null;
}

function countTrues(arr) {
    let totalTrue = 0;

    for(let i=0; i<arr.length; ++i) {
        if(arr[i]) {
            ++totalTrue;
        }
    }

    return totalTrue;
}

function generateRandomGuess() {
    const bestGuess = allResults[0].guess;

    let ourGuess = [
        ...bestGuess,
    ];

    let totalTrue = countTrues(ourGuess);
    while(totalTrue < total1s) {
        const randomIndex = Math.floor(Math.random() * ourGuess.length);

        if(!ourGuess[randomIndex]) {
            ourGuess[randomIndex] = !ourGuess[randomIndex];
            ++totalTrue;
        }
    }

    while(totalTrue > total1s) {
        const randomIndex = Math.floor(Math.random() * ourGuess.length);

        if(ourGuess[randomIndex]) {
            ourGuess[randomIndex] = !ourGuess[randomIndex];
            --totalTrue;
        }
    }

    return ourGuess;
}

// improve result until we get somewher
let workingResult = matchResult;
while(true) {
    let improvedResult = improveResult(workingResult);
    if(improvedResult !== null) {
        workingResult = improvedResult;

        // Store this as known data
        allResults.push(workingResult);
        sortResults();
    }

    // Grab the best result
    // console.log('Working with: ', workingResult);

    let nextGuess = generateRandomGuess();
    const resultInfo = logResult(nextGuess, answerArray);

    if(resultInfo.matchPercent === 1) {
        console.log('solved!');
        return;
    }
}