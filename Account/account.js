let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
let userOrders = []; 


function formatCurrency(amount) { 
    return `$${(amount).toFixed(2)}`; 
}


if (!loggedInUser) {
    window.location.href = '/Login-SignUp/login-signUp.html'
} else {
    document.getElementById('accountName').textContent = loggedInUser.name
    document.getElementById('accountEmail').textContent = loggedInUser.email || ""
    if (loggedInUser.profilePic) {
        document.getElementById('profileImage').src = loggedInUser.profilePic
    }
    loadOrders(); 
}


document.getElementById('signOutBtn').addEventListener('click', () => {
    localStorage.removeItem('loggedInUser')
    window.location.href = '/Login-SignUp/login-signUp.html'
})


function loadOrders() {
    const ordersList = document.getElementById("ordersList")
    const allUserOrders = JSON.parse(localStorage.getItem('allUserOrders')) || {};
    
    if (!loggedInUser || !loggedInUser.email) {
        ordersList.innerHTML = `<p class="empty-orders">Please log in to view your orders.</p>`;
        return;
    }

    userOrders = allUserOrders[loggedInUser.email] || [];

    if (userOrders.length === 0) {
        ordersList.innerHTML = `<p class="empty-orders">You have no orders yet.</p>`;
        return;
    }

    ordersList.innerHTML = ''; 
    userOrders.forEach((order, index) => { 
        ordersList.innerHTML += `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-id-display">Order ${order.id}</span>
                    <span class="order-date">${order.date}</span>
                </div>
                <div class="order-details">
                    <p class="order-total-line"><strong>Total:</strong> ${formatCurrency(order.total)}</p>
                    <div class="order-items-list">
                        <h4>Items Ordered:</h4>
                        ${order.items.map(item => 
                            `<p class="order-item">${item.quantity}x ${item.name} (${formatCurrency(item.price * item.quantity)})</p>`
                        ).join('')}
                    </div>
                </div>
                <button class="reorder-btn" data-order-index="${index}">Re-Order</button>
            </div>
            <hr>
        `;
    });
}


// Re-order
const ordersList = document.getElementById("ordersList");

if (ordersList) {
    ordersList.addEventListener('click', (event) => {
        if (event.target.classList.contains('reorder-btn')) {
            const index = parseInt(event.target.getAttribute('data-order-index'));
            const orderToReorder = userOrders[index];

            if (orderToReorder) {
                if (confirm(`Re-Order ${orderToReorder.id} for ${formatCurrency(orderToReorder.total)}? This will replace your current cart.`)) {
                    // Overwrite the current cart with the past order's items
                    localStorage.setItem('restaurantCart', JSON.stringify(orderToReorder.items));
                    window.location.href = '../cart.html'; 
                }
            }
        }
    });
}