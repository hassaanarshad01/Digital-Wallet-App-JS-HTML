// Global variables
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
// Set greeting and balance display based on currentUser data
document.getElementById('userGreeting').innerText = currentUser ? `Hello, ${currentUser.username}!` : 'Guest account';
document.getElementById('userBalance').innerText = currentUser ? `  Balance: $${currentUser.balance.toFixed(2)}` : 'No balance';

// Dynamically set the auth button text based on whether the user is logged in
const authButton = document.getElementById('authButton');
if (currentUser) {
    authButton.innerText = 'Log out';
    authButton.href = '#'; // Prevents redirecting to authenticate page for logging out
    authButton.addEventListener('click', () => {
        // Clear currentUser from localStorage and reload page to reflect logged-out state
        localStorage.removeItem('currentUser');
        window.location.reload();
    });
} else {
    authButton.innerText = 'Sign up/Log in';
    authButton.href = 'authenticate.html'; // Redirects to login/signup page
}

let cart = [];

// Function to add a product to the cart
function addToCart(product, quantity) {
  // Find the product in the cart or create a new entry
  let cartItem = cart.find(item => item.product === product);
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  // Update the cart badge
  updateCartBadge();
}

// Function to update the cart badge
function updateCartBadge() {
  const cartBadge = document.querySelector('.cart-button .badge');
  cartBadge.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Function to show the cart modal
function showCartModal() {
    document.body.style.overflow = 'hidden';  // Disable scrolling
  //document.body.classList.add('modal-open');
  const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
  cartModal.show();

  // Populate the cart table
  const cartTableBody = document.getElementById('cart-table-body');
  cartTableBody.innerHTML = '';
  let totalPrice = 0;
  cart.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.product}</td>
      <td>${item.quantity}</td>
      <td>$${(9.99 * item.quantity).toFixed(2)}</td>
    `;
    cartTableBody.appendChild(row);
    totalPrice += 9.99 * item.quantity;
  });

  // Update the total price
  document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
}

function hideCartModal() {
    //document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';   // Enable scrolling
    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    cartModal.hide();
  }

// Function to handle the checkout process
function handleCheckout() {
  // Check if a user is logged in
  if (!currentUser) {
    alert('Please log in to checkout.');
    return;
  }

  // Deduct the total price from the user's balance
  const totalPrice = cart.reduce((total, item) => total + (9.99 * item.quantity), 0);
  if (currentUser.balance >= totalPrice) {
    currentUser.balance -= totalPrice;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert('Checkout successful!');
    cart = [];
    updateCartBadge();
    showCartModal();
  } else {
    alert('Insufficient balance.');
  }
}

// Add event listeners to the plus and minus buttons
document.querySelectorAll('.plus-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const productName = btn.closest('.product-card').querySelector('.card-title').textContent;
    const quantityIndicator = btn.closest('.quantity-controls').querySelector('.quantity-indicator');
    let quantity = parseInt(quantityIndicator.textContent);
    quantity++;
    quantityIndicator.textContent = quantity;
    addToCart(productName, 1);
  });
});

document.querySelectorAll('.minus-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const productName = btn.closest('.product-card').querySelector('.card-title').textContent;
    const quantityIndicator = btn.closest('.quantity-controls').querySelector('.quantity-indicator');
    let quantity = parseInt(quantityIndicator.textContent);
    if (quantity > 0) {
      quantity--;
      quantityIndicator.textContent = quantity;
      addToCart(productName, -1);
    }
  });
});

// Add event listener to the cart button
document.querySelector('.cart-button').addEventListener('click', showCartModal);
document.querySelectorAll('.btn-close, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', hideCartModal);
  });
document.addEventListener('hidden.bs.modal', function () {
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => backdrop.remove());
  document.body.style.overflow = 'auto';   // Enable scrolling
});
// Add event listener to the checkout button
document.getElementById('checkout-btn').addEventListener('click', handleCheckout);