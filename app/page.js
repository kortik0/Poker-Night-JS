"use client"

import "../styles/globals.css"
import {GameStage, Table} from "../components/table";
import {Button, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";

var Hand = require('pokersolver').Hand;
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
        console.log(`Current server hand is: ${table.playersAtTheTable.head.hand}`)

    }, [table.currentPlayerPosition]);

    const handleBet = () => {
        if (bet) {
            table.playerAction("bet", +bet);
            setBet("");
            updateTable();
        }
    };

    const handleRaise = () => {
        if (bet) {
            table.playerAction("raise", +bet);
            setBet("");
            updateTable();
        }
    };

    const handleCall = () => {
        table.playerAction("call", 0); // Amount is calculated within the function
        updateTable();
    };

    const handleCheck = () => {
        table.playerAction("check", 0); // Amount is always 0 for checking
        updateTable();
    };

    const handleFold = () => {
        table.playerAction("fold", 0); // Amount is always 0 for folding
        updateTable();
    };

    const updateTable = () => {
        const newTable = table.getCopyTable();
        setNewTable(newTable)
    }

    let evaluatedHand = table.currentPlayerPosition.getEvaluatedHand();
    let evaluatedTable = table.getEvaluatedCards()

    let evaluateAll = [...evaluatedHand, ...evaluatedTable];

    return (<>
        <div>
            {(evaluatedHand.length && !evaluatedTable.length) &&
                <h1>Evaluated hand: {Hand.solve(evaluatedHand).name}</h1>
            }

            {(evaluatedHand.length && evaluatedTable.length) &&
                <h1>Evaluated hand: {Hand.solve(evaluateAll).name}</h1>
            }

            <p>Current pot is: {table.pot}</p>
            <p>DEBUG playerBet: {table.currentPlayerPosition.currentBet}</p>

            <p>Current player turn is: {table.currentPlayerPosition?.name}</p>
            {/* How did I fix it?*/}
            <p>Current player turn
                is: {table.currentPlayerPosition?.hand[0]?.toString()} / {table.currentPlayerPosition?.hand[1]?.toString()}</p>
            <p>Current game stage is: {table.currentGameStage}</p>
            <p>Current table is: {table?.cardsOnTable.toString()}</p>
            {/*Bet and Raise should be calculated*/}
            {table.currentGameStage !== GameStage.Preparing && <>
                <Button onClick={handleBet}>Bet</Button>
                <Button onClick={handleRaise}>Raise</Button>
                <Button onClick={handleCall}>Call</Button>
                <Button onClick={handleCheck}>Check</Button>
                <Button onClick={handleFold}>Fold</Button>
                <TextInput value={bet} onChange={(e) => {
                    setBet(e.target.value)
                }}/>
            </>}
        </div>
    </>);
};