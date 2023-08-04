import {Rank} from "./enums/Rank";
import {Suit} from "./enums/Suit";

export class Card {
    private readonly rank: Rank;
    private readonly suit: Suit;

    constructor(rank: Rank, suit: Suit) {
        if(!rank || !suit) {
            throw new Error("Rank and suit must be defined")
        }

        if(!Object.values(Rank).includes(rank)) {
            throw new Error("Rank should be enumerated!")
        }
        if(!Object.values(Suit).includes(suit)) {
            throw new Error("Suit should be enumerated!")
        }

        this.rank = rank;
        this.suit = suit;
    }

    toString(): string {
        return `${this.rank}${this.suit}`;
    }
}