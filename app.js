const walletItems = [];
// Set greeting and balance display based on currentUser data
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
document.getElementById('userGreeting').innerText = currentUser ? `Hello, ${currentUser.username}!` : 'Guest account';
document.getElementById('userBalance').innerText = currentUser ? ` Balance: $${currentUser.balance.toFixed(2)}` : 'No balance';
document.getElementById('autofillButton').addEventListener('click', autofillDetails);

// Dynamically set the auth button text based on whether the user is logged in
const authButton = document.getElementById('authButton');
if (currentUser) {
    authButton.innerText = 'Log out';
    authButton.href = 'authenticate.html'; // Prevents redirecting to authenticate page for logging out
    authButton.addEventListener('click', () => {
        // Clear currentUser from localStorage and reload page to reflect logged-out state
        localStorage.removeItem('currentUser');
        window.location.reload();
    });
} else {
    authButton.innerText = 'Sign up/Log in';
    authButton.href = 'authenticate.html'; // Redirects to login/signup page
}
// Retrieve items from Local Storage on page load
document.addEventListener('DOMContentLoaded', () => {
    const storedItems = localStorage.getItem('walletItems');
    if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        parsedItems.forEach(item => item.dateAdded = new Date(item.dateAdded)); // Convert date string back to Date
        walletItems.push(...parsedItems);
        displayItems();
    }
});

document.getElementById('addItemForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const itemType = document.getElementById('itemType').value;
    const itemName = document.getElementById('itemName').value;
    const itemDetails = document.getElementById('itemDetails').value;
    const itemImageInput = document.getElementById('itemImage').files[0];

    if (itemImageInput) {
        // Convert image to base64
        const reader = new FileReader();
        reader.onload = function(event) {
            const itemImage = event.target.result; // Base64 image data

            const newItem = {
                type: itemType,
                name: itemName,
                details: itemDetails,
                image: itemImage,
                dateAdded: new Date().toISOString() // Store date as ISO string
            };

            addItemToWallet(newItem);
        };
        reader.readAsDataURL(itemImageInput);
    } else {
        // Create item without image
        const newItem = {
            type: itemType,
            name: itemName,
            details: itemDetails,
            image: null, // No image
            dateAdded: new Date().toISOString() // Store date as ISO string
        };

        addItemToWallet(newItem);
    }

    this.reset();
});

function addItemToWallet(item) {
    walletItems.push(item);
    localStorage.setItem('walletItems', JSON.stringify(walletItems));
    displayItems();
}

// Function to display items in the wallet
function displayItems(filterType = '') {
    const walletContainer = document.getElementById('walletItems');
    walletContainer.innerHTML = '';

    walletItems
        .filter(item => !filterType || item.type === filterType)
        .forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('list-group-item');

            itemElement.innerHTML = `
                <h5>${item.name} <span class="badge badge-secondary">${item.type}</span></h5>
                <p>${item.details}</p>
                <small>Added on: ${new Date(item.dateAdded).toLocaleDateString()}</small>
                ${item.image ? `
                    <a href="#" data-bs-toggle="modal" data-bs-target="#imageModal" onclick="showLargeImage('${item.image}')">
                        <img src="${item.image}" alt="${item.name}" class="img-thumbnail mt-2" style="max-height: 50px; max-width: 90px;">
                    </a>` : ''
                }
                <button class="btn btn-danger btn-sm mt-2" onclick="deleteItem(${index})">Delete</button>
            `;

            walletContainer.appendChild(itemElement);
        });
}

// Function to delete an item
function deleteItem(index) {
    walletItems.splice(index, 1); // Remove item from walletItems array
    localStorage.setItem('walletItems', JSON.stringify(walletItems)); // Update localStorage
    displayItems(); // Refresh display
}

function showLargeImage(imageUrl) {
    console.log('displaying modal');
    document.getElementById('largeImage').src = imageUrl;
}

// Function to filter items by category
function filterItemsByCategory() {
    const filterValue = document.getElementById('categoryFilter').value;
    displayItems(filterValue);
}

// Function to extract text from image for autofill
// Autofill function to extract text from the uploaded image
function autofillDetails() {
    console.log("Autofill button clicked!");

    const itemImageInput = document.getElementById('itemImage').files[0];
    const itemDetailsField = document.getElementById('itemDetails');

    if (!itemImageInput) {
        alert('Please upload an image first.');
        return;
    }

    // Set the details field to show a loading message
    itemDetailsField.value = 'Extracting, please wait...';

    // Use Tesseract.js to perform OCR
    Tesseract.recognize(
        itemImageInput,
        'eng',
        {
            logger: (m) => console.log(m) // Log progress if needed
        }
    ).then(({ data: { text } }) => {
        // Once extraction is complete, display the extracted text in the details field
        itemDetailsField.value = text || 'No text found in image.';
    }).catch((error) => {
        console.error(error);
        itemDetailsField.value = 'Error extracting text. Please try another image.';
    });
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

