"use client"

import "../styles/globals.css"
import {GameStage, Table} from "../components/table";
import {Button, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";

//This is just a scrap of ideas which would be decomposed. But for now it is what it is.
export const metadata = {
    title: "Poker Night",
}

//TODO: Make components
//TODO: Decompose it (yeet)
export default function Main() {
    const [needTimeout, setNeedTimeout] = useState(false);

    // Field of Input to store the value
    const [bet, setBet] = useState("")

    // Store currentRound bet
    const [roundBet, setRoundBet] = useState(0);

    const [table, setNewTable] = useState(() => {
        const newTable = new Table();
        newTable.registerNewPlayer('Player 1');
        newTable.registerNewPlayer('Player 2');
        newTable.startGame();
        return newTable;
    });

    useEffect(() => {
        if (needTimeout === false || table.currentGameStage !== GameStage.Preparing) {
        }
        const timeoutHandler = () => {
            console.log("Line 27")
            table.gameStageSwitch(table.nextGameStage());
            updateTable();
        };

        const timeout = setTimeout(timeoutHandler, 1000);
        setNeedTimeout(false);

        return () => clearTimeout(timeout);
    }, [needTimeout])

    useEffect(() => {
        // Update the table state to trigger a re-render
        setNewTable((prevState) => prevState.getCopyTable());
    }, [table.currentPlayerPosition]);

    const clickHandler = (action) => {
        // Perform the action based on the button clicked (bet, raise, call, check, fold)
        const player = table.currentPlayerPosition;

        // Losed chips is kinda sus name, but it's about player bet
        let losedChips = 0;

        if (Number(bet) >= table.currentHighestStake) {
            table.currentHighestStake = +bet;
        }

        // Let's assume it's acceptable, but it's worth rewriting
        switch (action) {
            case "setBet":
            case "raise":
                losedChips = player[action](bet);
                break;
            case "check":
            case "fold":
                losedChips = player[action]();
                break;
            case "call":
                losedChips = player[action](table.currentHighestStake);
                break;
        }

        let currentRoundBet = roundBet;
        currentRoundBet += +losedChips;

        setRoundBet(currentRoundBet);
        setBet("");

        console.log(currentRoundBet);
        console.log(roundBet);
        //I need some rerender here to activate this state changes.
        updateTable();

        if (table.isMovedRound() && table.currentGameStage === GameStage.Ending) {
            table.restartGame();
            setNeedTimeout(true);

            updateTable();
            return;
        }

        // If we moved around we should switch gameStage
        if (table.isMovedRound() && isStakesEqual()) {
            table.pot += currentRoundBet;

            table.resetPlayerOrder();
            table.gameStageSwitch(table.nextGameStage());

            setRoundBet(0);

            updateTable();
            return;
        }

        if (table.isMovedRound() && !isStakesEqual()) {
            table.resetPlayerOrder();

            updateTable();
            return;
        }

        // Move the turn to the next player
        table.nextPlayer();

        // Update the table state to trigger a re-render
        updateTable()
    };

    const isStakesEqual = () => {
        return table.currentHighestStake && table.playersAtTheTable.toArray().every((player) => {
            console.log(`${player.name} - ${player.currentBet}`)
            console.log(`Highest stake - ${table.currentHighestStake}`)
            return player.currentBet === table.currentHighestStake || player.isFolded === true;
        })
    }

    const updateTable = () => {
        const newTable = table.getCopyTable();
        setNewTable(newTable)
    }

    return (<>
        <div>
            <p>Current pot is: {table.pot}</p>
            <p>Current roundBet is: {roundBet}</p>

            <p>DEBUG roundBet: {roundBet}</p>
            <p>DEBUG playerBet: {table.currentPlayerPosition.currentBet}</p>

            <p>Current player turn is: {table.currentPlayerPosition?.name}</p>
            {/* How did I fix it?*/}
            <p>Current player turn
                is: {table.currentPlayerPosition?.hand[0]?.toString()} / {table.currentPlayerPosition?.hand[1]?.toString()}</p>
            <p>Current game stage is: {table.currentGameStage}</p>
            <p>Current table is: {table?.cardsOnTable.toString()}</p>
            {/*Bet and Raise should be calculated*/}
            {table.currentGameStage !== GameStage.Preparing && <>
                <Button onClick={() => clickHandler("setBet")}>Bet</Button>
                <Button onClick={() => clickHandler("raise")}>Raise</Button>
                <Button onClick={() => clickHandler("call")}>Call</Button>
                <Button onClick={() => clickHandler("check")}>Check</Button>
                <Button onClick={() => clickHandler("fold")}>Fold</Button>
                <TextInput value={bet} onChange={(e) => {
                    setBet(e.target.value)
                }}/>
            </>}
        </div>
    </>)
};