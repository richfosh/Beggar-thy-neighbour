const p1El = document.getElementById('p1-hand');
const p2El = document.getElementById('p2-hand');
const pileEl = document.getElementById('center-pile');
const statusEl = document.getElementById('status');
const turnCounterEl = document.getElementById('turn-counter');
const btn = document.getElementById('action-btn');

const SUITS = [
    { s: '♠', c: 'black' }, { s: '♣', c: 'black' },
    { s: '♥', c: 'red' },   { s: '♦', c: 'red' }
];
const VALS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

let p1 = [], p2 = [], pile = [];
let turn = 0, penalty = 0, totalTurns = 0;

function getFace(v) {
    if (v <= 10) return v;
    return { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' }[v];
}

function render() {
    autoRender(p1, p1El);
    autoRender(p2, p2El);
    autoRender(pile, pileEl);
    document.getElementById('p1-count').textContent = p1.length;
    document.getElementById('p2-count').textContent = p2.length;
    document.getElementById('pile-count').textContent = pile.length;
    turnCounterEl.textContent = `Total Turns: ${totalTurns}`;
}

function autoRender(arr, el) {
    el.innerHTML = arr.map(c => 
        `<div class="${c.color}">${getFace(c.val)}${c.suit}</div>`
    ).join('');
}

async function startGame() {
    btn.style.display = 'none';
    let deck = [];
	
	// SUITS.forEach(s => VALS.forEach(v => deck.push({ val: v, suit: s.s, color: s.c })));
    // deck.sort(() => Math.random() - 0.5);
	
	deck.push({val: 2, suit: "♥", color: "red"});
	deck.push({val: 3, suit: "♥", color: "red"});
	deck.push({val: 4, suit: "♥", color: "red"});
	deck.push({val: 5, suit: "♥", color: "red"});
	deck.push({val: 13, suit: "♥", color: "red"});
	deck.push({val: 6, suit: "♥", color: "red"});
	deck.push({val: 7, suit: "♥", color: "red"});
	deck.push({val: 8, suit: "♥", color: "red"});
	deck.push({val: 14, suit: "♥", color: "red"});
	deck.push({val: 9, suit: "♥", color: "red"});
	deck.push({val: 13, suit: "♣", color: "black"});
	deck.push({val: 12, suit: "♥", color: "red"});
	deck.push({val: 12, suit: '♦', color: "red"});
	
	deck.push({val: 11, suit: "♥", color: "red"});
	deck.push({val: 10, suit: "♥", color: "red"});
	deck.push({val: 14, suit: '♦', color: "red"});
	deck.push({val: 2, suit: "♣", color: "black"});
	deck.push({val: 3, suit: "♣", color: "black"});
	deck.push({val: 4, suit: "♣", color: "black"});
	deck.push({val: 5, suit: "♣", color: "black"});
	deck.push({val: 14, suit: "♣", color: "black"});
	deck.push({val: 14, suit: '♠', color: "black"});
	deck.push({val: 11, suit: "♣", color: "black"});
	deck.push({val: 6, suit: "♣", color: "black"});
	deck.push({val: 7, suit: "♣", color: "black"});
	deck.push({val: 11, suit: '♦', color: "red"});
	
	deck.push({val: 8, suit: "♣", color: "black"});
	deck.push({val: 9, suit: "♣", color: "black"});
	deck.push({val: 10, suit: "♣", color: "black"});
	deck.push({val: 2, suit: '♦', color: "red"});
	deck.push({val: 3, suit: '♦', color: "red"});
	deck.push({val: 4, suit: '♦', color: "red"});
	deck.push({val: 5, suit: '♦', color: "red"});
	deck.push({val: 6, suit: '♦', color: "red"});
	deck.push({val: 7, suit: '♦', color: "red"});
	deck.push({val: 8, suit: '♦', color: "red"});
	deck.push({val: 9, suit: '♦', color: "red"});
	deck.push({val: 12, suit: "♣", color: "black"});
	deck.push({val: 10, suit: '♦', color: "red"});
	
	deck.push({val: 2, suit: '♠', color: "black"});
	deck.push({val: 3, suit: '♠', color: "black"});
	deck.push({val: 4, suit: '♠', color: "black"});
	deck.push({val: 13, suit: '♦', color: "red"});
	deck.push({val: 12, suit: '♠', color: "black"});
	deck.push({val: 5, suit: '♠', color: "black"});
	deck.push({val: 13, suit: '♠', color: "black"});
	deck.push({val: 6, suit: '♠', color: "black"});
	deck.push({val: 11, suit: '♠', color: "black"});
	deck.push({val: 7, suit: '♠', color: "black"});
	deck.push({val: 8, suit: '♠', color: "black"});
	deck.push({val: 9, suit: '♠', color: "black"});
	deck.push({val: 10, suit: '♠', color: "black"});
		
    p1 = deck.slice(0, 26);
    p2 = deck.slice(26, 52);
    pile = []; turn = 0; penalty = 0; totalTurns = 0;

    while (p1.length > 0 && p2.length > 0) {
        await step(); // Wait for the turn logic (including pauses) to finish
        render();
        await new Promise(r => setTimeout(r, 100)); // Main game speed
    }
    statusEl.textContent = p1.length === 0 ? "P2 Wins" : "P1 Wins";
    btn.style.display = 'inline-block';
}

async function step() {
    let current = (turn === 0) ? p1 : p2;
    if (current.length === 0) return;

    let card = current.shift();
    pile.push(card);
    totalTurns++; 
    
    statusEl.textContent = `P${turn + 1} plays ${getFace(card.val)}${card.suit}`;
    
    // Force a render immediately after the card is added to the pile
    render();

    if (card.val > 10) {
        penalty = card.val - 10;
        turn = (turn === 0) ? 1 : 0;
    } else if (penalty > 0) {
        penalty--;
        if (penalty === 0) {
            // Wait a moment so the user sees the card that failed the penalty
            //statusEl.textContent = `Penalty failed! P${((turn === 0) ? 2 : 1)} takes the pile.`;
            await new Promise(r => setTimeout(r, 100)); 
            
            let winner = (turn === 0) ? p2 : p1;
            winner.push(...pile);
            pile = [];
            turn = (turn === 0) ? 1 : 0;
        }
    } else {
        turn = (turn === 0) ? 1 : 0;
    }
}

btn.addEventListener('click', startGame);