document.addEventListener('DOMContentLoaded', () => {
    const navLogin = document.getElementById("nav-login");
    if (navLogin) {
        const loggedIn = localStorage.getItem("loggedInUser") !== null;
        if (loggedIn) {
            navLogin.textContent = "ACCOUNT";
            navLogin.href = "/account/account.html";
        } else {
            navLogin.textContent = "LOGIN / SIGNUP";
            navLogin.href = "/Login-SignUp/login-signUp.html";
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
        "burgers-content": [ { name: "Kincaid’s Hamburgers", price: 7.65, desc: "A basic but a classic!!", img: "/IMAGE/cheeseburger.png" },
        { name: "Brisket Burger", price: 11.99, desc: "Smoked brisket burger with American cheese on a brioche bun.", img: "/IMAGE/brisket_burger.png" },
        { name: "Jabs Smash Burgers", price: 12.99, desc: "Try out our newest addition to the menu, with bacon and onions over smashed beef.", img: "/IMAGE/smashburger3.jpg" },
        { name: "Texas Burger", price: 13.99, desc: "Stacked with cheddar, bacon, and a smoky BBQ", img: "/IMAGE/bacon-burger.jpg" }],

        "appetizers-content": [{ name: "Grilled Shrimp Appetizer", price: 8.49, desc: "Seafood lovers will love this!", img: "/IMAGE/Grilledshrimp2.jpg" },
        { name: "Tater Skins", price: 7.99, desc: "A favorite of the south, great for sharing!", img: "IMAGE/potatoskins.jpg" },
        { name: "Boneless Buffalo Wings", price: 7.99, desc: "This appetizer allows you to pick between mild or hot sauces, and we opted for hot.", img: "IMAGE/buffalowings.jpg" },
        { name: "Chili Cheese Fries", price: 5.99, desc: "Crinkle-cut fries topped with melted cheddar cheese and bacon bits.", img: "IMAGE/chilicheesefries.jpg" }],

        "texasbbq-content": [  { name: "Ribeye Steak", price: 60, desc: "Juicy, marbled ribeye cooked to perfection with garlic herb butter.", img: "IMAGE/ribeye.png" },
        { name: "Filet Mignon", price: 75, desc: "Tender filet mignon seared with a red wine reduction and fresh herbs.", img: "IMAGE/filet-mignon.jpg" },
        { name: "New York Strip", price: 55, desc: "Classic New York strip steak, perfectly seasoned and grilled to your liking.", img: "IMAGE/nystrip2.jpg" },
        { name: "T-Bone Steak", price: 70, desc: "Generous T-bone steak with a rich, smoky flavor, perfect for sharing.", img: "IMAGE/tbonesteak.jpg" }],

        "beverages-content": [  { name: "Margarita", price: 9.99, desc: "Classic tequila, lime, and triple sec cocktail served on the rocks or frozen.", img: "IMAGE/pineapple-margarita-recipe-diethood-6.jpg" },
        { name: "Mojito", price: 10.99, desc: "Refreshing rum cocktail with mint, lime, and a touch of sugar and soda.", img: "IMAGE/Mojito-9-1200x1800.jpg" },
        { name: "Long Island Iced Tea", price: 11.99, desc: "A potent mix of vodka, gin, rum, tequila, triple sec, and a splash of cola.", img: "IMAGE/Long-Island-Iced-Tea-Culinary-Hill-LR-05.jpg" },
        { name: "Soda", price: 3.99, desc: "Choose from a variety of classic sodas.", img: "IMAGE/coke2.jpg" },
        { name: "Lemonade", price: 4.50, desc: "Freshly squeezed lemonade, sweetened just right for a perfect refreshment.", img: "IMAGE/lemonade.jpg" },
        { name: "Iced Tea", price: 3.50, desc: "Classic iced tea, served chilled with a hint of lemon.", img: "IMAGE/iced-tea.jpeg" }],

        "desserts-content": [{ name: "Pecan Pie", price: 6.99, desc: "A quintessential American dessert featuring a mosaic of pecan halves.", img: "IMAGE/Pecan-Pie-Web-8.jpg" },
        { name: "Banana Pudding", price: 7.99, desc: "Banana pudding is a classic Southern American dessert consisting of alternating layers of sweet vanilla custard or instant pudding, sliced fresh bananas, and vanilla wafer cookies.", img: "IMAGE/Banana-Pudding-Recipe-Magnolia-ChelseasMessyApron-1200-1.jpeg" },
        { name: "Buttermilk Pie", price: 8.99, desc: "Buttermilk pie is a classic Southern dessert featuring a rich, velvety custard-like filling in a flaky, buttery pie crust", img: "IMAGE/buttermilk-pie-20.jpg" },
        { name: "Granny's Apple Classic", price: 12, desc: "A warm slice of apple pie served in a skillet, topped with vanilla ice cream and a drizzle of honey cinnamon caramel sauce", img: "IMAGE/slice-of-apple-pie-2.jpg" },
        { name: "Rich Chocolate Pudding", price: 8, desc: "Creamy chocolate pudding topped with whipped cream and chocolate shavings", img: "IMAGE/chocolate-pudding.jpg" },
        { name: "Classic Vanilla Ice Cream", price: 6, desc: "Smooth and creamy vanilla ice cream served in a waffle cone with a chocolate drizzle", img: "IMAGE/Cuisinart-Vanilla-Ice-Cream-Recipe-5.jpg" }]
    };

    function renderMenu() {
        for (let cat in menuData) {
            const section = document.getElementById(cat);
            if (!section) continue;

            // Keep the heading
            const headingText = section.querySelector("h3")?.textContent || "";
            section.innerHTML = `<h3>${headingText}</h3>`;

            menuData[cat].forEach((item, index) => {
                const card = document.createElement("div");
                card.classList.add("menu-item");
                card.innerHTML = `
                    <img src="${item.img}" class="menu-pic">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <span class="item-price">$${item.price}</span>
                        <p class="item-desc">${item.desc}</p>
                        <button class="add-to-cart-btn">ADD TO CART</button>
                    </div>
                `;
                section.appendChild(card);
            });
        }

        attachAddToCart();
    }

    
    function attachAddToCart() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        addToCartButtons.forEach(button => {
            button.removeEventListener('click', addToCart); // remove duplicates
            button.addEventListener('click', addToCart);
        });
    }

    function addToCart(event) {
        const menuItem = event.target.closest('.menu-item');
        const name = menuItem.querySelector('.item-details h3').textContent;
        const price = parseFloat(menuItem.querySelector('.item-price').textContent.replace('$', ''));
        const imageSrc = menuItem.querySelector('.menu-pic').src || 'images/placeholder.jpg';

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1, imageSrc });
        }

        localStorage.setItem('restaurantCart', JSON.stringify(cart));
        updateCartCount();

        event.target.textContent = 'ADDED!';
        setTimeout(() => event.target.textContent = 'ADD TO CART', 500);
    }

    renderMenu();

    
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
});

// Redirect logged-in users from login page
window.addEventListener('load', () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const isLoginPage = window.location.pathname.toLowerCase().includes("login-signup.html");
    if(loggedInUser && isLoginPage){
        window.location.href = "/Account/account.html";
    }
});