// V-Shopping Admin - localStorage based demo
const PRODUCT_KEY = "vshopping_products";
const ORDER_KEY = "vshopping_orders";
const USER_KEY = "vshopping_users";

const demoProducts = [
  {id:1,name:"Minimal Satin Dress",category:"Women",price:29.99,oldPrice:39.99,rating:4.8,reviews:128,sizes:["S","M","L"],colors:["Black","White"],image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"},
  {id:2,name:"Classic Oversized Shirt",category:"Men",price:24.99,oldPrice:34.99,rating:4.6,reviews:82,sizes:["M","L","XL"],colors:["White","Blue"],image:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500"},
  {id:3,name:"Everyday Shoulder Bag",category:"Accessories",price:39.99,oldPrice:49.99,rating:4.9,reviews:96,sizes:[],colors:["Brown","Black"],image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"},
  {id:4,name:"Relaxed Wide Leg Pants",category:"Women",price:35.99,oldPrice:45.99,rating:4.7,reviews:64,sizes:["S","M","L"],colors:["Black","Beige"],image:"https://images.unsplash.com/photo-1506629905607-d9d9d7f5d2b0?w=500"}
];

function read(key,fallback=[]){try{return JSON.parse(localStorage.getItem(key)) || fallback}catch{return fallback}}
function products(){return read(PRODUCT_KEY,demoProducts)}
function saveProducts(list){localStorage.setItem(PRODUCT_KEY,JSON.stringify(list))}
function orders(){return read(ORDER_KEY,[])}
function users(){return read(USER_KEY,[])}
function money(n){return "$"+Number(n||0).toFixed(2)}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function toggleSidebar(){document.getElementById("sidebar")?.classList.toggle("open")}
function logout(){if(confirm("Log out of the admin panel?")) location.href="../index.html"}

function seedIfEmpty(){
  if(!localStorage.getItem(PRODUCT_KEY)) saveProducts(demoProducts);
}
seedIfEmpty();

function updateSideCount(){const el=document.getElementById("sideProductCount");if(el)el.textContent=products().length}

function dashboard(){
  const p=products(), o=orders(), u=users();
  document.getElementById("totalProducts")?.replaceChildren(document.createTextNode(p.length));
  document.getElementById("totalOrders")?.replaceChildren(document.createTextNode(o.length));
  document.getElementById("totalCustomers")?.replaceChildren(document.createTextNode(u.length));
  const sales=o.reduce((s,x)=>s+Number(x.total||0),0);
  const saleEl=document.getElementById("totalSales"); if(saleEl)saleEl.textContent=money(sales);
  const cats=["Women","Men","Accessories"], total=p.length||1;
  const cs=document.getElementById("categorySummary");
  if(cs)cs.innerHTML=cats.map(c=>{const n=p.filter(x=>x.category===c).length;return `<div class="category-row"><span>${c}</span><div class="progress-line"><b style="width:${Math.round(n/total*100)}%"></b></div><strong>${n}</strong></div>`}).join("");
  const chart=document.getElementById("salesChart");
  if(chart){
    const vals=[42,68,51,86,73,100], labels=["Mar","Apr","May","Jun","Jul","Aug"], max=100;
    chart.innerHTML=vals.map((v,i)=>`<div class="bar"><i style="height:${v/max*82}%"></i><span>${labels[i]}</span></div>`).join("");
  }
  const ro=document.getElementById("recentOrders");
  if(ro){
    const list=o.slice(-5).reverse();
    ro.innerHTML=list.length?list.map(x=>`<tr><td><strong>#${esc(x.id)}</strong></td><td>${esc(x.customer||"Guest")}</td><td>${esc(x.date||"—")}</td><td>${money(x.total)}</td><td>${statusHtml(x.status||"Pending")}</td></tr>`).join(""):`<tr><td colspan="5" class="text-center text-muted py-5">No orders yet.</td></tr>`;
  }
  const tp=document.getElementById("topProducts");
  if(tp)tp.innerHTML=p.slice(0,4).map(x=>`<div class="mini-product"><img src="${esc(x.image)}" alt=""><div><strong>${esc(x.name)}</strong><small>${money(x.price)}</small></div></div>`).join("");
}

function statusHtml(s){return `<span class="status ${String(s).toLowerCase()}">${esc(s)}</span>`}

function renderProducts(){
  const tbody=document.getElementById("productsTable"); if(!tbody)return;
  const q=(document.getElementById("productSearch")?.value||"").toLowerCase();
  const cat=document.getElementById("categoryFilter")?.value||"All";
  const list=products().filter(p=>(cat==="All"||p.category===cat)&&(`${p.name} ${p.category}`.toLowerCase().includes(q)));
  document.getElementById("emptyProducts")?.classList.toggle("d-none",!!list.length);
  tbody.innerHTML=list.map(p=>`<tr>
    <td><div class="product-cell"><img class="product-thumb" src="${esc(p.image)}"><div><strong>${esc(p.name)}</strong><small class="d-block text-muted">${(p.sizes||[]).join(", ")}</small></div></div></td>
    <td>${esc(p.category)}</td><td><strong>${money(p.price)}</strong>${p.oldPrice?`<del class="d-block text-muted">${money(p.oldPrice)}</del>`:""}</td>
    <td>★ ${Number(p.rating||0).toFixed(1)} <small class="text-muted">(${p.reviews||0})</small></td><td>#${p.id}</td>
    <td><button class="action-btn" onclick="editProduct(${p.id})" title="Edit"><i class="fa-solid fa-pen"></i></button><button class="action-btn delete" onclick="deleteProduct(${p.id})" title="Delete"><i class="fa-solid fa-trash"></i></button></td>
  </tr>`).join("");
  updateSideCount();
}
function openProductModal(id=null){
  const modal=document.getElementById("productModal"); if(!modal)return;
  document.getElementById("productForm").reset();document.getElementById("productId").value="";
  document.getElementById("imagePreview").innerHTML='<i class="fa-regular fa-image"></i>';
  document.getElementById("modalTitle").textContent=id?"Edit Product":"Add Product";
  if(id){
    const p=products().find(x=>Number(x.id)===Number(id));if(!p)return;
    productId.value=p.id;productName.value=p.name;productCategory.value=p.category;productPrice.value=p.price;productOldPrice.value=p.oldPrice||"";productRating.value=p.rating||0;productReviews.value=p.reviews||0;productImage.value=p.image||"";productSizes.value=(p.sizes||[]).join(", ");productColors.value=(p.colors||[]).join(", ");
    if(p.image)document.getElementById("imagePreview").innerHTML=`<img src="${esc(p.image)}">`;
  }
  modal.classList.add("show");
}
function closeProductModal(){document.getElementById("productModal")?.classList.remove("show")}
function editProduct(id){openProductModal(id)}
function deleteProduct(id){
  const p=products().find(x=>Number(x.id)===Number(id));
  if(!p||!confirm(`Delete "${p.name}"?`))return;
  saveProducts(products().filter(x=>Number(x.id)!==Number(id)));renderProducts();
}
function bindProductForm(){
  const form=document.getElementById("productForm");if(!form)return;
  const file=document.getElementById("productImageFile");
  file.addEventListener("change",()=>{
    const f=file.files[0];if(!f)return;
    const reader=new FileReader();reader.onload=e=>{document.getElementById("productImage").value=e.target.result;document.getElementById("imagePreview").innerHTML=`<img src="${e.target.result}">`};reader.readAsDataURL(f);
  });
  document.getElementById("productImage").addEventListener("input",e=>{if(e.target.value)document.getElementById("imagePreview").innerHTML=`<img src="${esc(e.target.value)}">`});
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const id=document.getElementById("productId").value;
    const data={name:productName.value.trim(),category:productCategory.value,price:Number(productPrice.value),oldPrice:Number(productOldPrice.value)||0,rating:Number(productRating.value)||0,reviews:Number(productReviews.value)||0,image:productImage.value.trim(),sizes:productSizes.value.split(",").map(x=>x.trim()).filter(Boolean),colors:productColors.value.split(",").map(x=>x.trim()).filter(Boolean)};
    if(!data.image){alert("Please choose an image or enter an image URL.");return}
    let list=products();
    if(id){const i=list.findIndex(x=>Number(x.id)===Number(id));if(i>=0)list[i]={...list[i],...data}}
    else list.push({id:Date.now(),...data});
    saveProducts(list);closeProductModal();renderProducts();alert(id?"Product updated successfully.":"Product added successfully.");
  });
}
function renderOrders(){
  const t=document.getElementById("ordersTable");if(!t)return;
  const q=(document.getElementById("orderSearch")?.value||"").toLowerCase(), s=document.getElementById("orderStatus")?.value||"All";
  const list=orders().filter(o=>(s==="All"||o.status===s)&&(`${o.id} ${o.customer||""}`.toLowerCase().includes(q)));
  t.innerHTML=list.length?list.map(o=>`<tr><td><strong>#${esc(o.id)}</strong></td><td>${esc(o.customer||"Guest")}</td><td>${o.items||1}</td><td>${esc(o.date||"—")}</td><td><strong>${money(o.total)}</strong></td><td>${statusHtml(o.status||"Pending")}</td><td><select class="form-select form-select-sm" onchange="changeOrderStatus('${esc(o.id)}',this.value)"><option ${o.status==="Pending"?"selected":""}>Pending</option><option ${o.status==="Processing"?"selected":""}>Processing</option><option ${o.status==="Completed"?"selected":""}>Completed</option><option ${o.status==="Cancelled"?"selected":""}>Cancelled</option></select></td></tr>`).join(""):`<tr><td colspan="7" class="text-center text-muted py-5">No orders found.</td></tr>`;
}
function changeOrderStatus(id,status){let o=orders();const i=o.findIndex(x=>String(x.id)===String(id));if(i>=0){o[i].status=status;localStorage.setItem(ORDER_KEY,JSON.stringify(o));renderOrders()}}
function renderCustomers(){
  const t=document.getElementById("customersTable");if(!t)return;
  const q=(document.getElementById("customerSearch")?.value||"").toLowerCase(), list=users().filter(u=>`${u.name||""} ${u.email||""}`.toLowerCase().includes(q));
  t.innerHTML=list.length?list.map(u=>`<tr><td><div class="customer-cell"><div class="customer-avatar">${esc((u.name||"U")[0].toUpperCase())}</div><strong>${esc(u.name||"User")}</strong></div></td><td>${esc(u.email||"—")}</td><td>${esc(u.joined||u.createdAt||"—")}</td><td>${u.orders||0}</td><td><button class="action-btn" onclick="alert('Customer: ${esc(u.name||"User")}\\nEmail: ${esc(u.email||"—")}')"><i class="fa-regular fa-eye"></i></button></td></tr>`).join(""):`<tr><td colspan="5" class="text-center text-muted py-5">No registered customers found.</td></tr>`;
}
function settings(){
  const form=document.getElementById("settingsForm");if(!form)return;
  const s=read("vshopping_settings",{name:"V-Shopping",email:"support@vshopping.com",phone:"+855 12 345 678",address:"Phnom Penh, Cambodia"});
  storeName.value=s.name;storeEmail.value=s.email;storePhone.value=s.phone;storeAddress.value=s.address;
  form.addEventListener("submit",e=>{e.preventDefault();localStorage.setItem("vshopping_settings",JSON.stringify({name:storeName.value,email:storeEmail.value,phone:storePhone.value,address:storeAddress.value}));alert("Settings saved.")});
}
function resetProducts(){if(confirm("This will replace your current product catalog with the demo products. Continue?")){saveProducts(demoProducts);renderProducts();alert("Products reset.")}}
function clearCart(){localStorage.removeItem("cart");alert("Cart cleared.")}

document.addEventListener("DOMContentLoaded",()=>{
  updateSideCount();dashboard();renderProducts();renderOrders();renderCustomers();settings();bindProductForm();
  ["productSearch","categoryFilter"].forEach(id=>document.getElementById(id)?.addEventListener("input",renderProducts));
  ["orderSearch","orderStatus"].forEach(id=>document.getElementById(id)?.addEventListener("input",renderOrders));
  document.getElementById("customerSearch")?.addEventListener("input",renderCustomers);
});
