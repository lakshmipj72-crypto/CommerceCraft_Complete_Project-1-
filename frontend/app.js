let cart = JSON.parse(localStorage.getItem("commercecraft_cart") || "[]");
let activeCategory = "all";

const money = n => "₹" + Number(n).toLocaleString("en-IN");

async function loadCategories(){
  const cats = await fetch("/api/categories").then(r=>r.json());
  document.getElementById("categories").innerHTML =
    `<button class="chip ${activeCategory==="all"?"active":""}" onclick="setCategory('all')">All</button>` +
    cats.map(c=>`<button class="chip ${activeCategory===c.toLowerCase()?"active":""}" onclick="setCategory('${c}')">${c}</button>`).join("");
}
function setCategory(c){activeCategory=c.toLowerCase();loadCategories();loadProducts()}
async function loadProducts(){
  const q=document.getElementById("search").value;
  const data=await fetch(`/api/products?q=${encodeURIComponent(q)}&category=${encodeURIComponent(activeCategory)}`).then(r=>r.json());
  document.getElementById("products").innerHTML=data.map(p=>`
    <article class="product">
      <img src="${p.image}" alt="${escapeHtml(p.name)}">
      <div class="product-body"><h3>${escapeHtml(p.name)}</h3>
      <p>${escapeHtml(p.description)}</p><div class="price">${money(p.price)}</div>
      <button class="primary" onclick="addToCart(${p.id})" ${p.stock<=0?"disabled":""}>${p.stock<=0?"Out of stock":"Add to cart"}</button></div>
    </article>`).join("") || "<p>No products found.</p>";
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
async function addToCart(id){
  const p=await fetch(`/api/products/${id}`).then(r=>r.json());
  const item=cart.find(x=>x.id===p.id);
  if(item) item.quantity++; else cart.push({...p,quantity:1});
  saveCart(); showToast("Added to cart");
}
function saveCart(){localStorage.setItem("commercecraft_cart",JSON.stringify(cart));renderCart()}
function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x.quantity,0);
  document.getElementById("cartItems").innerHTML=cart.length?cart.map((x,i)=>`
    <div class="cart-item"><img src="${x.image}"><div class="grow"><b>${escapeHtml(x.name)}</b><div>${money(x.price)}</div>
    <div class="qty"><button onclick="changeQty(${i},-1)">−</button> ${x.quantity} <button onclick="changeQty(${i},1)">+</button>
    <button onclick="removeItem(${i})">Remove</button></div></div></div>`).join(""):"<p>Your cart is empty.</p>";
  document.getElementById("cartTotal").textContent=money(cart.reduce((a,x)=>a+x.price*x.quantity,0));
}
function changeQty(i,d){cart[i].quantity+=d;if(cart[i].quantity<=0)cart.splice(i,1);saveCart()}
function removeItem(i){cart.splice(i,1);saveCart()}
function toggleCart(){document.getElementById("cart").classList.toggle("open")}
async function checkout(){
  if(!cart.length)return showToast("Your cart is empty");
  const name=prompt("Customer name:");
  if(!name)return;
  const email=prompt("Customer email:");
  if(!email)return;
  const total=cart.reduce((a,x)=>a+x.price*x.quantity,0);
  const res=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer:{name,email},items:cart,total})});
  const data=await res.json();
  if(!res.ok)return showToast(data.message||"Checkout failed");
  cart=[];saveCart();toggleCart();showToast(`Order #${data.id} placed successfully`);
  loadProducts();
}
document.getElementById("productForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const body={name:pname.value,price:pprice.value,category:pcat.value,stock:pstock.value,image:pimage.value,description:pdesc.value};
  const res=await fetch("/api/products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  if(res.ok){e.target.reset();pstock.value=10;showToast("Product added");loadCategories();loadProducts()}else showToast("Could not add product");
});
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
loadCategories();loadProducts();renderCart();