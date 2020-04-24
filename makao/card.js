const logger = require('../utils/logging').getLogger('card');
const constants = require('../utils/constants');
const botUtils = require('../utils/botUtils');
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

    equals(other) {
        return this._suit === other.suit && this._value === other._value;
    }

    toString() {
        return util.format("[%s%s]", this.value, this.suit);
    }

    asString() {
        return util.format("[%s%s]", this.value, this.suit);
    }

    static parseFromString(cardString) {
        let suit = "";
        let value = 0;
        if (cardString.length === 2) {
            if (botUtils.isASuit(cardString[1])) {
                suit = cardString[1];
                value = botUtils.parseValueFromString(cardString[0]);
            } else {
                suit = cardString[0];
                value = botUtils.parseValueFromString(cardString[1]);
            }
        } else if (cardString.length === 3) {
            if (botUtils.isASuit(cardString[2])) {
                suit = cardString[2];
                value = botUtils.parseValueFromString(cardString.substring(0, 1));
            } else {
                suit = cardString[0];
                value = botUtils.parseValueFromString(cardString.substring(1, 2));
            }
        } else {
            logger.error("Unexpected cardString (%s) length: %d", cardString, cardString.length);
        }
        return new Card(suit, value);
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