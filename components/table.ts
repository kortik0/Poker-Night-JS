import {LinkedList} from "./linkedList";
import {Card} from "./card";
import {Player} from "./player";
import {Deck} from "./deck";

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
            if (this.isMovedRound() && this.isStakesEqual()) {
                this.gameStageSwitch(this.nextGameStage());
            }

            this.resetPlayerOrder();
        }
    }

    isStakesEqual() {
        return this.currentHighestStake && this.playersAtTheTable.toArray().every((player: Player) => {
            console.log(`${player.name} - ${player.currentBet}`)
            console.log(`Highest stake - ${this.currentHighestStake}`)
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
        // TODO: IT is what it is
        // This is already too much
        // I should find another way to copy it
        const newTable = new Table()

        newTable.minimumPlayer = this.minimumPlayer;
        newTable.deck = this.deck;
        newTable.sitsCount = this.sitsCount;
        newTable.currentGameStage = this.currentGameStage;
        newTable.isInGame = this.isInGame;
        newTable.nonTablePlayers = this.nonTablePlayers;
        newTable.playersAtTheTable = this.playersAtTheTable;
        newTable.cardsOnTable = this.cardsOnTable;
        newTable.currentPlayerPosition = this.currentPlayerPosition;
        newTable.bigBlind = this.bigBlind;
        newTable.smallBlind = this.smallBlind;
        newTable.dealerPosition = this.dealerPosition;
        newTable._pot = this._pot;
        newTable.currentHighestStake = this.currentHighestStake;

        return newTable;
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
        //Stackoverflow??
        const stageValues: GameStage[] = Object.values(GameStage).filter(
            (value) => typeof value === 'number'
        ) as GameStage[]

        const gameStageIndex = stageValues.indexOf(this.currentGameStage);
        const nextIndex = (gameStageIndex + 1) % stageValues.length;

        return stageValues[nextIndex];
    }

    gameStageSwitch(gameStage: GameStage) {
        this.currentGameStage = gameStage;

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

    // Methods to handle game actions in each stage
    dealShowdown() {
        // Perform the showdown logic to determine the winner(s) and distribute the pot
        // TODO: Above
    }

    endGame() {
        // Clean up and prepare for the next game or exit the application
        // TODO: Above
    }

    dealCards() {
        this.playersAtTheTable.toArray().forEach((player: Player) => {
            player.hand = this.deck.getHand()
        })
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

        console.log(`IS MOVED: ${this.isMovedRound()}`)
        console.log(`IS ISSTAKESEQUAL: ${this.isStakesEqual()}`)
        if (this.isMovedRound() && this.isStakesEqual() && this.currentGameStage !== GameStage.Showdown) {
            this.gameStageSwitch(this.nextGameStage());
        }

        this.nextPlayer();
    }


    get pot(): number {
        return this._pot;
    }

    set pot(value: number) {
        this._pot = value;
    }
}