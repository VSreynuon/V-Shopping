// function addToCart(id) {
//   let c = getCart(),
//     x = c.find((i) => i.id === id);
//   x ? x.quantity++ : c.push({ id, quantity: 1 });
//   localStorage.setItem("cart", JSON.stringify(c));
//   updateCartCount();
//   alert("Product added to shopping bag.");
// }
function addToCart(productId) {

    const product = products.find(
        p => Number(p.id) === Number(productId)
    );

    if (!product) {
        console.error("Product not found:", productId);
        return;
    }

    let cart = getCart();

    const existing = cart.find(
        item => Number(item.id) === Number(product.id)
    );

    if (existing) {
        existing.quantity = (Number(existing.quantity) || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    if (typeof renderCartPreview === "function") {
        renderCartPreview();
    }

    alert(`${product.name} added to cart!`);
}
function removeFromCart(id) {
  localStorage.setItem(
    "cart",
    JSON.stringify(getCart().filter((i) => i.id !== id)),
  );
  renderCart();
  updateCartCount();
}
function changeQuantity(id, n) {
  let c = getCart(),
    x = c.find((i) => i.id === id);
  if (!x) return;
  x.quantity += n;
  if (x.quantity <= 0) c = c.filter((i) => i.id !== id);
  localStorage.setItem("cart", JSON.stringify(c));
  renderCart();
  updateCartCount();
}
function calculateTotal() {
  return getCart().reduce((t, i) => {
    const p = products.find((x) => x.id === i.id);
    return t + p.price * i.quantity;
  }, 0);
}
function renderCart() {
  const c = document.getElementById("cartContainer");
  if (!c) return;
  const cart = getCart();
  if (!cart.length) {
    c.innerHTML =
      '<div class="empty-cart"><i class="fa-solid fa-bag-shopping"></i><h3>Your shopping bag is empty</h3><a href="shop.html" class="btn-main">SHOP NOW</a></div>';
    return;
  }
  const total = calculateTotal();
  c.innerHTML = `<div class="row g-4"><div class="col-lg-8">${cart
    .map((i) => {
      const p = products.find((x) => x.id === i.id);
      return `<div class="cart-item"><img src="${p.image}"><div class="cart-info"><h5>${p.name}</h5><p>${p.category}</p><strong>$${p.price.toFixed(2)}</strong></div><div class="quantity"><button onclick="changeQuantity(${p.id},-1)">−</button><span>${i.quantity}</span><button onclick="changeQuantity(${p.id},1)">+</button></div><button class="remove-btn" onclick="removeFromCart(${p.id})"><i class="fa-solid fa-trash"></i></button></div>`;
    })
    .join(
      "",
    )}</div><div class="col-lg-4"><div class="summary-box"><h4>Order Summary</h4><div class="summary-line"><span>Subtotal</span><strong>$${total.toFixed(2)}</strong></div><div class="summary-line"><span>Shipping</span><strong>${total >= 49 ? "FREE" : "$3.00"}</strong></div><hr><div class="summary-total"><span>Total</span><strong>$${(total + (total >= 49 ? 0 : 3)).toFixed(2)}</strong></div><a href="checkout.html" class="btn-main w-100 mt-4">CHECKOUT</a></div></div></div>`;
}
document.addEventListener("DOMContentLoaded", renderCart);
