function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist") || "[]");
}

function toggleWishlist(id, button = null) {
  let wishlist = getWishlist();

  if (wishlist.includes(id)) {
    // Remove from wishlist
    wishlist = wishlist.filter((item) => item !== id);

    if (button) {
      button.classList.remove("active");
      button.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }
  } else {
    // Add to wishlist
    wishlist.push(id);

    if (button) {
      button.classList.add("active");
      button.innerHTML = '<i class="fa-solid fa-heart"></i>';
    }
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // Update wishlist page immediately
  renderWishlist();
}

function renderWishlist() {
  const container = document.getElementById("wishlistContainer");

  if (!container) {
    return;
  }

  const wishlist = getWishlist();

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id),
  );

  if (wishlistProducts.length === 0) {
    container.innerHTML = `
            <div class="empty-cart">
                <i class="fa-regular fa-heart"></i>

                <h3>Your wishlist is empty</h3>

                <p>
                    Save your favorite products here.
                </p>

                <a href="shop.html" class="btn-main">
                    EXPLORE PRODUCTS
                </a>
            </div>
        `;

    return;
  }

  container.innerHTML = wishlistProducts
    .map(
      (product) => `
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
                        class="wishlist-btn active"
                        onclick="toggleWishlist(${product.id}, this)"
                    >
                        <i class="fa-solid fa-heart"></i>
                    </button>

                </div>

                <div class="product-info">

                    <small>${product.category}</small>

                    <h5>${product.name}</h5>

                    <strong>
                        $${product.price.toFixed(2)}
                    </strong>

                    <del>
                        $${product.oldPrice.toFixed(2)}
                    </del>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderWishlist();
});
