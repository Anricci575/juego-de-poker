const suits = ['♥️', '♦️', '♣️', '♠️'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let playerBalance = 1000; // Saldo inicial del jugador
let playerBet = 0;
let betPlaced = false; // Variable para verificar si se ha colocado una apuesta

function createDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ value, suit });
        }
    }
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function dealHand(deck) {
    return deck.splice(0, 5);
}

function displayHand(hand, elementId) {
    const handElement = document.getElementById(elementId);
    handElement.innerHTML = '';
    hand.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = `${card.value}${card.suit}`;
        handElement.appendChild(cardElement);

        // Animar el reparto de cartas
        setTimeout(() => {
            cardElement.classList.add('dealt');
        }, index * 200);
    });
}

function getHandRanking(hand) {
    // Implementar lógica de ranking de manos aquí
    // Por simplicidad, asume que el ranking es aleatorio
    const rankings = ['Alta Carta', 'Pareja', 'Doble Pareja', 'Trío', 'Escalera', 'Color', 'Full House', 'Póker', 'Escalera de Color', 'Escalera Real'];
    return rankings[Math.floor(Math.random() * rankings.length)];
}

function determineWinner(playerHand, dealerHand) {
    const playerRanking = getHandRanking(playerHand);
    const dealerRanking = getHandRanking(dealerHand);

    // Mensajes para el ranking
    document.getElementById('game-messages').innerHTML = `Mano del Jugador: ${playerRanking}<br>Mano del Dealer: ${dealerRanking}`;

    // Determinar el ganador (simulación sencilla)
    if (Math.random() > 0.5) {
        return 'Ganas';
    } else {
        return 'Pierdes';
    }
}

function updateBalance(result) {
    if (result === 'Ganas') {
        playerBalance += playerBet;
        document.getElementById('game-messages').innerHTML += `<br>Has ganado ${playerBet}! Saldo actual: ${playerBalance}`;
    } else {
        playerBalance -= playerBet;
        document.getElementById('game-messages').innerHTML += `<br>Has perdido ${playerBet}. Saldo actual: ${playerBalance}`;
    }

    // Actualizar el saldo en la interfaz
    const balanceElement = document.getElementById('player-balance');
    balanceElement.textContent = playerBalance;
    balanceElement.classList.add('balance-animation');
    setTimeout(() => {
        balanceElement.classList.remove('balance-animation');
    }, 1000);

    // Mostrar advertencia si el saldo es insuficiente
    const warningMessage = document.getElementById('warning-message');
    if (playerBalance < 5) {
        warningMessage.style.display = 'block';
        document.getElementById('deal-button').disabled = true;
        document.getElementById('chips-image').removeEventListener('click', placeBet);
    } else {
        warningMessage.style.display = 'none';
        document.getElementById('deal-button').disabled = false;
        document.getElementById('chips-image').addEventListener('click', placeBet);
    }
}

function displayChips(amount) {
    const chipsContainer = document.getElementById('chips-container');
    chipsContainer.innerHTML = '';
    let chipValues = [1000, 500, 200, 100, 50, 35, 25, 10, 5];
    let chipImages = {
        1000: 'images/chip-1000.png',
        500: 'images/chip-500.png',
        200: 'images/chip-200.png',
        100: 'images/chip-100.png',
        50: 'images/chip-50.png',
        35: 'images/chip-35.png',
        25: 'images/chip-25.png',
        10: 'images/chip-10.png',
        5: 'images/chip-5.png'
    };

    chipValues.forEach(value => {
        while (amount >= value) {
            const chipElement = document.createElement('div');
            chipElement.className = 'chip';
            chipElement.style.backgroundImage = `url(${chipImages[value]})`;
            chipsContainer.appendChild(chipElement);

            // Animar las fichas
            setTimeout(() => {
                chipElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    chipElement.style.transform = 'scale(1)';
                }, 500);
            }, 100);

            amount -= value;
        }
    });
}

document.getElementById('bet-buttons-container').addEventListener('click', (event) => {
    if (event.target.classList.contains('bet-button')) {
        playerBet = parseInt(event.target.getAttribute('data-value'));
        if (playerBet > playerBalance) {
            alert('No tienes suficiente saldo para esa apuesta.');
            return;
        }
        displayChips(playerBet);
    }
});

document.getElementById('chips-image').addEventListener('click', () => {
    if (playerBet <= 0) {
        alert('Por favor, selecciona una cantidad para apostar.');
        return;
    }
    betPlaced = true;
    document.getElementById('deal-button').disabled = false;
});

document.getElementById('deal-button').addEventListener('click', () => {
    if (!betPlaced) {
        alert('Por favor, realiza una apuesta primero.');
        return;
    }

    let deck = shuffleDeck(createDeck());
    let playerHand = dealHand(deck);
    let dealerHand = dealHand(deck);

    displayHand(playerHand, 'player-hand');
    displayHand(dealerHand, 'dealer-hand');

    const result = determineWinner(playerHand, dealerHand);
    const gameMessages = document.getElementById('game-messages');
    gameMessages.innerHTML += `<br>${result}`;
    gameMessages.className = result === 'Ganas' ? 'win' : 'lose';

    updateBalance(result);
    playerBet = 0;
    betPlaced = false; // Restablecer la variable de apuesta
    document.getElementById('deal-button').disabled = true;
});