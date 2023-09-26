import {LinkedList} from "./linkedList";
import {Card} from "./card";
import {Player} from "./player";
import {Deck} from "./deck";

const Hand = require('pokersolver').Hand;

export enum GameStage {
    Preparing,
    Preflop,
    Flop,
    Turn,
    River,
    Showdown,
    Ending
}

export class Table {
    private sitsCount = 10;
    private minimumPlayer = 2;

    private deck: Deck = new Deck();

    /*private*/
    currentGameStage: GameStage = GameStage.Preparing;
    private isInGame = false;

    private nonTablePlayers: LinkedList = new LinkedList();
    private playersAtTheTable: LinkedList = new LinkedList();
    private _winner: Player = null;

    private cardsOnTable: Card[] = []

    currentPlayerPosition: Player;

    //Now constant, but maybe will automatic
    bigBlind = 100;
    smallBlind = 50;

    private _pot = 0;
    currentHighestStake = this.bigBlind;

    private dealerPosition: number = -1;

    constructor() {
    }

    registerNewPlayer(name: String) {
        if (this.sitsCount == this.playersAtTheTable.size()) {
            this.nonTablePlayers.addPlayer(name);
        } else if (this.isInGame) {
            this.nonTablePlayers.addPlayer(name);
        } else {
            this.sit(name);
        }
    }

    restartGame() {
        // Reset the game state and prepare for a new game
        this.currentGameStage = GameStage.Preparing;
        this.isInGame = false;
        this.cardsOnTable = [];
        this.dealerPosition = -1;
        this._pot = 0;

        if (this.playersAtTheTable.size() < this.minimumPlayer) return;

        this.startGame();
    }

    private sit(name: String) {
        this.playersAtTheTable.addPlayer(name);
    }

    leaveTable(playerPosition: number) {
        const player = this.playersAtTheTable.removeAt(playerPosition);
        this.nonTablePlayers.addPlayer(player);
    }

    nextPlayer() {
        if (this.currentPlayerPosition && this.currentPlayerPosition.next !== null) {
            this.currentPlayerPosition = this.currentPlayerPosition.next;
        } else {
            if (this.isMovedRound() && this.isStakesEqual() && this.currentGameStage !== GameStage.Showdown) {
                this.gameStageSwitch(this.nextGameStage());
            }

            this.resetPlayerOrder();
        }
    }

    isStakesEqual() {
        return this.currentHighestStake && this.playersAtTheTable.toArray().every((player: Player) => {
            return player.currentBet === this.currentHighestStake || player.isFolded === true;
        })
    }

    isMovedRound() {
        return this?.currentPlayerPosition?.next === null;
    }

    // Doesn't move to next, but tail link to head
    resetPlayerOrder() {
        this.currentPlayerPosition = this.playersAtTheTable.head;
    }

    getCopyTable() {
        const copy = new Table();

        const original = this;
        for (const key in original) {
            if (original.hasOwnProperty(key)) {
                // @ts-ignore
                copy[key] = original[key];
            }
        }

        return copy;
    }

    startGame() {
        // TODO: Game should start from player next after big blind one
        this.currentPlayerPosition = this.playersAtTheTable.head;

        if (this.playersAtTheTable.size() < this.minimumPlayer) {
            // Todo: add button and event's for button
            console.log("WARNING: There is not enough player")
            return
        }

        console.log(this.playersAtTheTable.toArray())

        this.setDealerPosition();
        this.setBlinds();
    }

    nextGameStage(): GameStage {
        const stageValues: GameStage[] = Object.values(GameStage).filter(
            (value) => typeof value === 'number'
        ) as GameStage[]

        const gameStageIndex = stageValues.indexOf(this.currentGameStage);
        const nextIndex = (gameStageIndex + 1) % stageValues.length;

        return stageValues[nextIndex];
    }

    gameStageSwitch(gameStage: GameStage) {
        this.currentGameStage = gameStage;
        this.resetPlayerOrder();

        switch (this.currentGameStage) {
            case GameStage.Preparing:
                break;
            case GameStage.Preflop:
                this.dealPreflop();
                break;
            case GameStage.Flop:
                this.dealFlop();
                break;
            case GameStage.Turn:
                this.dealTurn();
                break;
            case GameStage.River:
                this.dealRiver();
                break;
            case GameStage.Showdown:
                this.dealShowdown();
                break;
            case GameStage.Ending:
                this.endGame()
                break;
            default:
                console.log('Invalid game state');
        }
    }

