// Ensure that this part is at the top
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

function signUp() {
    const username = document.getElementById('signUpUsername').value.toLowerCase();
    const password = document.getElementById('signUpPassword').value;
    let initialBalance = parseFloat(document.getElementById('initialBalance').value);

    if (!username || !password || initialBalance < 5000) {
        console.log('low balance')
        alert("Please fill all fields. Initial balance must be at least ₹5,000.");
        return;
    }

    if (users.some(user => user.username === username)) {
        console.log('failed login')
        alert("Username already exists. Please choose another.");
        return;
    }

    const newUser = { username, password, balance: initialBalance };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('successful signup')
    alert("Sign-up successful!");
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    window.location.href = 'index.html';
}

function login() {
    const username = document.getElementById('loginUsername').value.toLowerCase();
    const password = document.getElementById('loginPassword').value;

    // This line should work now because users are initialized at the top
    currentUser = users.find(user => user.username === username && user.password === password);
    
    if (!currentUser) {
        alert("Invalid login credentials.");
        console.log('invalid credentials')
        return;
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    if (currentUser.balance < 5000) {
        console.log('low balance notif');
        showNotification("Low balance! Please add funds to keep your balance above ₹5,000.");
    }
    console.log('successful login')

    updateWalletDisplay();
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.style.display = 'block';
    notification.innerText = message;
}

function clearNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'none';
    notification.innerText = '';
}

function updateWalletDisplay() {
    document.getElementById('walletBalance').style.display = 'block';
    document.getElementById('balanceAmount').innerText = currentUser.balance;
    clearNotification();
}

// Show Add Balance Modal using Bootstrap
function showAddBalanceModal() {
    const addBalanceModal = new bootstrap.Modal(document.getElementById('addBalanceModal'));
    addBalanceModal.show();
}

// Close Add Balance Modal using Bootstrap
function closeAddBalanceModal() {
    const addBalanceModal = bootstrap.Modal.getInstance(document.getElementById('addBalanceModal'));
    if (addBalanceModal) {
        addBalanceModal.hide();
    }
}
// Add Balance Functionality
function addBalance() {
    const balanceToAdd = parseFloat(document.getElementById('balanceToAdd').value);

    if (isNaN(balanceToAdd) || balanceToAdd <= 0) {
        alert("Please enter a valid amount to add.");
        return;
    }

    currentUser.balance += balanceToAdd;

    updateUserInfoInLocalStorage();
    updateWalletDisplay();
    closeAddBalanceModal();

    showNotification(`₹${balanceToAdd} has been added to your wallet. Current balance: ₹${currentUser.balance}`);
}

function updateUserInfoInLocalStorage() {
    users = users.map(user => user.username === currentUser.username ? currentUser : user);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}
