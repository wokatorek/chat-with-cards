const logger = require('../utils/logging').getLogger('player');
const constants = require('../utils/constants');
const profileApi = require('../api/fb_profile_api');
const util = require('util');

module.exports = class Player {
    constructor(id) {
        this._id = id;
        this._needsGreet = true;
        this._profile = null;
        profileApi.getProfile(id, this);
        this._cards = [];
    }

    get id() {
        return this._id;
    }

    get cards() {
        return this._cards;
    }

    get needsGreet() {
        return this._needsGreet;
    }

    set needsGreet(x) {
        this._needsGreet = x;
    }

    set profile(profile) {
        this._profile = profile;
    }

    get profile() {
        return this._profile
    }

    get firstName() {
        return this._profile.first_name;
    }

    get lastName() {
        return this._profile.last_name;
    }

    getZeroCard() {
        return this._cards[0];
    }

    findCardByString(card) {
        return this._cards.find(value => {
            if (card.length === 2) {
                return value.value.toUpperCase() == card[0].toUpperCase() && value.suit.codePointAt(0) === card.codePointAt(1) || value.value.toUpperCase() == card[1].toUpperCase() && value.suit.codePointAt(0) === card.codePointAt(0);
            } else if (card.length === 3) {
                return value.value.toUpperCase() == card.substring(0,1).toUpperCase() && value.suit.codePointAt(0) === card.codePointAt(2) || value.value.toUpperCase() == card.substring(1,2).toUpperCase() && value.suit.codePointAt(0) === card.codePointAt(0);
            }
        });
    }

    drawCard(card) {
        this._cards.push(card);
    }

    playCard(card) {
        this._cards.splice(this._cards.indexOf(card), 1);
    }

    handIsEmpty() {
        return this._cards.length === 0;
    }

    getHandString() {
        let hand = "";
        this._cards.forEach(value => {
            hand += util.format("[%s%s] ", value.value, value.suit);
        });
        return hand
    }
};