    // Methods to handle game actions in each stage
    dealPreflop() {
        this.dealCards();
    }

    dealFlop() {
        // Deal the flop (3 community cards) and perform other necessary operations
        this.cardsOnTable.push(...this.deck.getFlop())
    }

    dealTurn() {
        // Deal the turn (1 community card) and perform other necessary operations
        this.cardsOnTable.push(this.deck.draw())
    }

    dealRiver() {
        // Deal the river (1 community card) and perform other necessary operations
        this.cardsOnTable.push(this.deck.draw())
    }

    dealShowdown() {
        const winner = this.getWinner();
        this._winner = winner;
        const combinationName = Hand.solve([...this.getEvaluatedCommunityCards(), ...winner.getEvaluatedHand()]).name;
        console.log(`Winner is: ${winner.name}: ${combinationName}/${winner.hand} `);
        console.log(this._winner)

        // Perform the showdown logic to determine the winner(s) and distribute the pot
        // TODO: Above
    }

    endGame() {
        // TODO: Check this. But I think it's okay
        this.restartGame();
        // Clean up and prepare for the next game or exit the application
        // TODO: Above
    }

    dealCards() {
        this.playersAtTheTable.toArray().forEach((player: Player) => {
            player.hand = this.deck.getHand()
        })
    }

    // For now, it works only for one winner.
    // Take it and don't bother me.
    private getWinner(): Player {
        const allPlayersCombination = this.playersAtTheTable.toArray().reduce((acc, player: Player) => {
            acc.push(Hand.solve([...player.getEvaluatedHand(), ...this.getEvaluatedCommunityCards()]));
            return acc;
        }, []);

        const winnerHand = Hand.winners(allPlayersCombination);
        return this.playersAtTheTable.toArray().find((player: Player) => {
            const cards = Hand.solve([...player.getEvaluatedHand(), ...this.getEvaluatedCommunityCards()]);
            return cards.toString() === winnerHand[0].toString();
        });
    }

    private setDealerPosition() {
        if (this.playersAtTheTable.size() > 0) {
            this.dealerPosition = Math.floor(Math.random() * this.playersAtTheTable.size());
        }
    }

    private setBlinds() {
        const smallBlindPosition = (this.dealerPosition + 1) % this.playersAtTheTable.size();
        const bigBlindPosition = (this.dealerPosition + 2) % this.playersAtTheTable.size();

        const smallBlindPlayer = this.playersAtTheTable.getAt(smallBlindPosition);
        const bigBlindPlayer = this.playersAtTheTable.getAt(bigBlindPosition);

        smallBlindPlayer.isSmallBlind = true;
        bigBlindPlayer.isBigBlind = true;

        smallBlindPlayer.setBet(this.smallBlind);
        bigBlindPlayer.setBet(this.bigBlind);

        this._pot = this.smallBlind + this.bigBlind;
        this.currentHighestStake = this.pot - this.smallBlind;

        console.log(`Small Blind: ${smallBlindPlayer.name}, Bet: ${smallBlindPlayer.currentBet}`);
        console.log(`Big Blind: ${bigBlindPlayer.name}, Bet: ${bigBlindPlayer.currentBet}`);
        console.log(`Current pot is: ${this._pot}`)
    }

    playerAction(actionType: string, amount: number) {
        const currentPlayer = this.currentPlayerPosition;

        switch (actionType) {
            case "bet":
                currentPlayer.setBet(amount);
                this.pot += amount;
                this.currentHighestStake = amount;
                break;

            case "raise":
                // const totalBetAmount = amount + this.currentHighestStake;
                currentPlayer.raise(amount);
                this.pot += amount;
                this.currentHighestStake = amount;
                break;

            case "fold":
                currentPlayer.fold();
                break;

            case "check":
                currentPlayer.check();
                break;

            case "call":
                const amountToCall = this.currentHighestStake - currentPlayer.currentBet;
                currentPlayer.call(amountToCall);
                this.pot += amountToCall;
                break;

            default:
                console.log("Invalid action");
                break;
        }
        this.nextPlayer();
    }

    getEvaluatedCommunityCards() {
        return this.cardsOnTable.map(card => card.toEvaluatorString());
    }

    get pot(): number {
        return this._pot;
    }

    set pot(value: number) {
        this._pot = value;
    }

    get winner() {
        return this._winner;
    }
}