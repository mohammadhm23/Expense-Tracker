const userName = localStorage.getItem('userName');
const balanceDisplay = document.getElementById('totalAmount');
const incomeDisplay = document.getElementById('incomeAmount');
const outcomeDisplay = document.getElementById('outcomeAmount');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const currencySelect = document.getElementById('currency');
const transactionList = document.getElementById('transactionList');

let transactions = JSON.parse(localStorage.getItem(userName)) || [];


fetch('https://ivory-ostrich-yoke.cyclic.app/students/available')
    .then(response => response.json())
    .then(data => {
        data.forEach(currency => {
            const option = document.createElement('option');
            option.text = `${currency.name} (${currency.symbol})`;
            option.value = currency.code;
            currencySelect.add(option);
        });
    });


async function convertAmount(amount, fromCurrency, toCurrency) {
    const response = await fetch('https://ivory-ostrich-yoke.cyclic.app/students/convert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: parseFloat(amount),
            from: fromCurrency,
            to: toCurrency
        })
    });
    const data = await response.json();
    return data.convertedAmount;
}


function updateBalance() {
    let income = 0;
    let outcome = 0;
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            income += transaction.amount;
        } else {
            outcome += transaction.amount;
        }
    });
    balanceDisplay.textContent = `$${(income - outcome).toFixed(2)}`;
    incomeDisplay.textContent = `$${income.toFixed(2)}`;
    outcomeDisplay.textContent = `$${outcome.toFixed(2)}`;
}


function renderTransactions() {
    transactionList.innerHTML = '';
    transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.textContent = `${transaction.type.toUpperCase()}: ${transaction.amount} ${transaction.currency}`;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            transactions.splice(index, 1);
            localStorage.setItem(userName, JSON.stringify(transactions));
            renderTransactions();
            updateBalance();
        });
        li.appendChild(deleteButton);
        transactionList.appendChild(li);
    });
}


document.getElementById('requestButton').addEventListener('click', function() {
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;
    const currency = currencySelect.value;

    convertAmount(amount, currency, 'USD')
        .then(convertedAmount => {
            transactions.push({
                amount: convertedAmount,
                type,
                currency
            });
            localStorage.setItem(userName, JSON.stringify(transactions));
            renderTransactions();
            updateBalance();
            amountInput.value = '';
        });
});


document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = 'index.html';
});


renderTransactions();
updateBalance();
