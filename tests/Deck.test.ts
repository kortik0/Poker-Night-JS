import {Deck} from "../components/deck";
import {Rank} from "../components/enums/Rank";
import {Card} from "../components/card";
import {Suit} from "../components/enums/Suit";

describe('Deck', () => {

    // Tests that the public method 'getDeckLength()' returns the length of the deck
    it('should return the length of the deck', () => {
        const deck = new Deck();
        expect(deck.getDeckLength()).toEqual(52);
    });

    // Tests that a card is created successfully
    it('should create a card with rank and suit', () => {
        const card = new Card(Rank.Ace, Suit.Hearts);
        expect(card.toString()).toBe('A♥');
    });

    // Tests that a deck is shuffled successfully
    it('should shuffle the deck', () => {
        const deck = new Deck();
        const originalOrder = deck.toString();
        deck.shuffle();
        expect(deck.toString()).not.toBe(originalOrder);
    });

    // Tests that a card is drawn from the deck successfully
    it('should draw a card from the deck', () => {
        const deck = new Deck();
        const card = deck.draw();
        expect(card).toBeInstanceOf(Card);
    });

    // Tests that a hand of cards is dealt successfully
    it('should deal a hand of cards', () => {
        const deck = new Deck();
        const hand = deck.getHand();
        expect(hand).toHaveLength(2);
        expect(hand[0]).toBeInstanceOf(Card);
        expect(hand[1]).toBeInstanceOf(Card);
    });

    // Tests that a flop of cards is dealt successfully
    it('should deal a flop of cards', () => {
        const deck = new Deck();
        const flop = deck.getFlop();
        expect(flop).toHaveLength(3);
        expect(flop[0]).toBeInstanceOf(Card);
        expect(flop[1]).toBeInstanceOf(Card);
        expect(flop[2]).toBeInstanceOf(Card);
    });
});
