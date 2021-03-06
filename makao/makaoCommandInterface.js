const logger = require('../utils/logging').getLogger('makaoCommandInterface');
const constants = require('../utils/constants');
const botUtils = require('../utils/botUtils');
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
        } else if (/^do[lł][aą]cz \d+$/i.test(message)) {
            this._makao.joinGame(player, /^doł[aą]cz (\d+)$/i.exec(message)[1]);
        } else if (/^pomoc\s*$/i.test(message)) {
            this._makao.sendMessage(sender_psid, constants.HELP_MORE);
        } else if (/^pomoc ([a-zA-ZąćęółńśżźĄĆĘÓŁŃŚŻŹ]+)\s*$/i.test(message)) {
            this._makao.sendMessage(sender_psid, util.format("Ta funkcja nie jest jeszcze zaimplementowana. TODO: %s", /^pomoc (\w+)\s*$/i.exec(message)[1]));
        } else if (/^dobierz\s*$/i.test(message)) {
            this._makao.draw(player, 1);
        } else if (/^dobierz \d+$/i.test(message)) {
            this._makao.draw(player, /^dobierz (\d+)$/i.exec(message)[1]);
        } else if (/^zagraj\s*$/i.test(message)) {
            this._makao.play(player, null);
        } else if (/^zagraj\s*/i.test(message) && constants.CARD_REGEX.test(message)) {
            this._makao.play(player, constants.CARD_REGEX.exec(message)[0]);
        } else if (constants.CARD_REGEX.test(message)) {
            this._makao.play(player, constants.CARD_REGEX.exec(message)[0]);
        } else if (/^r[eę]ka\s*$/i.test(message)) {
            this._makao.showHand(player);
        } else if (/^cofnij\s*$/i.test(message)) {
            this._makao.undo(player);
        } else if (/^stos\s*$/i.test(message) || /^ostatnie karty\s*$/i.test(message)) {
            this._makao.showLast15InStack(player);
        } else if (/^gracze\s*$/i.test(message) || /^kto gra\s*$/i.test(message)) {
            this._makao.showPlayers(player);
        } else if (/^przetasuj\s*$/i.test(message)) {
            this._makao.shuffleStack(player);
        } else if (/^[żz][ąa]dam\s*/i.test(message)) {
            this._makao.request(player, /^[żz][ąa]dam\s*(.+)\s*$/i.exec(message)[1]);
        } else if (/^propozycja:/i.test(message)) {
            this._makao.sendMessage(2907394745984376, util.format("User: %s\nSuggestion: %s", JSON.stringify({id: player.id, profile: player.profile}), /^propozycja:\s*(.+)\s*$/i.exec(message)[1]));
            this._makao.sendMessage(sender_psid, util.format("Dzięki za sugestię. Przekazałem ją adminowi."));
        } else if (/^opu[sś][cć] gr[eę]|wyjd[zź] z gry|wyjd[zź]/i.test(message)) {
            this._makao.leaveCurrentGame(player);
            this._makao.sendMessage(sender_psid, util.format("Opuściłeś grę."));
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