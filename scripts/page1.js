document.getElementById('trackButton').addEventListener('click', function() {
    const userName = document.getElementById('userName').value;
    localStorage.setItem('userName', userName);
    window.location.href = 'transactions.html';
});
