document.addEventListener('DOMContentLoaded', () => {
    
    const cartView = document.getElementById('cart-view');
    const receiptView = document.getElementById('receipt-view');

    const cartList = document.getElementById('cart-item-list');
    const subtotalDisplay = document.getElementById('subtotal-display');
    const taxDisplay = document.getElementById('tax-display');
    const tipDisplay = document.getElementById('tip-display');
    const grandtotalDisplay = document.getElementById('grandtotal-display');
    const itemCountDisplay = document.getElementById('item-count-display');
    const customTipInput = document.getElementById('custom-tip-input');
    const checkoutBtn = document.querySelector('.checkout-btn');

    const couponInput = document.getElementById('coupon-input');
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const discountLine = document.getElementById('discount-line');
    const discountDisplay = document.getElementById('discount-display');

    
    const orderTypeInputs = document.querySelectorAll('input[name="orderType"]');
    
    
    const receiptItemsList = document.getElementById('receipt-items-list');
    const receiptSubtotal = document.getElementById('receipt-subtotal');
    const receiptTax = document.getElementById('receipt-tax');
    const receiptTip = document.getElementById('receipt-tip');
    const receiptGrandtotal = document.getElementById('receipt-grandtotal');
    const orderIdDisplay = document.getElementById('order-id');
    const receiptOrderTypeDisplay = document.getElementById('receipt-order-type'); // NEW: Receipt display element

    
    const receiptDiscountLine = document.getElementById('receipt-discount-line');
    const receiptDiscountDisplay = document.getElementById('receipt-discount-display');
    const receiptDiscountLabel = document.getElementById('receipt-discount-label');

    
    const cartCountElement = document.querySelector('.cart-count');

    const TAX_RATE = 0.08; 
    let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];

    const VALID_COUPONS = {
        "CSET2025": { type: 'percent', value: 0.20, label: 'CSET2025 (20% Off)' },
        "SAVE10": { type: 'flat', value: 10.00, label: 'SAVE10 ($10 Off)' },
    };
    let appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon')) || null;

   
    let selectedOrderType = localStorage.getItem('orderType') || 'Pickup';

    
    let finalSubtotal = 0;
    let finalTaxAmount = 0;
    let finalTipAmount = 0;
    let finalDiscountAmount = 0;
    let finalGrandTotal = 0;

    function formatCurrency(amount) {
        return `$${amount.toFixed(2)}`;
    }

    function calculateTotals() {
        let subtotal = 0;
        let totalQuantity = 0; 
        
        
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            totalQuantity += item.quantity; 
        });

        let couponDiscount = 0;
        if (appliedCoupon) {
            const couponData = VALID_COUPONS[appliedCoupon.code];
            if (couponData) {
                if (couponData.type === 'percent') {
                    couponDiscount = subtotal * couponData.value;
                } else if (couponData.type === 'flat') {
                    couponDiscount = couponData.value;
                }
                couponDiscount = Math.min(couponDiscount, subtotal);
            }
        }

        if (couponDiscount > 0) {
            discountDisplay.textContent = `-${formatCurrency(couponDiscount)}`;
            document.getElementById('discount-label').textContent = `${VALID_COUPONS[appliedCoupon.code].label} Discount:`;
            discountLine.style.display = 'flex';
        } else {
            discountLine.style.display = 'none';
        }

        const discountedSubtotal = subtotal - couponDiscount;
        const tipAmount = parseFloat(customTipInput.value) || 0;
        const taxAmount = discountedSubtotal * TAX_RATE;
        let grandTotal = discountedSubtotal + taxAmount + tipAmount;

        finalSubtotal = subtotal;
        finalTaxAmount = taxAmount;
        finalTipAmount = tipAmount;
        finalDiscountAmount = couponDiscount;
        finalGrandTotal = grandTotal;

        subtotalDisplay.textContent = formatCurrency(subtotal);
        taxDisplay.textContent = formatCurrency(taxAmount);
        tipDisplay.textContent = formatCurrency(tipAmount);
        grandtotalDisplay.textContent = formatCurrency(grandTotal);
        
        
        itemCountDisplay.textContent = totalQuantity; 
        cartCountElement.textContent = totalQuantity;
    }

    function renderCart() {
        if (cart.length === 0) {
            cartList.innerHTML = '<tr><td colspan="6" class="empty-cart-message">Your cart is empty.</td></tr>';
        } else {
            cartList.innerHTML = cart.map((item, index) => {
                const imagePath = item.imageSrc || 'IMAGE/placeholder.jpg'; // Use relative path
                return `<tr data-index="${index}">
                    <td><img src="${imagePath}" alt="${item.name}" class="cart-item-img" style="width: 50px; height: 50px; object-fit: cover;"></td>
                    <td>${item.name}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>
                        <div class="quantity-controls">
                            <button class="decrease" data-index="${index}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                            <button class="increase" data-index="${index}">+</button>
                        </div>
                    </td>
                    <td>${formatCurrency(item.price * item.quantity)}</td>
                    <td><button class="remove-item" data-index="${index}">Remove</button></td>
                </tr>`;
            }).join('');
        }
        calculateTotals();
    }

    function handleQuantityChange(event) {
        const target = event.target;
        if (target.closest('.quantity-controls')) {
            const index = parseInt(target.closest('tr').getAttribute('data-index'));
            if (target.classList.contains('increase')) cart[index].quantity++;
            else if (target.classList.contains('decrease') && cart[index].quantity > 1) cart[index].quantity--;
            else if (target.classList.contains('decrease') && cart[index].quantity === 1) cart.splice(index, 1);
        } else if (target.classList.contains('quantity-input')) {
            const index = parseInt(target.getAttribute('data-index'));
            const newQuantity = parseInt(target.value);
            if (!isNaN(newQuantity) && newQuantity >= 1) cart[index].quantity = newQuantity;
        }
        localStorage.setItem('restaurantCart', JSON.stringify(cart));
        renderCart();
    }

    function handleRemoveItem(event) {
        if (event.target.classList.contains('remove-item')) {
            const index = parseInt(event.target.getAttribute('data-index'));
            cart.splice(index, 1);
            localStorage.setItem('restaurantCart', JSON.stringify(cart));
            renderCart();
        }
    }

    function applyCoupon() {
        const inputCode = couponInput.value.trim().toUpperCase();
        if (VALID_COUPONS[inputCode]) {
            appliedCoupon = { code: inputCode, discount: VALID_COUPONS[inputCode].value, type: VALID_COUPONS[inputCode].type };
            localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
            calculateTotals();
            alert(`Coupon ${inputCode} Applied!`);
            couponInput.value = '';
        } else if (inputCode === '' && appliedCoupon) {
            appliedCoupon = null;
            localStorage.removeItem('appliedCoupon');
            calculateTotals();
            alert('Coupon removed.');
        } else if (inputCode !== '') {
            alert('Invalid Coupon Code.');
        }
    }



    function handleOrderTypeChange(event) {
        selectedOrderType = event.target.value;
        localStorage.setItem('orderType', selectedOrderType);
    }

    
    function initializeOrderType() {
        orderTypeInputs.forEach(input => {
            if (input.value === selectedOrderType) {
                input.checked = true;
            }
            
            input.addEventListener('change', handleOrderTypeChange);
        });
    }

    
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) { alert("Your cart is empty."); return; }

        const orderId = Math.floor(Math.random() * 900000) + 100000;
        orderIdDisplay.textContent = orderId;
        
        
        receiptOrderTypeDisplay.textContent = selectedOrderType;
        
        receiptSubtotal.textContent = formatCurrency(finalSubtotal);
        if (finalDiscountAmount > 0) {
            receiptDiscountLabel.textContent = `${appliedCoupon.code} Discount:`;
            receiptDiscountDisplay.textContent = `-${formatCurrency(finalDiscountAmount)}`;
            receiptDiscountLine.style.display = 'flex';
        } else receiptDiscountLine.style.display = 'none';
        receiptTax.textContent = formatCurrency(finalTaxAmount);
        receiptTip.textContent = formatCurrency(finalTipAmount);
        receiptGrandtotal.textContent = formatCurrency(finalGrandTotal);

        receiptItemsList.innerHTML = '';
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('receipt-item-line');
            itemDiv.innerHTML = `<span class="item-name-qty">${item.quantity}x ${item.name}</span>
            <span class="item-price-total">${formatCurrency(item.price * item.quantity)}</span>`;
            receiptItemsList.appendChild(itemDiv);
        });

        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser && loggedInUser.email) {
            const allUserOrders = JSON.parse(localStorage.getItem('allUserOrders')) || {};
            const userEmail = loggedInUser.email;
            if (!allUserOrders[userEmail]) allUserOrders[userEmail] = [];
            const newOrder = {
                id: `#${orderId}`,
                date: new Date().toLocaleString(),
                items: JSON.parse(JSON.stringify(cart)),
                subtotal: finalSubtotal,
                tax: finalTaxAmount,
                tip: finalTipAmount,
                total: finalGrandTotal,
                discount: finalDiscountAmount,
                couponCode: appliedCoupon ? appliedCoupon.code : null,
                orderType: selectedOrderType 
            };
            allUserOrders[userEmail].unshift(newOrder);
            localStorage.setItem('allUserOrders', JSON.stringify(allUserOrders));
        }

        
        cart = []; 
        localStorage.removeItem('restaurantCart'); 
        localStorage.removeItem('appliedCoupon');
        localStorage.removeItem('orderType'); 
        
        
        cartView.style.display = "none";
        receiptView.style.display = "block";

        document.querySelector('.cart-count').textContent = 0;
    });

    renderCart();

    
    initializeOrderType();

    
    cartList.addEventListener('click', handleQuantityChange);
    cartList.addEventListener('click', handleRemoveItem);
    customTipInput.addEventListener('input', calculateTotals);
    applyCouponBtn.addEventListener('click', applyCoupon);
    calculateTotals();
});