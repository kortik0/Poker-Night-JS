import {Card} from '../components/card';
import {Rank} from "../components/enums/Rank";
import {Suit} from "../components/enums/Suit";

describe('Card class', () => {

    // Tests that a card can be created with a valid rank and suit
    it('should create a card with a valid rank and suit', () => {
        const card = new Card(Rank.Ace, Suit.Hearts);
        expect(card.toString()).toBe('A♥');
    });

    // Tests that the toString() method returns the correct string representation of a card
    it('should return the correct string representation of a card', () => {
        const card = new Card(Rank.King, Suit.Clubs);
        expect(card.toString()).toBe('K♣');
    });

    // Tests that an error is thrown when creating a card with an invalid rank
    it('should throw an error when creating a card with an invalid rank', () => {
        expect(() => new Card('invalidRank' as Rank, Suit.Diamonds)).toThrow();
    });

    // Tests that an error is thrown when creating a card with an invalid suit
    it('should throw an error when creating a card with an invalid suit', () => {
        expect(() => new Card(Rank.Five, 'invalidSuit' as Suit)).toThrow();
    });

    // Tests that an error is thrown when creating a card with null rank
    it('should throw an error when creating a card with null rank', () => {
        expect(() => new Card(null as Rank, Suit.Spades)).toThrow();
    });

    // Tests that an error is thrown when creating a card with null suit
    it('should throw an error when creating a card with null suit', () => {
        expect(() => new Card(Rank.Seven, null as Suit)).toThrow();
    });
});
