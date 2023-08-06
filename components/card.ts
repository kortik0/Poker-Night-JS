import {Rank} from "./enums/Rank";
import {Suit, SuitEvaluator} from "./enums/Suit";

export class Card {
    private readonly rank: Rank;
    private readonly suit: Suit;
    private readonly evaluatorSuit: SuitEvaluator;

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

        const suitEvaluated = {
            [Suit.Spades]: SuitEvaluator.Spades,
            [Suit.Hearts]: SuitEvaluator.Hearts,
            [Suit.Diamonds]: SuitEvaluator.Diamonds,
            [Suit.Clubs]: SuitEvaluator.Clubs
        }[suit]

        this.rank = rank;
        this.suit = suit;
        this.evaluatorSuit = suitEvaluated;
    }

    toEvaluatorString() {
        return `${this.rank}${this.evaluatorSuit}`
    }

    toString(): string {
        return `${this.rank}${this.suit}`;
    }
}