import {LinkedList} from "./linkedList";
import {Card} from "./card";
import {Player} from "./player";
import {Deck} from "./deck";

enum GameStage {
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

    private _pot = 0;

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
            this.resetPlayerOrder();
        }
    }

    isMovedRound() {
        return this?.currentPlayerPosition?.next === null;
    }

    resetPlayerOrder() {
        this.currentPlayerPosition = this.playersAtTheTable.head;
    }

    getCopyTable() {
        const newTable = new Table()
        newTable.currentPlayerPosition = this.currentPlayerPosition;
        newTable.nonTablePlayers = this.nonTablePlayers;
        newTable.playersAtTheTable = this.playersAtTheTable;
        newTable.cardsOnTable = this.cardsOnTable;
        newTable.currentGameStage = this.currentGameStage;

        return newTable;
    }

    startGame() {
        this.currentPlayerPosition = this.playersAtTheTable.getNext()

        if (this.playersAtTheTable.size() < this.minimumPlayer) {
            // Todo: add button and event's for button
            console.log("WARNING: There is not enough player")
            return
        }

        // console.log('Current game stage:', this.currentGameStage);
        // console.log('Players at the table:', this.playersAtTheTable.toArray().map(player => player.hand.toString()));
        // console.log('Cards on the table:', this.cardsOnTable);

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

        console.log('Current game stage:', this.currentGameStage);
        console.log('Players at the table:', this.playersAtTheTable.toArray().map(player => player.hand.toString()));
        console.log('Cards on the table:', this.cardsOnTable);
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

        console.log(`Small Blind: ${smallBlindPlayer.name}, Bet: ${this.smallBlind}`);
        console.log(`Big Blind: ${bigBlindPlayer.name}, Bet: ${this.bigBlind}`);
        console.log(`Current pot is: ${this._pot}`)
    }
}