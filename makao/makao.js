const logger = require('../utils/logging').getLogger('makao');
const constants = require('../utils/constants');
const Player = require('./player');
const Game = require('./game');
const makaoUtils = require('../utils/makaoUtils');
const util = require('util');
const sendApi = require('../api/fb_send_api');
const db = require('../db/db').pool;

module.exports = class Makao {
    constructor() {
        if (!Makao.instance) {
            this._users = [];
            this._games = [];
            Makao.instance = this;
        }
        return Makao.instance;
    }

    showLast15InStack(player) {
        let game = this.findGameByUser(player);
        if (game) {
            game.showLast15InStack(player);
        } else {
            sendApi.sendMessage(player.id, "Nie należysz do żadnej gry");
        }
    }

    showPlayers(player) {
        let game = this.findGameByUser(player);
        if (game) {
            game.showPlayers(player);
        } else {
            sendApi.sendMessage(player.id, "Nie należysz do żadnej gry");
        }
    }

    shutdown() {
        this._games = [];
        this._users = [];
    }

    createGame(player, decks = 1) {
        this.leaveCurrentGame(player);
        let newGame = new Game(this.getUniqueGameId(), player, decks);
        logger.info("User " + player.id + " created a game with " + decks + " decks; id " + newGame.id);
        this._games.push(newGame);
        this.sendMessage(player.id, util.format("Stworzyłeś nową grę o numerze: %d Przekaż numer gry znajomym aby do niej dołączyli (pisząc do mnie: Dołącz %d)", newGame.id, newGame.id));
    }

    joinGame(player, id) {
        this.leaveCurrentGame(player);
        let game;
        game = this.findGameById(parseInt(id));
        if (!game) {
            this.sendMessage(player.id, util.format("Gra numer %d nie istnieje", id));
        } else {
            game.addPlayer(player);
            logger.info("User " + player.id + " joined a game with id " + id);
            this.sendMessage(player.id, util.format("Dołączyłeś do gry %d", id));
        }
    }

    leaveCurrentGame(player) {
        let game = this.findGameByUser(player);
        if (game) {
            logger.info("Player %d leaves game %d", player.id, game.id);
            game.removePlayer(player);
            if (game.shouldBeDestroyed) {
                logger.info("Game %d destroyed", game.id);
                this._games.splice(this._games.indexOf(game), 1);
            }
        }
    }

    draw(player, n) {
        let game = this.findGameByUser(player);
        if (game) {
            logger.info("User %d draws %d cards", player.id, n);
            game.draw(player, n);
        } else {
            sendApi.sendMessage(player.id, "Nie należysz do żadnej gry");
        }
    }

    play(player, cards) {
        let game = this.findGameByUser(player);
        if (game) {
            logger.info("User %d played %s", player.id, cards);
            game.play(player, cards);
        } else {
            sendApi.sendMessage(player.id, "Nie należysz do żadnej gry");
        }
    }

    undo(player, cards) {
        let game = this.findGameByUser(player);
        if (game) {
            logger.info("User %d wants to undo last card", player.id, cards);
            game.undo(player);
        } else {
            sendApi.sendMessage(player.id, "Nie należysz do żadnej gry");
        }
    }

    isGameIdUnique(id) {
        this._games.forEach(value => {
            if (id === value) return false;
        });
        return true;
    }

    getUniqueGameId() {
        let newId = makaoUtils.getRndInteger(10, 99);
        while (!this.isGameIdUnique(newId)) {
            newId = makaoUtils.getRndInteger(10, 99);
        }
        return newId;
    }

    status() {
        let status = 'Makao is running. There are ' + this._games.length + ' ongoing.';
        status += util.format("<br>Players: %d", this._users.length);
        for (let user in this._users) {
            status += util.format("<br>%d: %s", user, JSON.stringify(this._users[user]));
        }
        status += util.format("<br>Games: %d", this._games.length);
        for (let game in this._games) {
            status += util.format("<br>%d: %s", game, JSON.stringify(this._games[game]));
        }
        return status;
    }

    findGameByUser(player) {
        return this._games.find(value => {
            return value.isPlaying(player);
        });
    }

    findGameById(id) {
        return this._games.find(value => {
            return value.id === id;
        });
    }

    findPlayerById(id) {
        return this._users.find(value => {
            return value.id === id;
        });
    }

    getOrCreatePlayer(sender_id) {
        let player = this.findPlayerById(sender_id);
        if (player) {
            return player;
        } else {
            return this.createPlayer(sender_id);
        }
    }

    createPlayer(psid) {
        logger.info("New player: %d", psid);
        let player = new Player(psid);
        this._users.push(player);
        return player;
    }

    greet(player) {
        this.setPlayerIsGreeted(player);
        this.sendMessage(player.id, util.format("Cześć!\n%s", constants.HELP_STRING));
    }

    showHand(player) {
        if (player.handIsEmpty()) {
            this.sendMessage(player.id, "Nie masz kart na ręku")
        } else {
            this.sendMessage(player.id, util.format("Masz na ręku: %s", player.getHandString()));
        }
    }

    shuffleStack(player) {
        let game = this.findGameByUser(player);
        if (game) {
            logger.info("User %d shuffles deck", player.id);
            game.shuffleStack(player);
        } else {
            sendApi.sendMessage(player.id, "Nie należysz do żadnej gry");
        }
    }

    setPlayerIsGreeted(player) {
        player.needsGreet = false;
        let index = this._users.findIndex(value => {
            return value.id === player.id
        });
        this._users[index] = player;
    }

    sendMessage(recipient, text) {
        sendApi.sendMessage(recipient, text);
    }
};