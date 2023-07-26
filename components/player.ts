import {Card} from "./card";

export class Player {
    chips = 1000;
    name: string;
    private _hand: Card[] = []
    private _isFolded = false;

    //Let's be so
    currentBet = 0;

    next: Player;

    private _isBigBlind = false;
    private _isSmallBlind = false;

    constructor(name) {
        this.name = name;
        //Next Player class
        this.next = null;
    }

    //Movements
    setBet(amount: number = (this.chips * 0.20)): number {
        const bet = Math.min(this.chips, amount);

        this.currentBet = bet;
        this.chips -= bet;
        return bet;
    }

    /*Call and Raise AI generated and should be tested*/
    call(tableHighestStake: number): number {
        // const chipsToCall = tableHighestStake - this.currentBet;
        const chipsToLose = Math.min(this.chips, tableHighestStake);

        this.chips -= chipsToLose;
        this.currentBet += chipsToLose;

        return chipsToLose;
    }

    raise(amount: number = (this.chips * 0.20)): number {
        const bet = Math.min(this.chips, amount);

        this.currentBet += bet;
        this.chips -= bet;
        return bet;
    }

    check() {
        // this.currentBet = 0;
        return 0;
    }

    fold() {
        this.currentBet = 0;
        this.isFolded = true;
        this.hand = [];

        return 0;
    }

    giveMoneyToCasino() {
        this.chips -= this.chips * Math.random();
    }

    get isFolded(): boolean {
        return this._isFolded;
    }

    set isFolded(value: boolean) {
        this._isFolded = value;
    }

    get hand(): Card[] {
        return this._hand;
    }

    set hand(setCards: Card[]) {
        this._hand = setCards;
    }

    get isBigBlind(): boolean {
        return this._isBigBlind;
    }

    set isBigBlind(value: boolean) {
        this._isBigBlind = value;
    }

    get isSmallBlind(): boolean {
        return this._isSmallBlind;
    }

    set isSmallBlind(value: boolean) {
        this._isSmallBlind = value;
    }

}