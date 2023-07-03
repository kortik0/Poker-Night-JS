import {Card} from "./card";

export class Deck {
    private readonly cards: any[];
    constructor() {
        this.cards = [];
        this.createDeck();
        this.shuffle();
    }

    createDeck() {
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const suits = ['♠', '♦', '♥', '♣'];

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
        const hand = []
        for (let i = 0; i < 2; i++) {
            hand.push(this.draw());
        }

        return hand;
    }

    getFlop(): Card[] {
        const hand = []
        for (let i = 0; i < 3; i++) {
            hand.push(this.draw());
        }

        return hand;
    }

    draw(): Card {
        if (this.cards.length === 0) {
            throw new Error('The deck is empty');
        }

        return this.cards.pop();
    }

    toString() {
        return this.cards.join(', ');
    }
}
