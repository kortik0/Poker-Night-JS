import {Player} from "./player";

//LinkedList is a set of players and their order
export class LinkedList {
    head: Player;
    tail: Player;
    private length: number;
    private currentPlayerIndex: number = 0;
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    private createPlayer(name) {
        return new Player(name);
    }

    // Add a node to the end of the linked list
    addPlayer(name) {
        const newNode = this.createPlayer(name);

        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }

        this.length++;
    }

    // Remove a node at a specific position
    removeAt(position) {
        if (position < 0 || position >= this.length) {
            throw new Error('Invalid position');
        }

        let currentNode = this.head;
        let previousNode = null;
        let currentPosition = 0;

        if (position === 0) {
            this.head = currentNode.next;
            if (this.length === 1) {
                this.tail = null;
            }
        } else if (position === this.length - 1) {
            while (currentNode.next) {
                previousNode = currentNode;
                currentNode = currentNode.next;
            }
            previousNode.next = null;
            this.tail = previousNode;
        } else {
            while (currentPosition < position) {
                previousNode = currentNode;
                currentNode = currentNode.next;
                currentPosition++;
            }
            previousNode.next = currentNode.next;
        }

        this.length--;
        return currentNode;
    }

    // Get the node value at a specific position
    getAt(position) {
        if (position < 0 || position >= this.length) {
            throw new Error('Invalid position');
        }

        let currentNode = this.head;
        let currentPosition = 0;

        while (currentPosition < position) {
            currentNode = currentNode.next;
            currentPosition++;
        }

        return currentNode;
    }

    // Get the node value
    getNext() {
        const currentNode = this.getAt(this.currentPlayerIndex);
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.length;
        return currentNode;
    }

    getCurrent() {
        return this.currentPlayerIndex;
    }


    // Convert the linked list to an array
    // Its nice fits to task to test or write something
    toArray() {
        const array = [];
        let currentNode = this.head;

        while (currentNode) {
            array.push(currentNode);
            currentNode = currentNode.next;
        }

        return array;
    }

    // Get the size of the linked list
    size() {
        return this.length;
    }

    // Check if the linked list is empty
    isEmpty() {
        return this.length === 0;
    }
}
