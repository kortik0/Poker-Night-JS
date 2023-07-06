"use client"

import "../styles/globals.css"
import {GameStage, Table} from "../components/table";
import {Button, Text, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";

//This is just a scrap of ideas which would be decomposed. But for now it is what it is.
export const metadata = {
    title: "Poker Night",
}

//TODO: Make components
//TODO: Decompose it (yeet)
export default function Main() {
    const [needTimeout, setNeedTimeout] = useState(false);

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
    }, [table.currentPlayerPosition]);

    const clickHandler = (action) => {
        // Perform the action based on the button clicked (bet, raise, call, check, fold)
        const player = table.currentPlayerPosition;

        const losedChips = player[action](bet);
        table.pot += +losedChips;

        if (table.isMovedRound() && table.currentGameStage === 6) {
            table.restartGame();
            updateTable();
            setNeedTimeout(true);
            return;
        }

        // If we moved around we should switch gameStage
        if (table.isMovedRound()) {
            table.resetPlayerOrder();
            table.gameStageSwitch(table.nextGameStage());
            updateTable();
            return;
        }

        // Move the turn to the next player
        table.nextPlayer();

        // Update the table state to trigger a re-render
        updateTable()
    };

    const updateTable = () => {
        const newTable = table.getCopyTable();
        setNewTable(newTable)
    }

    return (
        <>
            <div>
                <p>Current pot is: {table.pot}</p>
                <p>Current player turn is: {table.currentPlayerPosition?.name}</p>
                {/* How did I fix it?*/}
                <p>Current player turn
                    is: {table.currentPlayerPosition?.hand[0]?.toString()} / {table.currentPlayerPosition?.hand[1]?.toString()}</p>
                <p>Current game stage is: {table.currentGameStage}</p>
                <p>Current table is: {table?.cardsOnTable.toString()}</p>
                {/*Bet and Raise should be calculated*/}
                {table.currentGameStage !== GameStage.Preparing &&
                    <>
                        <Button onClick={() => clickHandler("setBet")}>Bet</Button>
                        <Button onClick={() => clickHandler("raise")}>Raise</Button>
                        <TextInput value={bet} onChange={(e) => {
                            setBet(e.target.value)
                        }}/>
                        <Button onClick={() => clickHandler("call")}>Call</Button>
                        <Button onClick={() => clickHandler("check")}>Check</Button>
                        <Button onClick={() => clickHandler("fold")}>Fold</Button>
                    </>
                }
            </div>
        </>
    )
}