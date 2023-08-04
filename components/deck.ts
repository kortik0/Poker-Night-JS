import { Card } from "./card";
import { Rank } from "./enums/Rank";
import { Suit } from "./enums/Suit";

export class Deck {
    private readonly cards: Card[];
    constructor() {
        this.cards = [];
        this.createDeck();
        this.shuffle();
    }

    createDeck() {
        const ranks = Object.values(Rank);
        const suits = Object.values(Suit);

        for (const suit of suits) {
            for (const rank of ranks) {
                this.cards.push(new Card(rank, suit));
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    getHand(): Card[] {
        const hand: Card[] = [];
        for (let i = 0; i < 2; i++) {
            hand.push(this.draw());
        }

        return hand;
    }

    getFlop(): Card[] {
        const flop: Card[] = [];
        for (let i = 0; i < 3; i++) {
            flop.push(this.draw());
        }

        return flop;
    }

    draw(): Card {
        if (this.cards.length === 0) {
            throw new Error('The deck is empty');
        }

        return this.cards.pop()!;
    }

    getDeckLength() {
        return this.cards.length;
    }

    toString() {
        return this.cards.join(', ');
    }
}
