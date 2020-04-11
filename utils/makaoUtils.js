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