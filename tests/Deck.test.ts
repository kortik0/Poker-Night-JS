import {Deck} from "../components/deck";
import {Card} from "../components/card";

describe('Deck class', () => {
    let deck: Deck;

    beforeEach(() => {
        deck = new Deck();
    });

    test('should create a deck with 52 cards', () => {
        expect(deck.toString().split(",").length).toBe(52);
    });

    test('should get a hand of 2 cards', () => {
        const hand = deck.getHand();
        expect(hand.length).toBe(2);
        expect(deck.toString().split(",").length).toBe(50);
    });

    test('should get a flop of 3 cards', () => {
        const flop = deck.getFlop();
        expect(flop.length).toBe(3);
        expect(deck.toString().split(",").length).toBe(49);
    });

    test('should draw a card from the deck', () => {
        const card = deck.draw();
        expect(card).toBeInstanceOf(Card);
        expect(deck.toString().split(",").length).toBe(51);
    });

    // test('should throw an error when drawing from an empty deck', () => {
    //     deck = new Deck();
    //     while (deck.draw()) {
    //     }
    //
    //     expect(() => deck.draw()).toThrow('The deck is empty');
    // });
});
