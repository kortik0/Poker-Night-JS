export class Card {
    private rank: any;
    private suit: any;
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    toString() {
        return `${this.rank}${this.suit}`;
    }
}