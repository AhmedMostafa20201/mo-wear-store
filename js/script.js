const products = [
  {id:1,name:"Shadow Logo Tee",category:"tshirts",price:650,desc:"Heavyweight black tee with signature MO-WEAR attitude."},
  {id:2,name:"Red Flame Tee",category:"tshirts",price:700,desc:"Graphic streetwear tee with red flame details."},
  {id:3,name:"MO-WEAR Essential Hoodie",category:"hoodies",price:1200,desc:"Heavy fleece hoodie built for everyday street style."},
  {id:4,name:"Night Runner Hoodie",category:"hoodies",price:1350,desc:"Oversized hoodie with a bold urban silhouette."},
  {id:5,name:"Cargo Street Pants",category:"pants",price:1100,desc:"Relaxed cargo fit with functional pockets."},
  {id:6,name:"Black Utility Pants",category:"pants",price:1050,desc:"Clean utility pants designed for daily wear."}
];

let cart = JSON.parse(localStorage.getItem("moWearCart") || "[]");

const productsEl = document.getElementById("products");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const cartDrawer = document.getElementById("cartDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutBackdrop = document.getElementById("checkoutBackdrop");

function money(value){ return "EGP " + value.toLocaleString("en-EG"); }

function renderProducts(category="all"){
  const list = category === "all" ? products : products.filter(p => p.category === category);
  productsEl.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image"><div class="mock-shirt"></div></div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-meta">
          <span class="product-category">${p.category}</span>
          <span class="product-price">${money(p.price)}</span>
        </div>
        <div class="product-actions">
          <button class="add-btn" onclick="addToCart(${p.id})">ADD TO CART</button>
          <button class="view-btn" onclick="showProduct(${p.id})">DETAILS</button>
        </div>
      </div>
    </article>
  `).join("");
}

function saveCart(){
  localStorage.setItem("moWearCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id){
  const existing = cart.find(item => item.id === id);
  if(existing) existing.qty++;
  else cart.push({id,qty:1});
  saveCart();
  openCart();
}

function changeQty(id, amount){
  const item = cart.find(x => x.id === id);
  if(!item) return;
  item.qty += amount;
  if(item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart();
}

function renderCart(){
  const totalQty = cart.reduce((sum,item)=>sum+item.qty,0);
  cartCountEl.textContent = totalQty;
  if(!cart.length){
    cartItemsEl.innerHTML = `<div class="empty-cart">YOUR CART IS EMPTY.<br><br>ADD SOMETHING YOU LIKE.</div>`;
    cartTotalEl.textContent = money(0);
    return;
  }
  let total = 0;
  cartItemsEl.innerHTML = cart.map(item=>{
    const p = products.find(x=>x.id===item.id);
    total += p.price * item.qty;
    return `
      <div class="cart-item">
        <div class="cart-thumb">MO</div>
        <div>
          <h3>${p.name}</h3>
          <p>${money(p.price)} · ${p.category}</p>
          <div class="qty">
            <button onclick="changeQty(${p.id},-1)">−</button>
            <strong>${item.qty}</strong>
            <button onclick="changeQty(${p.id},1)">+</button>
          </div>
        </div>
        <button class="remove" onclick="changeQty(${p.id},-${item.qty})">Remove</button>
      </div>`;
  }).join("");
  cartTotalEl.textContent = money(total);
}

function showProduct(id){
  const p = products.find(x=>x.id===id);
  alert(`${p.name}\n\n${p.desc}\n\nPrice: ${money(p.price)}\n\nAdd your real product photos, sizes and colors in the next version.`);
}

function openCart(){
  cartDrawer.classList.add("open");
  drawerBackdrop.classList.add("show");
}
function closeCart(){
  cartDrawer.classList.remove("open");
  drawerBackdrop.classList.remove("show");
}
function openCheckout(){
  if(!cart.length){ alert("Your cart is empty."); return; }
  closeCart();
  checkoutModal.classList.add("show");
  checkoutBackdrop.classList.add("show");
}
function closeCheckout(){
  checkoutModal.classList.remove("show");
  checkoutBackdrop.classList.remove("show");
}

document.querySelectorAll(".filter").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.category);
  });
});

document.querySelectorAll("[data-category-link]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const category = btn.dataset.categoryLink;
    document.querySelector('#shop').scrollIntoView({behavior:"smooth"});
    setTimeout(()=>{
      document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active", b.dataset.category===category));
      renderProducts(category);
    },250);
  });
});

document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
drawerBackdrop.addEventListener("click",closeCart);
document.getElementById("checkoutButton").addEventListener("click",openCheckout);
document.getElementById("clearCart").addEventListener("click",()=>{cart=[];saveCart();});
document.getElementById("closeCheckout").addEventListener("click",closeCheckout);
checkoutBackdrop.addEventListener("click",closeCheckout);
document.getElementById("menuButton").addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("nav").classList.remove("open")));

document.getElementById("checkoutForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  const data = new FormData(e.target);
  const order = {
    customer:Object.fromEntries(data.entries()),
    items:cart.map(item=>({product:products.find(p=>p.id===item.id).name,qty:item.qty})),
    total:cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0),
    createdAt:new Date().toISOString()
  };
  console.log("MO-WEAR ORDER",order);
  localStorage.setItem("lastMoWearOrder",JSON.stringify(order));
  e.target.style.display="none";
  document.querySelector(".modal .small").style.display="none";
  document.getElementById("orderSuccess").classList.add("show");
  cart=[];
  saveCart();
});

document.getElementById("closeSuccess").addEventListener("click",()=>{
  document.getElementById("checkoutForm").reset();
  document.getElementById("checkoutForm").style.display="grid";
  document.querySelector(".modal .small").style.display="block";
  document.getElementById("orderSuccess").classList.remove("show");
  closeCheckout();
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
