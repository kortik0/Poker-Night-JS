'use client'

import "../styles/globals.css"
import {Table} from "../components/table";
import {Button} from "@mantine/core";
import {useEffect, useState} from "react";


//This is just a scrap of ideas which would be decomposed. But for now it is what it is.
export const metadata = {
    title: "Poker Night",
}

export default function Main() {
    const [table, setNewTable] = useState(() => {
        const newTable = new Table();
        newTable.registerNewPlayer('Player 1');
        newTable.registerNewPlayer('Player 2');
        newTable.startGame();
        return newTable;
    });

    useEffect(() => {
        // Update the table state to trigger a re-render
        setNewTable((prevTable) => prevTable.getCopyTable());
    }, [table.currentPlayerPosition]);

    const clickHandler = (action) => {
        // Perform the action based on the button clicked (bet, raise, call, check, fold)
        const player = table.currentPlayerPosition;
        player[action]();

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
                <p>Current player turn is: {table.currentPlayerPosition?.name}</p>
                <p>Current game stage is: {table.currentGameStage}</p>
                {/*Bet and Raise should be calculated*/}
                <Button onClick={() => clickHandler("setBet")}>Bet</Button>
                <Button onClick={() => clickHandler("raise")}>Raise</Button>
                <Button onClick={() => clickHandler("call")}>Call</Button>
                <Button onClick={() => clickHandler("check")}>Check</Button>
                <Button onClick={() => clickHandler("fold")}>Fold</Button>
            </div>
        </>
    )
}