function loadProductDetail() {
  const c = document.getElementById("productDetail");
  if (!c) return;
  const id = Number(new URLSearchParams(location.search).get("id"));
  const p = products.find((x) => x.id === id) || products[0];
  c.innerHTML = `<div class="row g-5"><div class="col-lg-6"><img src="${p.image}" class="product-detail-image"></div><div class="col-lg-6"><span>${p.category}</span><h1 class="product-title">${p.name}</h1><div class="rating">★★★★★ <span>${p.rating} (${p.reviews} reviews)</span></div><div class="detail-price">$${p.price.toFixed(2)} <del>$${p.oldPrice.toFixed(2)}</del></div><hr><h6>SELECT SIZE</h6><div class="size-options">${p.sizes.map((s) => `<button>${s}</button>`).join("")}</div><h6 class="mt-4">SELECT COLOR</h6><select class="form-select">${p.colors.map((x) => `<option>${x}</option>`).join("")}</select><div class="detail-actions mt-4"><button onclick="addToCart(${p.id})" class="btn-main flex-grow-1">ADD TO BAG</button><button onclick="toggleWishlist(${p.id})" class="wishlist-detail"><i class="fa-regular fa-heart"></i></button></div><div class="product-description"><h5>Product Details</h5><p>Premium quality fashion piece designed for comfort and everyday style.</p></div></div></div>`;
}
document.addEventListener("DOMContentLoaded", loadProductDetail);
