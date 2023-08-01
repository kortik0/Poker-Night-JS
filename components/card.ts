import {Rank} from "./enums/Rank";
import {Suit} from "./enums/Suit";

export class Card {
    private rank: Rank;
    private suit: Suit;

    constructor(rank: Rank, suit: Suit) {
        this.rank = rank;
        this.suit = suit;
    }

    toString(): string {
        return `${this.rank}${this.suit}`;
    }
}