import {Card} from "./card";

export class Player {
    chips = 1000;
    name: string;
    private _hand: Card[] = []
    next: Player;

    private _isBigBlind = false;
    private _isSmallBlind = false;

    constructor(name) {
        //Next Player class
        this.name = name;
        this.next = null;
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

//Movements
    setBet(bet: number = (this.chips * 0.20)): number {
        this.chips -= bet;

        return bet;
    }

    /*Call and Raise AI generated and should be tested*/
    call(pot: number = (this.chips * 0.20)): number {
        const bet = Math.min(this.chips, pot);
        this.chips -= bet;
        return bet;
    }

    raise(amount: number = (this.chips * 0.20)): number {
        const bet = Math.min(this.chips, amount);
        this.chips -= bet;
        return bet;
    }

    check() {

    }

    fold() {
        console.log("This is folded somehow")
    }

    giveMoneyToCasino() {
        this.chips -= this.chips * Math.random();
    }
}