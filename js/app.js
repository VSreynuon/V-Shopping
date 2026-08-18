// ==========================================
// PRODUCT MANAGEMENT
// ==========================================

const PRODUCT_VERSION = "2";

function checkProductVersion() {
    const savedVersion = localStorage.getItem("vshopping_product_version");

    if (savedVersion !== PRODUCT_VERSION) {
        localStorage.removeItem("vshopping_products");

        localStorage.setItem(
            "vshopping_product_version",
            PRODUCT_VERSION
        );
    }
}

checkProductVersion();

// Get all products
function getProducts() {
    return JSON.parse(
        localStorage.getItem("vshopping_products") || "[]"
    );
}


// Save all products
function saveProductList(productList) {
    localStorage.setItem(
        "vshopping_products",
        JSON.stringify(productList)
    );
}


// Add new product
function addProduct(productData) {

    const productList = getProducts();

    const newProduct = {
        id: Date.now(),
        name: productData.name,
        category: productData.category,
        price: Number(productData.price),
        oldPrice: Number(productData.oldPrice),
        rating: Number(productData.rating) || 0,
        reviews: Number(productData.reviews) || 0,
        sizes: productData.sizes || [],
        colors: productData.colors || [],
        image: productData.image
    };

    productList.push(newProduct);

    saveProductList(productList);

    // Update global products
    products = productList;

    renderHome();
    filterProducts();

    return newProduct;
}


// Edit product
function updateProduct(id, productData) {

    let productList = getProducts();

    const index = productList.findIndex(
        p => p.id === Number(id)
    );

    if (index === -1) {
        alert("Product not found.");
        return false;
    }

    productList[index] = {
        ...productList[index],

        name: productData.name,
        category: productData.category,
        price: Number(productData.price),
        oldPrice: Number(productData.oldPrice),
        rating: Number(productData.rating),
        reviews: Number(productData.reviews),
        sizes: productData.sizes || [],
        colors: productData.colors || [],
        image: productData.image
    };

    saveProductList(productList);

    products = productList;

    renderHome();
    filterProducts();

    return true;
}


// Delete product
function deleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    let productList = getProducts();

    productList = productList.filter(
        p => p.id !== Number(id)
    );

    saveProductList(productList);

    products = productList;

    renderHome();
    filterProducts();

    alert("Product deleted successfully.");

    // Refresh admin product table if it exists
    if (typeof renderAdminProducts === "function") {
        renderAdminProducts();
    }
}


function renderHome() {
  const c = document.getElementById("homeProducts");
  if (c) c.innerHTML = products.slice(0, 8).map(productCard).join("");
}

function filterProducts() {
  const list = document.getElementById("productList");
  if (!list) return;
  let p = [...products],
    q = (document.getElementById("searchInput")?.value || "").toLowerCase(),
    cat = window.shopCategory || "All",
    max = Number(document.getElementById("priceRange")?.value || 100);
  p = p.filter(
    (x) =>
      (cat === "All" || x.category === cat) &&
      x.price <= max &&
      x.name.toLowerCase().includes(q),
  );
  const s = document.getElementById("sortProducts")?.value;
  if (s === "low") p.sort((a, b) => a.price - b.price);
  if (s === "high") p.sort((a, b) => b.price - a.price);
  if (s === "name") p.sort((a, b) => a.name.localeCompare(b.name));
  list.innerHTML = p.map(productCard).join("");
  document.getElementById("productCount").textContent = `${p.length} products`;
}
function filterCategory(c) {
  window.shopCategory = c;
  filterProducts();
}
function setupShop() {
  if (!document.getElementById("productList")) return;
  const u = new URLSearchParams(location.search);
  window.shopCategory = u.get("category") || "All";
  document
    .getElementById("searchInput")
    .addEventListener("input", filterProducts);
  document
    .getElementById("sortProducts")
    .addEventListener("change", filterProducts);
  document.getElementById("priceRange").addEventListener("input", (e) => {
    document.getElementById("priceValue").textContent = e.target.value;
    filterProducts();
  });
  filterProducts();
}
function subscribeNewsletter() {
  const e = document.getElementById("newsletterEmail").value;
  if (!e) return alert("Please enter your email.");
  alert("Thank you for subscribing!");
}

//  update cart
function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}

function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
}

function updateCartCount() {

    const cart = getCart();

    const count = cart.reduce((total, item) => {
        return total + (Number(item.quantity) || 1);
    }, 0);

    document.querySelectorAll(".cart-count").forEach((element) => {
        element.textContent = count;
    });
}

