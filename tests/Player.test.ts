import {Player} from "../components/player";

describe('Player', () => {

    // Tests that setBet method sets the current bet and decreases the chips accordingly
    it('should decrease chips and set current bet when bet is less than chips', () => {
        const player = new Player('Test Player');
        player.setBet(500);
        expect(player.chips).toBe(500);
        expect(player.currentBet).toBe(500);
    });

    // Tests that setBet method sets the current bet to all chips when the bet is larger than the chips
    it('should set current bet to all chips when bet is larger than chips', () => {
        const player = new Player('Test Player');
        player.setBet(2000);
        expect(player.chips).toBe(0);
        expect(player.currentBet).toBe(1000);
    });

    // Tests that call method decreases the chips and increases the current bet accordingly
    it('should decrease chips and increase current bet when calling', () => {
        const player = new Player('Test Player');
        player.setBet(500);
        player.call(1000);
        expect(player.chips).toBe(0);
        expect(player.currentBet).toBe(1000);
    });

    // Tests that call method decreases the chips to 0 and increases the current bet to all chips when the tableHighestStake is larger than the chips
    it('should decrease chips to 0 and increase current bet to all chips when calling with tableHighestStake larger than chips', () => {
        const player = new Player('Test Player');
        player.setBet(500);
        player.call(2000);
        expect(player.chips).toBe(0);
        expect(player.currentBet).toBe(1000);
    });

    // Tests that raise method increases the current bet and decreases the chips accordingly
    it('should increase current bet and decrease chips when raising', () => {
        const player = new Player('Test Player');
        player.setBet(500);
        player.raise(500);
        expect(player.chips).toBe(0);
        expect(player.currentBet).toBe(1000);
    });

    // Tests that raise method increases the current bet to all chips and decreases the chips to 0 when the raise amount is larger than the chips
    it('should increase current bet to all chips and decrease chips to 0 when raising with amount larger than chips', () => {
        const player = new Player('Test Player');
        player.setBet(500);
        player.raise(2000);
        expect(player.chips).toBe(0);
        expect(player.currentBet).toBe(1000);
    });

});
