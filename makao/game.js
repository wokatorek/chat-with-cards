const logger = require('../utils/logging').getLogger('game');
const Card = require('./card');
const sendApi = require('../api/fb_send_api');
const util = require('util');
const botUtils = require('../utils/botUtils');

module.exports = class Game {
    constructor(id, owner, decks) {
        this._owner = owner;
        this._players = [owner];
        this._id = id;
        this._shouldBeDestroyed = false;
        this._deck = Card.getFullDeck();
        for (let i = 0; i < decks - 1; i++) {
            this._deck.push(Card.getFullDeck());
        }
        this._deck = botUtils.shuffle(this._deck);
        this._stack = [];
        logger.info("Game %d created", id);
    }

    get id() {
        return this._id;
    }

    get shouldBeDestroyed() {
        return this._shouldBeDestroyed;
    }

    addPlayer(player) {
        this._players.push(player);
        let game = this;
        let counter = 10;
        function broadcastAddPlayerWhenProfileExists() {
            if (player.profile) {
                game.broadcastApart(util.format("%s dołączył do gry!", player.firstName), player);
            } else {
                counter--;
                if(counter <= 0){
                    throw "FAIL broadcastAddPlayerWhenProfileExists";
                }
            }
        }
        setTimeout(broadcastAddPlayerWhenProfileExists, 1000);
    }

    broadcast(message) {
        this._players.forEach(value => {
            sendApi.sendMessage(value.id, message)
        });
    }

    broadcastApart(message, player) {
        this._players.forEach(value => {
            if (value.id !== player.id) {
                sendApi.sendMessage(value.id, message)
            }
        });
    }

    draw(player, n) {
        let thePlayer = this._players[this.getPlayerIndex(player)];
        let cardsString = "";
        for (let i = 0; i < n; i++) {
            let card = this._deck.splice(0,1)[0];
            thePlayer.drawCard(card);
            cardsString += util.format("[%s%s] ", card.value, card.suit);
        }
        this.savePlayer(thePlayer);
        this.broadcastApart(util.format("%s dobrał %d kart", player.firstName, n), player);
        sendApi.sendMessage(player.id, util.format("Dobrałeś: %s", cardsString));
    }

    savePlayer(player) {
        let playerIndex = this.getPlayerIndex(player);
        this._players[playerIndex] = player;
    }

    play(player, cards) {
        if (player._cards.length === 0) {
            sendApi.sendMessage(player.id, "Nie masz już kart!");
            return;
        }
        if (cards === null && player._cards.length > 1) {
            sendApi.sendMessage(player.id, util.format("Masz więcej niż jedną kartę. Powtórz komendę ze wskazaniem karty którą chcesz zagrać.\nNa ręku masz %s", player.getHandString()));
            return;
        }
        let playedCards = [];
        if (cards !== null) {
            cards.split(" ").forEach(value => {
                let card = player.findCardByString(value);
                if (card) {
                    player.playCard(card);
                    playedCards.push(card);
                    this._stack.push({card: card, player_id: player.id});
                } else {
                    sendApi.sendMessage(player.id, util.format("Nie masz karty %s", value));
                }
            });
        } else {
            let card = player.getZeroCard();
            player.playCard(cards);
            playedCards.push(card);
            this._stack.push({card: card, player_id: player.id});
        }
        if (playedCards.length > 0) {
            let playedCardsString = "";
            playedCards.forEach(card => {
                playedCardsString += util.format(" [%s%s]", card.value, card.suit);
            })
            sendApi.sendMessage(player.id, util.format("Zagrałeś %s", playedCardsString));
            this.broadcastApart(util.format("%s zagrał %s", player.firstName, cards), player);
        }
    }

    undo(player) {
        if(this._stack.length === 0){
            sendApi.sendMessage(player.id, "Brak zagranych kart");
            return;
        }
        let cardObject = this._stack.pop();
        if (cardObject && cardObject.player_id === player.id) {
            let thePlayer = this._players[this.getPlayerIndex(player)];
            thePlayer.drawCard(cardObject.card);
            this.savePlayer(thePlayer);
            this.broadcastApart(util.format("%s cofnął ostatnią zagraną kartę", player.firstName), player);
            sendApi.sendMessage(player.id, util.format("Cofnąłeś zagranie karty: %s", util.format("[%s%s] ", cardObject.card.value, cardObject.card.suit)));
        } else {
            this._stack.push(cardObject);
            sendApi.sendMessage(player.id, "Karta na szczycie stosu nie została zagrana przez Ciebie");
        }
    }

    showLast15InStack(player) {
        let result = "Ostatnie 15 kart w kolejności od najnowszej do najstarszej (\"na wierzchu\" jest pierwsza karta):\n";
        for (let i = this._stack.length - 1; i > this._stack.length - 15 && i >= 0; i--) {
            result += util.format("[%s%s] ", this._stack[i].card.value, this._stack[i].card.suit);
        }
        sendApi.sendMessage(player.id, result);
    }

    showPlayers(player) {
        let result = "Grają:\n";
        this._players.forEach(value => {
            result += util.format("%s %s\n", value.firstName, value.lastName);
        });
        sendApi.sendMessage(player.id, result)
    }

    removePlayer(player) {
        let index = this.getPlayerIndex(player);
        if (index > -1) {
            this.throwCardsBackInDeck(this._players[index].cards);
            this._players[index].clearCards();
            this._players.splice(index, 1);
            this.broadcast(util.format("%s opuścił grę.", player.firstName));
            if (this._owner.id === player._id) {
                this.moveOwnership();
            }
        }
    }

    throwCardsBackInDeck(cards = null) {
        if (cards != null) {
            this._deck.push(...cards);
            this._deck = botUtils.shuffle(this._deck);
        }
    }

    shuffleStack(player) {
        if (this._stack.length < 2) {
            sendApi.sendMessage(player.id, "Nie możesz przetasować gdy na stosie nie ma żadnych albo jest tylko jedna karta.");
            return
        }
        let removed = this._stack.splice(0, this._stack.length - 1);
        let removedCards = [];
        removed.forEach(card_player => {
            removedCards.push(card_player.card);
        });
        removedCards = botUtils.shuffle(removedCards);
        this._deck = this._deck.concat(removedCards);
        sendApi.sendMessage(player.id, "Przetasowałeś zagrane karty.");
        this.broadcastApart(util.format("%s przetasował stos zagranych kart.", player.profile.firstName), player);
    }

    moveOwnership() {
        if (this._players.length > 0) {
            this._owner = this._players[0];
            this.broadcast(util.format("%s jest nowym właścicielem gry.", this._owner.firstName));
        } else {
            this._shouldBeDestroyed = true;
        }
    }

    isPlaying(player) {
        return this.getPlayerIndex(player) >= 0;
    }

    getPlayerIndex(player) {
        return this._players.findIndex(value => {
            return value.id === player.id;
        })
    }
};