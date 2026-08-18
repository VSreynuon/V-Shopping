function renderCheckout() {
  const c = document.getElementById("checkoutSummary");
  if (!c) return;
  const cart = getCart();
  let total = 0;
  c.innerHTML =
    cart
      .map((i) => {
        const p = products.find((x) => x.id === i.id),
          s = p.price * i.quantity;
        total += s;
        return `<div class="summary-line"><span>${p.name} × ${i.quantity}</span><strong>$${s.toFixed(2)}</strong></div>`;
      })
      .join("") +
    `<hr><div class="summary-total"><span>Total</span><strong>$${(total + (total >= 49 ? 0 : 3)).toFixed(2)}</strong></div>`;
}
function placeOrder() {
  const cart = getCart();
  if (!cart.length) return alert("Your shopping bag is empty.");
  const name = document.getElementById("checkoutName").value,
    phone = document.getElementById("checkoutPhone").value,
    address = document.getElementById("checkoutAddress").value;
  if (!name || !phone || !address)
    return alert("Please complete delivery information.");
  let orders = JSON.parse(localStorage.getItem("orders") || "[]");
  orders.push({
    id: "VS-" + Date.now(),
    date: new Date().toLocaleString(),
    items: cart,
    customer: name,
    phone,
    address,
    total: calculateTotal(),
  });
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem("cart");
  alert("Order placed successfully!");
  location.href = "orders.html";
}
function renderOrders() {
  const c = document.getElementById("ordersContainer");
  if (!c) return;
  const o = JSON.parse(localStorage.getItem("orders") || "[]");
  c.innerHTML = o.length
    ? o
        .reverse()
        .map(
          (x) =>
            `<div class="order-card"><strong>Order #${x.id}</strong><p>${x.date}</p><p>Customer: ${x.customer}</p><p>Total: <strong>$${x.total.toFixed(2)}</strong></p><span class="status">Processing</span></div>`,
        )
        .join("")
    : '<div class="empty-cart"><i class="fa-solid fa-box-open"></i><h3>No orders yet</h3><a href="shop.html" class="btn-main">START SHOPPING</a></div>';
}

document.addEventListener("DOMContentLoaded", () => {
  renderCheckout();
  renderOrders();
});