function renderCartPreview() {
    const container = document.getElementById("homeCartProducts");

    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fa-solid fa-bag-shopping fa-2x mb-3"></i>
                <p class="text-muted mb-2">Your cart is empty.</p>
                <a href="shop.html" class="btn btn-dark">
                    Continue Shopping
                </a>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-preview-item d-flex  gap-3 mb-3">

            <img 
                src="${item.image}"
                alt="${item.name}"
                class="cart-preview-image" 
            >

            <div class="flex-grow-1 mt-3">
                <h6 class="mb-1">${item.name}</h6>

                <p class="mb-1 text-muted">
                    $${Number(item.price).toFixed(2)}
                </p>

                <small>
                    Quantity: ${item.quantity || 1}
                </small>
            </div>

        </div>
    `).join("");
}

function productCard(product) {

    return `
        <div class="col-6 col-md-4 col-lg-3">

            <div class="product-card">

                <div class="product-image">

                    <a href="product-detail.html?id=${product.id}">
                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >
                    </a>

                    <button
                        class="wishlist-btn"
                        onclick="toggleWishlist(${product.id})"
                        title="Add to Wishlist">

                        <i class="fa-regular fa-heart"></i>

                    </button>

                </div>

                <div class="product-info p-3">

                    <span class="product-category">
                        ${product.category}
                    </span>

                    <h5>${product.name}</h5>

                    <div class="product-rating text-warning">

                        <i class="fa-solid fa-star"></i>

                        ${product.rating}

                        <span class="text-danger">
                            (${product.reviews})
                        </span>

                    </div>

                    <div class="product-price">

                        <strong>
                            $${Number(product.price).toFixed(2)}
                        </strong>

                        ${
                            product.oldPrice
                                ? `
                                    <del>
                                        $${Number(product.oldPrice).toFixed(2)}
                                    </del>
                                `
                                : ""
                        }

                    </div>

                    <button
                        class="btn btn-danger w-100 mt-2"
                        onclick="addToCart(${product.id})">
                        
                        Add to Cart

                    </button>

                </div>

            </div>

        </div>
    `;
}

// Navbar
function createNavbar() {
    const n = document.getElementById("navbar");

    if (!n) return;

    n.innerHTML = `
        <div class="top-bar">
            FREE SHIPPING ON ORDERS OVER $49
        </div>

        <nav class="navbar navbar-expand-lg main-navbar">

            <div class="container">

                <a href="index.html" class="navbar-brand">
                 <img src="./images/logo.png" alt="logo" class="logo-brand">
                </a>

                <button
                    class="navbar-toggler"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainMenu">

                    <i class="fa-solid fa-bars"></i>

                </button>

                <div
                    id="mainMenu"
                    class="collapse navbar-collapse">

                    <ul class="navbar-nav mx-auto">

                        <li>
                            <a class="nav-link" href="index.html">
                                HOME
                            </a>
                        </li>

                        <li>
                            <a class="nav-link" href="shop.html">
                                NEW IN
                            </a>
                        </li>

                        <li>
                            <a class="nav-link"
                               href="shop.html?category=Women">
                                WOMEN
                            </a>
                        </li>

                        <li>
                            <a class="nav-link"
                               href="shop.html?category=Men">
                                MEN
                            </a>
                        </li>

                        <li>
                            <a class="nav-link"
                               href="shop.html?category=Accessories">
                                ACCESSORIES
                            </a>
                        </li>

                        <li>
                            <a class="nav-link"
                               href="shop.html">
                                SALE
                            </a>
                        </li>

                    </ul>

                    <div class="nav-icons">

                        <a href="shop.html">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </a>

                        <a href="wishlist.html">
                            <i class="fa-regular fa-heart"></i>
                        </a>

                        <a href="cart.html" class="cart-icon">

                            <i class="fa-solid fa-bag-shopping"></i>

                            <span class="cart-count">0</span>

                        </a>

                         <a href="profile.html">
                            <i class="fa-regular fa-user"></i>
                        </a>

                    </div>

                </div>

            </div>

        </nav>
    `;

    updateCartCount();
}

function createFooter() {

    const f = document.getElementById("footer");

    if (!f) return;

    f.innerHTML = `
        <footer class="footer">

            <div class="container">

                <div class="row g-4">

                    <div class="col-lg-4">

                        <h3>V-SHOPPING</h3>

                        <p>
                            Your destination for modern fashion,
                            everyday essentials and new trends.
                        </p>

                    </div>

                    <div class="col-lg-2">

                        <h6>SHOP</h6>

                        <a href="shop.html">
                            New In
                        </a>

                        <a href="shop.html?category=Women">
                            Women
                        </a>

                        <a href="shop.html?category=Men">
                            Men
                        </a>

                        <a href="shop.html">
                            Sale
                        </a>

                    </div>

                    <div class="col-lg-3">

                        <h6>HELP</h6>

                        <a href="#">
                            Shipping
                        </a>

                        <a href="#">
                            Returns
                        </a>

                        <a href="#">
                            Payment
                        </a>

                        <a href="#">
                            Contact Us
                        </a>

                    </div>

                    <div class="col-lg-3">

                        <h6>CONTACT</h6>

                        <p>Phnom Penh, Cambodia</p>

                        <p>+855 12 345 678</p>

                        <p>support@vshopping.com</p>

                    </div>

                </div>

                <hr>

                <div class="text-center">

                    <small>
                        © 2026 V-Shopping.
                        All Rights Reserved.
                    </small>

                </div>

            </div>

        </footer>
    `;
}


document.addEventListener("DOMContentLoaded", () => {
    createNavbar();
    createFooter();
    renderHome();
    setupShop();

    updateCartCount();
    renderCartPreview();
});
