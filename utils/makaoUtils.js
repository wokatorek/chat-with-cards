exports.getRndInteger = function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.shuffle = function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

exports.parseValueFromString = function parseValueFromString(valueString) {
    if (valueString.toUpperCase() === "A") {
        return 14;
    } else if (valueString.toUpperCase() === "K") {
        return 13;
    } else if (valueString.toUpperCase() === "Q") {
        return 12;
    } else if (valueString.toUpperCase() === "J") {
        return 11;
    } else {
        return parseInt(valueString);
    }
}

exports.isASuit = function isASuit(suitString) {
    return constants.SUITS.CLUB.codePointAt(0) === suitString.codePointAt(0)
        || constants.SUITS.DIAMOND.codePointAt(0) === suitString.codePointAt(0)
        || constants.SUITS.HEART.codePointAt(0) === suitString.codePointAt(0)
        || constants.SUITS.SPADE.codePointAt(0) === suitString.codePointAt(0);
}