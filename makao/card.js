const logger = require('../utils/logging.js').getLogger('card.js');
const constants = require('../utils/constants.js');
const util = require('util');

module.exports = class Card {
    constructor(suit, value) {
        this._suit = suit;
        this._value = value;
    }

    get suit() {
        return this._suit;
    }

    get value() {
        if (this._value === 14) {
            return "A";
        } else if (this._value === 13) {
            return "K";
        } else if (this._value === 12) {
            return "Q";
        } else if (this._value === 11) {
            return "J";
        } else {
            return this._value;
        }
    }

    toString() {
        return util.format("[%s%s]", this.value, this.suit);
    }

    asString() {
        return util.format("[%s%s]", this.value, this.suit);
    }

    static getFullDeck() {
        let deck = [];
        for (let i = 2; i <= 14; i++) {
            deck.push(new Card(constants.SUITS.SPADE, i));
        }
        for (let i = 2; i <= 14; i++) {
            deck.push(new Card(constants.SUITS.CLUB, i));
        }
        for (let i = 2; i <= 14; i++) {
            deck.push(new Card(constants.SUITS.HEART, i));
        }
        for (let i = 2; i <= 14; i++) {
            deck.push(new Card(constants.SUITS.DIAMOND, i));
        }
        return deck;
    }
};