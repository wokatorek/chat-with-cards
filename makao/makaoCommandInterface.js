const logger = require('../utils/logging').getLogger('makaoCommandInterface');
const constants = require('../utils/constants');
const makaoUtils = require('../utils/makaoUtils');
const util = require('util');
const sendApi = require('../api/fb_send_api');
const Makao = require('./makao');

module.exports = class MakaoCommandInterface {
    constructor() {
        if (!MakaoCommandInterface.instance) {
            this._makao = new Makao();
            MakaoCommandInterface.instance = this;
        }
        return MakaoCommandInterface.instance;
    }

    handleMessage(sender_psid, message) {
        let player = this._makao.getOrCreatePlayer(sender_psid);
        if (/^nowa\s*$/i.test(message)) {
            this._makao.createGame(player, 1);
        } else if (/^nowa \d+$/i.test(message)) {
            this._makao.createGame(player, /^nowa (\d+)$/i.exec(message)[1]);
        } else if (/^dołącz \d+$/i.test(message)) {
            this._makao.joinGame(player, /^dołącz (\d+)$/i.exec(message)[1]);
        } else if (/^pomoc\s*$/i.test(message)) {
            this._makao.sendMessage(sender_psid, constants.HELP_MORE);
        } else if (/^pomoc ([a-zA-ZąćęółńśżźĄĆĘÓŁŃŚŻŹ]+)\s*$/i.test(message)) {
            this._makao.sendMessage(sender_psid, util.format("Ta funkcja nie jest jeszcze zaimplementowana. TODO: %s", /^pomoc (\w+)\s*$/i.exec(message)[1]));
        } else if (/^dobierz\s*$/i.test(message)) {
            this._makao.draw(player, 1);
        } else if (/^dobierz \d+$/i.test(message)) {
            this._makao.draw(player, /^dobierz (\d+)$/i.exec(message)[1]);
        } else if (/^zagraj\s*$/i.test(message)) {
            logger.debug("zagraj[stop] reached");
            this._makao.play(player, null);
        } else if (/^zagraj\s*/i.test(message) && constants.CARD_REGEX.test(message)) {
            logger.debug("zagraj [karty] reached");
            this._makao.play(player, constants.CARD_REGEX.exec(message)[0]);
        } else if (constants.CARD_REGEX.test(message)) {
            logger.debug("[karty] reached");
            this._makao.play(player, constants.CARD_REGEX.exec(message)[0]);
        } else if (/^ręka\s*$/i.test(message)) {
            this._makao.showHand(player);
        } else if (/^cofnij\s*$/i.test(message)) {
            this._makao.undo(player);
        } else if (/^stos\s*$/i.test(message) || /^ostatnie karty\s*$/i.test(message)) {
            this._makao.showLast15InStack(player);
        } else if (/^gracze\s*$/i.test(message) || /^kto gra\s*$/i.test(message)) {
            this._makao.showPlayers(player);
        } else if (/^przetasuj\s*$/i.test(message)) {
            this._makao.shuffleStack(player);
        } else {
            logger.info('Message %s from user %d did not match any command.', message, sender_psid);
            if (player.needsGreet) {
                this._makao.greet(player);
            } else {
                this._makao.sendMessage(sender_psid, "Nie rozpoznałem komendy :( Jeśli potrzebujesz pomocy napisz \"pomoc\"");
            }
        }
    }
};