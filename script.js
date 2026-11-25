
const books = [
    {
        id: 1,
        title: "Atomic Habits",
        author: "James Clear",
        price: 399,
        category: "Self Help",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500"
    },
    {
        id: 2,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 299,
        category: "Fiction",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500"
    },
    {
        id: 3,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        price: 349,
        category: "Business",
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500"
    },
    {
        id: 4,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        price: 399,
        category: "Business",
        image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500"
    },
    {
        id: 5,
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 599,
        category: "Technology",
        image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500"
    },
    {
        id: 6,
        title: "Deep Work",
        author: "Cal Newport",
        price: 329,
        category: "Self Help",
        image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500"
    },
    {
        id: 7,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 279,
        category: "Fiction",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500"
    },
    {
        id: 8,
        title: "The Lean Startup",
        author: "Eric Ries",
        price: 449,
        category: "Business",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500"
    }
];

let cart = [];
let currentCategory = "All";

const bookGrid = document.getElementById("book-grid");
const searchInput = document.getElementById("searchInput");

function displayBooks() {
    const search = searchInput.value.toLowerCase();

    const filteredBooks = books.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(search) ||
            book.author.toLowerCase().includes(search);

        const matchesCategory =
            currentCategory === "All" ||
            book.category === currentCategory;

        return matchesSearch && matchesCategory;
    });

    bookGrid.innerHTML = "";

    if (filteredBooks.length === 0) {
        bookGrid.innerHTML = "<p>No books found.</p>";
        return;
    }

    filteredBooks.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";

        const img = document.createElement("img");
        img.src = book.image;
        img.alt = book.title;
        img.loading = "lazy";

        img.onerror = function () {
            this.src = "https://placehold.co/400x500?text=Book";
        };

        const info = document.createElement("div");
        info.className = "book-info";

        const title = document.createElement("h3");
        title.textContent = book.title;

        const author = document.createElement("p");
        author.textContent = "By " + book.author;

        const bottom = document.createElement("div");
        bottom.className = "book-bottom";

        const price = document.createElement("span");
        price.className = "price";
        price.textContent = "₹" + book.price;

        const addButton = document.createElement("button");
        addButton.className = "add-btn";
        addButton.textContent = "Add to Cart";
        addButton.addEventListener("click", () => addToCart(book.id));

        bottom.append(price, addButton);
        info.append(title, author, bottom);
        card.append(img, info);
        bookGrid.appendChild(card);
    });
}

function filterCategory(category) {
    currentCategory = category;
    displayBooks();
    document.getElementById("books").scrollIntoView({
        behavior: "smooth"
    });
}

function addToCart(id) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: id,
            quantity: 1
        });
    }

    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    let total = 0;
    let count = 0;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty.</p>';
    }

    cart.forEach(item => {
        const book = books.find(book => book.id === item.id);

        if (!book) return;

        total += book.price * item.quantity;
        count += item.quantity;

        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("div");

        const title = document.createElement("h4");
        title.textContent = book.title;

        const price = document.createElement("p");
        price.textContent = "₹" + book.price * item.quantity;

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const minus = document.createElement("button");
        minus.textContent = "-";
        minus.addEventListener("click", () =>
            changeQuantity(item.id, -1)
        );

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.addEventListener("click", () =>
            changeQuantity(item.id, 1)
        );

        controls.append(minus, quantity, plus);
        details.append(title, price, controls);

        const remove = document.createElement("button");
        remove.className = "remove-btn";
        remove.textContent = "Remove";
        remove.addEventListener("click", () =>
            removeFromCart(item.id)
        );

        row.append(details, remove);
        cartItems.appendChild(row);
    });

    cartCount.textContent = count;
    cartTotal.textContent = total.toLocaleString("en-IN");
}

function changeQuantity(id, amount) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function toggleCart() {
    document.getElementById("cart-overlay")
        .classList.toggle("active");
}

function closeCartOutside(event) {
    if (event.target.id === "cart-overlay") {
        toggleCart();
    }
}

function toggleMenu() {
    document.querySelector(".nav-links")
        .classList.toggle("active");
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert(
        "Thank you for shopping at Book Haven! " +
        "Your total is ₹" +
        document.getElementById("cart-total").textContent +
        ". This is a demo checkout."
    );
}

searchInput.addEventListener("input", displayBooks);

// Initialize website
displayBooks();
updateCart();
