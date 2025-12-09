document.addEventListener('DOMContentLoaded', () => {
    const navLogin = document.getElementById("nav-login");
    if (navLogin) {
        const loggedIn = localStorage.getItem("loggedInUser") !== null;
        if (loggedIn) {
            navLogin.textContent = "ACCOUNT";
            
            navLogin.href = "account.html"; 
        } else {
            navLogin.textContent = "LOGIN / SIGNUP";
            
            navLogin.href = "Login-SignUp/login-signUp.html";
        }
    }

    const cartCountElement = document.querySelector('.cart-count');
    let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
    updateCartCount();

    
    let menuData = JSON.parse(localStorage.getItem("menuData")) || {
        "burgers-content": [
            { name: "Kincaid’s Hamburgers", price: 7.65, desc: "A basic but a classic!!", img: "IMAGE/cheeseburger.png" },
            { name: "Brisket Burger", price: 11.99, desc: "Smoked brisket burger with American cheese on a brioche bun.", img: "IMAGE/brisket_burger.png" },
            { name: "Jabs Smash Burgers", price: 12.99, desc: "Try out our newest addition to the menu, with bacon and onions over smashed beef.", img: "IMAGE/smashburger3.jpg" },
            { name: "Wagyu Cheeseburger", price: 15.99, desc: "An 8oz wagyu beef patty, served on a pretzel bun with caramelized onions, arugula, and white cheddar.", img: "IMAGE/wagyu_cheeseburger.png" },
            { name: "The Big Texan", price: 14.99, desc: "Double patty, pepper jack cheese, fried egg, and bacon served with a side of onion rings.", img: "IMAGE/big_texan.png" }
        ],
        "appetizers-content": [
            { name: "Jalapeño Poppers", price: 6.99, desc: "Spicy jalapeños stuffed with cream cheese, breaded and fried to perfection.", img: "IMAGE/jalapeno-poppers.jpg" },
            { name: "Fried Pickles", price: 5.99, desc: "Deep-fried dill pickle slices, served with ranch dressing.", img: "IMAGE/fried-pickles.jpg" },
            { name: "Lonestar Loaded Fries", price: 9.50, desc: "Fries smothered in smoked brisket chili, cheddar cheese, and green onions.", img: "IMAGE/loaded-fries.jpg" },
            { name: "Queso Dip & Chips", price: 7.99, desc: "House-made creamy queso with seasoned tortilla chips.", img: "IMAGE/queso-dip.jpg" }
        ],
        "texasbbq-content": [
            { name: "LoneStar T-Bone", price: 28.99, desc: "16oz T-Bone steak, grilled to perfection, served with mashed potatoes and asparagus.", img: "IMAGE/t-bone-steak.jpg" },
            { name: "Wagyu Steak", price: 35.99, desc: "12oz A5 Wagyu sirloin, served with sautéed mushrooms and truffle fries.", img: "IMAGE/wagyu-steak.jpg" },
            { name: "Ribeye Steak", price: 25.99, desc: "14oz Ribeye steak, seasoned with our dry rub and grilled, served with roasted vegetables.", img: "IMAGE/ribeye-steak.jpg" }
        ],
        "beverages-content": [
            { name: "Sweet Tea", price: 3.00, desc: "Classic Southern sweet tea, chilled and refreshing.", img: "IMAGE/sweet-tea.png" },
            { name: "Coca-Cola", price: 2.50, desc: "The original refreshment.", img: "IMAGE/coca-cola.png" },
            { name: "Root Beer", price: 2.50, desc: "A classic American favorite.", img: "IMAGE/root-beer.png" },
            { name: "Lemonade", price: 3.50, desc: "Freshly squeezed lemonade.", img: "IMAGE/lemonade.png" }
        ],
        "desserts-content": [
            { name: "Skillet Apple Pie", price: 9.99, desc: "A warm slice of apple pie served in a skillet, topped with vanilla ice cream and a drizzle of honey cinnamon caramel sauce.", img: "IMAGE/apple-pie.jpg" },
            { name: "Rich Chocolate Pudding", price: 8.00, desc: "Creamy chocolate pudding topped with whipped cream and chocolate shavings.", img: "IMAGE/chocolate-pudding.jpg" },
            { name: "Classic Vanilla Ice Cream", price: 6.00, desc: "Smooth and creamy vanilla ice cream served in a waffle cone with a chocolate drizzle.", img: "IMAGE/Cuisinart-Vanilla-Ice-Cream-Recipe-5.jpg" }
        ]
    };
    
    // Function to render menu items
    function renderMenu() {
        for (const sectionId in menuData) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.innerHTML = menuData[sectionId].map(item => `
                    <div class="menu-item">
                        <img src="${item.img}" alt="${item.name}" class="menu-pic">
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <span class="item-price">$${item.price.toFixed(2)}</span>
                            <p class="item-desc">${item.desc}</p>
                            <button class="add-to-cart-btn">ADD TO CART</button>
                        </div>
                    </div>
                `).join('');
            }
        }
         // Re-attach listeners after rendering
        attachAddToCartListeners();
    }

    function attachAddToCartListeners() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.removeEventListener('click', addToCart); // Prevent duplicates
            button.addEventListener('click', addToCart);
        });
    }


    function addToCart(event) {
        const menuItem = event.target.closest('.menu-item');
        const itemName = menuItem.querySelector('.item-details h3').textContent;
        const itemPriceText = menuItem.querySelector('.item-price').textContent.replace('$', '');
        const itemPrice = parseFloat(itemPriceText);
        const itemImageSrc = menuItem.querySelector('.menu-pic').getAttribute('src');

        const existingItem = cart.find(item => item.name === itemName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            const item = {
                name: itemName,
                price: itemPrice,
                quantity: 1,
                imageSrc: itemImageSrc // Store the correct image path
            };
            cart.push(item);
        }

        localStorage.setItem('restaurantCart', JSON.stringify(cart));
        updateCartCount();

        event.target.textContent = 'ADDED!';
        setTimeout(() => event.target.textContent = 'ADD TO CART', 500);
    }

    // --- Category Switching Logic ---
    const categoryLinks = document.querySelectorAll('.category-link');
    const menuSections = document.querySelectorAll('.menu-section');

    function switchCategory(event) {
        event.preventDefault();
        categoryLinks.forEach(link => link.classList.remove('active'));
        event.currentTarget.classList.add('active');

        const targetId = event.currentTarget.dataset.target;
        menuSections.forEach(section => {
            section.classList.add('hidden-section');
            section.classList.remove('active-section');
        });

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
            targetSection.classList.add('active-section');
        }
    }

    categoryLinks.forEach(link => link.addEventListener('click', switchCategory));

    // Initialize the menu and listeners
    renderMenu();

    // Redirect logged-in users from login page
    window.addEventListener('load', () => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const isLoginPage = window.location.pathname.toLowerCase().includes("login-signup.html");
        if(loggedInUser && isLoginPage){
            window.location.href = "account.html";
        }
    });
});