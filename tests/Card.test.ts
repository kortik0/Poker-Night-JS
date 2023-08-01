import {Card} from '../components/card';
import {Rank} from "../components/enums/Rank";
import {Suit} from "../components/enums/Suit";

describe('Card class', () => {
    test('toString should return the correct string representation', () => {
        const card1 = new Card(Rank.Ace, Suit.Spades);
        const card2 = new Card(Rank.Four, Suit.Diamonds);

        expect(card1.toString()).toBe('A♠');
        expect(card2.toString()).toBe('4♦');
    });
});
