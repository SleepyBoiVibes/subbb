document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    const navManager = document.querySelector("a[href='Manager/manager.html']");
    const navLogin = document.getElementById("nav-login");

    if (navManager) {
        if (!loggedInUser || loggedInUser.email.toLowerCase() !== "manager@lonestar.com") {
            navManager.style.display = "none";
        } else {
            navManager.style.display = "block";
        }
    }

    if (navLogin) {
        const loggedIn = !!loggedInUser;
        navLogin.textContent = loggedIn ? "ACCOUNT" : "LOGIN / SIGNUP";
        navLogin.href = loggedIn ? "../account/account.html" : "../Login-SignUp/login-signUp.html";
    }

    if (!loggedInUser || loggedInUser.email.toLowerCase() !== "manager@lonestar.com") {
        if (window.location.pathname.toLowerCase().includes("manager.html")) {
            alert("You do not have permission to access this page.");
            window.location.href = "../Login-SignUp/login-signUp.html";
        }
    }

    let menu = JSON.parse(localStorage.getItem("menuData"));
    if (!menu || Object.values(menu).every(arr => arr.length === 0)) {
        menu = {
            "burgers-content": [
                { name: "Kincaid’s Hamburgers", price: 7.65, desc: "A basic but a classic!!", img: "../IMAGE/cheeseburger.png" },
                { name: "Brisket Burger", price: 11.99, desc: "Smoked brisket burger with American cheese on a brioche bun.", img: "../IMAGE/brisket_burger.png" },
                { name: "Jabs Smash Burgers", price: 12.99, desc: "Try out our newest addition to the menu, with bacon and onions over smashed beef.", img: "../IMAGE/smashburger3.jpg" },
                { name: "Texas Burger", price: 13.99, desc: "Stacked with cheddar, bacon, and a smoky BBQ", img: "../IMAGE/bacon-burger.jpg" }
            ],
            "appetizers-content": [
                { name: "Grilled Shrimp Appetizer", price: 8.49, desc: "Seafood lovers will love this!", img: "../IMAGE/Grilledshrimp2.jpg" },
                { name: "Tater Skins", price: 7.99, desc: "A favorite of the south, great for sharing!", img: "../IMAGE/potatoskins.jpg" },
                { name: "Boneless Buffalo Wings", price: 7.99, desc: "Pick between mild or hot sauces, we opted for hot.", img: "../IMAGE/buffalowings.jpg" },
                { name: "Chili Cheese Fries", price: 5.99, desc: "Crinkle-cut fries topped with melted cheddar cheese and bacon bits.", img: "../IMAGE/chilicheesefries.jpg" }
            ],
            "texasbbq-content": [
                { name: "Ribeye Steak", price: 60, desc: "Juicy, marbled ribeye cooked to perfection with garlic herb butter.", img: "../IMAGE/ribeye.png" },
                { name: "Filet Mignon", price: 75, desc: "Tender filet mignon seared with a red wine reduction and fresh herbs.", img: "../IMAGE/filet-mignon.jpg" },
                { name: "New York Strip", price: 55, desc: "Classic New York strip steak, perfectly seasoned and grilled to your liking.", img: "../IMAGE/nystrip2.jpg" },
                { name: "T-Bone Steak", price: 70, desc: "Generous T-bone steak with a rich, smoky flavor, perfect for sharing.", img: "../IMAGE/tbonesteak.jpg" }
            ],
            "beverages-content": [
                { name: "Margarita", price: 9.99, desc: "Classic tequila, lime, and triple sec cocktail served on the rocks or frozen.", img: "../IMAGE/pineapple-margarita-recipe-diethood-6.jpg" },
                { name: "Mojito", price: 10.99, desc: "Refreshing rum cocktail with mint, lime, and a touch of sugar and soda.", img: "../IMAGE/Mojito-9-1200x1800.jpg" },
                { name: "Long Island Iced Tea", price: 11.99, desc: "A potent mix of vodka, gin, rum, tequila, triple sec, and a splash of cola.", img: "../IMAGE/Long-Island-Iced-Tea-Culinary-Hill-LR-05.jpg" },
                { name: "Soda", price: 3.99, desc: "Choose from a variety of classic sodas.", img: "../IMAGE/coke2.jpg" },
                { name: "Lemonade", price: 4.50, desc: "Freshly squeezed lemonade, sweetened just right for a perfect refreshment.", img: "../IMAGE/lemonade.jpg" },
                { name: "Iced Tea", price: 3.50, desc: "Classic iced tea, served chilled with a hint of lemon.", img: "../IMAGE/iced-tea.jpeg" }
            ],
            "desserts-content": [
                { name: "Pecan Pie", price: 6.99, desc: "A quintessential American dessert featuring a mosaic of pecan halves.", img: "../IMAGE/Pecan-Pie-Web-8.jpg" },
                { name: "Banana Pudding", price: 7.99, desc: "Banana pudding with layers of custard, banana, and wafers.", img: "../IMAGE/Banana-Pudding-Recipe-Magnolia-ChelseasMessyApron-1200-1.jpeg" },
                { name: "Buttermilk Pie", price: 8.99, desc: "Classic Southern custard pie in a flaky crust.", img: "../IMAGE/buttermilk-pie-20.jpg" },
                { name: "Granny's Apple Classic", price: 12, desc: "Warm slice of apple pie with ice cream and honey caramel.", img: "../IMAGE/slice-of-apple-pie-2.jpg" },
                { name: "Rich Chocolate Pudding", price: 8, desc: "Creamy chocolate pudding topped with whipped cream and chocolate shavings.", img: "../IMAGE/chocolate-pudding.jpg" },
                { name: "Classic Vanilla Ice Cream", price: 6, desc: "Smooth vanilla ice cream served in a waffle cone with chocolate drizzle.", img: "../IMAGE/Cuisinart-Vanilla-Ice-Cream-Recipe-5.jpg" }
            ]
        };
        localStorage.setItem("menuData", JSON.stringify(menu));
    }

    const category = document.getElementById("category-select");
    const nameInput = document.getElementById("item-name");
    const priceInput = document.getElementById("item-price");
    const descInput = document.getElementById("item-desc");
    const imgInput = document.getElementById("item-img");
    const addBtn = document.getElementById("add-item-btn");

    function renderMenu() {
        for (const cat in menu) {
            const section = document.getElementById(cat);
            if (!section) continue;

            const heading = section.querySelector("h3")?.textContent || cat;
            section.innerHTML = `<h3>${heading}</h3>`;

            menu[cat].forEach((item, index) => {
                const card = document.createElement("div");
                card.classList.add("menu-item");
                card.innerHTML = `
                    <img src="${item.img}" class="menu-pic">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <span class="item-price">$${item.price}</span>
                        <p class="item-desc">${item.desc}</p>
                    </div>
                    <button class="delete-btn" data-category="${cat}" data-index="${index}">DELETE</button>
                `;
                section.appendChild(card);
            });
        }
        attachDeleteListeners();
    }

    function attachDeleteListeners() {
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const cat = btn.dataset.category;
                const index = btn.dataset.index;
                menu[cat].splice(index, 1);
                localStorage.setItem("menuData", JSON.stringify(menu));
                renderMenu();
            });
        });
    }

    addBtn.addEventListener("click", () => {
        if (!nameInput.value || !priceInput.value) {
            alert("Name and price are required!");
            return;
        }

        const item = {
            name: nameInput.value,
            price: parseFloat(priceInput.value).toFixed(2),
            desc: descInput.value,
            img: imgInput.value || "IMAGE/default.jpg"
        };

        menu[category.value].push(item);
        localStorage.setItem("menuData", JSON.stringify(menu));

        nameInput.value = "";
        priceInput.value = "";
        descInput.value = "";
        imgInput.value = "";

        renderMenu();
    });

    renderMenu();
});