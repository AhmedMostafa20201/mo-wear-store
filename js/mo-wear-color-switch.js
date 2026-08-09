/*
  MO-WEAR — Product color switcher
  --------------------------------
  Put this file in: js/script.js

  It uses the real product photos already in /images and recolors only
  the T-shirt area in the browser. No extra color images are required.

  Product images expected:
    images/model-00.png ... images/model-04.png
*/

const COLORS = {
  Black:   { rgb: [18, 18, 18], swatch: "#111111" },
  White:   { rgb: [235, 232, 225], swatch: "#f2f0e9" },
  Burgundy:{ rgb: [112, 22, 42], swatch: "#70162a" },
  Beige:   { rgb: [214, 190, 158], swatch: "#d6be9e" }
};

const SIZES = ["M", "L", "XL"];

const products = [
  {
    id: 1,
    name: "Fire Graphic Tee",
    image: "images/model-00.png",
    price: 400,
    category: "tshirts",
    desc: "Oversized MO-WEAR graphic tee.",
    // shirt silhouette, normalized 0..1
    mask: [[.05,.39],[.18,.27],[.36,.21],[.50,.19],[.64,.21],[.82,.27],[.97,.40],[.91,.63],[.86,.89],[.78,.94],[.22,.94],[.14,.88],[.08,.62]]
  },
  {
    id: 2,
    name: "Red Shadow Tee",
    image: "images/model-01.png",
    price: 400,
    category: "tshirts",
    desc: "Black statement tee with bold red graphic.",
    mask: [[.10,.34],[.24,.25],[.40,.22],[.52,.20],[.66,.23],[.82,.30],[.94,.40],[.88,.64],[.85,.91],[.22,.92],[.16,.72],[.07,.59]]
  },
  {
    id: 3,
    name: "Rose California Tee",
    image: "images/model-02.png",
    price: 400,
    category: "tshirts",
    desc: "Clean oversized tee with rose California graphic.",
    mask: [[.09,.34],[.22,.25],[.40,.20],[.52,.18],[.67,.21],[.82,.28],[.95,.38],[.89,.61],[.84,.89],[.25,.91],[.15,.72],[.07,.58]]
  },
  {
    id: 4,
    name: "Warrior Tee",
    image: "images/model-03.png",
    price: 400,
    category: "tshirts",
    desc: "Streetwear tee with warrior-inspired graphics.",
    mask: [[.08,.32],[.20,.25],[.37,.21],[.52,.20],[.67,.22],[.82,.28],[.94,.38],[.89,.62],[.86,.91],[.20,.91],[.15,.69],[.06,.57]]
  },
  {
    id: 5,
    name: "Courage Tee",
    image: "images/model-04.png",
    price: 400,
    category: "tshirts",
    desc: "Minimal Courage tee with a clean streetwear fit.",
    mask: [[.06,.34],[.20,.25],[.37,.20],[.52,.18],[.67,.21],[.82,.28],[.96,.39],[.89,.64],[.84,.91],[.21,.91],[.14,.70],[.05,.58]]
  }
];

let cart = JSON.parse(localStorage.getItem("moWearCart") || "[]");
const imageCache = new Map();

const productsEl = document.getElementById("products");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const cartDrawer = document.getElementById("cartDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutBackdrop = document.getElementById("checkoutBackdrop");

function money(value){ return "EGP " + value.toLocaleString("en-EG"); }
function escapeHtml(v){
  return String(v).replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));
}

function hideOldCategories(){
  document.querySelectorAll(".filter").forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();
    const cat = (btn.dataset.category || "").toLowerCase();
    if(text === "hoodies" || text === "hoodie" || text === "pants" || cat === "hoodies" || cat === "pants") btn.remove();
  });
}

function pointInPolygon(x, y, polygon){
  let inside = false;
  for(let i=0, j=polygon.length-1; i<polygon.length; j=i++){
    const xi=polygon[i][0], yi=polygon[i][1];
    const xj=polygon[j][0], yj=polygon[j][1];
    const intersect = ((yi>y)!==(yj>y)) && (x < (xj-xi)*(y-yi)/(yj-yi)+xi);
    if(intersect) inside=!inside;
  }
  return inside;
}

function loadImage(src){
  if(imageCache.has(src)) return imageCache.get(src);
  const p = new Promise((resolve,reject)=>{
    const img = new Image();
    img.onload=()=>resolve(img);
    img.onerror=reject;
    img.src=src;
  });
  imageCache.set(src,p);
  return p;
}

function recolorCanvas(canvas, product, colorName){
  const img = imageCache.get(product.image);
  if(!img || !img.complete) return;

  const ctx = canvas.getContext("2d", {willReadFrequently:true});
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0,0,w,h);
  ctx.drawImage(img,0,0,w,h);

  if(colorName === "Black") return;

  const data = ctx.getImageData(0,0,w,h);
  const px = data.data;
  const target = COLORS[colorName].rgb;
  const poly = product.mask;

  // Work only inside the T-shirt silhouette.
  for(let y=0; y<h; y++){
    const ny = y/h;
    for(let x=0; x<w; x++){
      const nx = x/w;
      if(!pointInPolygon(nx,ny,poly)) continue;

      const i=(y*w+x)*4;
      const r=px[i], g=px[i+1], b=px[i+2];
      const max=Math.max(r,g,b), min=Math.min(r,g,b);
      const lum=(0.2126*r+0.7152*g+0.0722*b)/255;
      const sat=max===0 ? 0 : (max-min)/max;

      // Keep very bright/high-contrast artwork and highlights.
      if((lum>.82 && sat<.28) || lum>.94) continue;

      // Keep strongly colored artwork (red print, orange labels, etc.).
      if(sat>.55 && (r>g*1.35 || g>b*1.35)) continue;

      // Preserve the original fabric's light/shadow information.
      const shadow = 0.24 + lum*0.92;
      let nr=target[0]*shadow;
      let ng=target[1]*shadow;
      let nb=target[2]*shadow;

      // Softly retain some original texture/highlights.
      const mix = 0.84;
      nr=nr*mix+r*(1-mix);
      ng=ng*mix+g*(1-mix);
      nb=nb*mix+b*(1-mix);

      px[i]=Math.max(0,Math.min(255,nr));
      px[i+1]=Math.max(0,Math.min(255,ng));
      px[i+2]=Math.max(0,Math.min(255,nb));
    }
  }

  ctx.putImageData(data,0,0);
}

async function prepareCanvas(canvas, product, color){
  const img = await loadImage(product.image);
  imageCache.set(product.image,img);
  canvas.width=img.naturalWidth || img.width;
  canvas.height=img.naturalHeight || img.height;
  recolorCanvas(canvas,product,color);
}

function swatches(product, selected="Black"){
  return `<div class="mw-color-swatches" data-product-swatches="${product.id}">
    ${Object.entries(COLORS).map(([name,c])=>`
      <button class="mw-swatch ${name===selected?'selected':''}"
        title="${name}" aria-label="${name}" data-color="${name}"
        style="--swatch:${c.swatch}"
        onclick="event.stopPropagation();selectCardColor(${product.id}, '${name}')"></button>
    `).join("")}
  </div>`;
}

function renderProducts(category="all"){
  hideOldCategories();
  const list=category==="all" ? products : products.filter(p=>p.category===category);

  productsEl.innerHTML=list.map(p=>`
    <article class="product-card">
      <div class="product-image mw-real-image">
        <canvas class="mw-product-canvas" data-canvas-product="${p.id}"></canvas>
        <span class="mw-badge">NEW</span>
      </div>
      <div class="product-info">
        <div class="product-name">${escapeHtml(p.name)}</div>
        <div class="product-meta">
          <span class="product-category">T-SHIRT</span>
          <span class="product-price">${money(p.price)}</span>
        </div>
        ${swatches(p)}
        <div class="mw-size-note">M · L · XL</div>
        <div class="product-actions">
          <button class="add-btn" onclick="showProduct(${p.id})">ADD TO CART</button>
          <button class="view-btn" onclick="showProduct(${p.id})">DETAILS</button>
        </div>
      </div>
    </article>
  `).join("");

  list.forEach(async p=>{
    const canvas=document.querySelector(`[data-canvas-product="${p.id}"]`);
    if(canvas) await prepareCanvas(canvas,p,"Black");
  });
}

async function selectCardColor(id,color){
  const p=products.find(x=>x.id===id);
  if(!p) return;
  const canvas=document.querySelector(`[data-canvas-product="${id}"]`);
  if(canvas) await prepareCanvas(canvas,p,color);
  document.querySelectorAll(`[data-product-swatches="${id}"] .mw-swatch`).forEach(b=>b.classList.toggle("selected",b.dataset.color===color));
}

function saveCart(){
  localStorage.setItem("moWearCart",JSON.stringify(cart));
  renderCart();
}

function addToCart(id,color="Black",size="M"){
  const existing=cart.find(x=>x.id===id && x.color===color && x.size===size);
  if(existing) existing.qty++;
  else cart.push({id,qty:1,color,size});
  saveCart();
  openCart();
}

function changeQty(index,amount){
  if(!cart[index]) return;
  cart[index].qty+=amount;
  if(cart[index].qty<=0) cart.splice(index,1);
  saveCart();
}

function renderCart(){
  const totalQty=cart.reduce((s,i)=>s+i.qty,0);
  cartCountEl.textContent=totalQty;
  if(!cart.length){
    cartItemsEl.innerHTML=`<div class="empty-cart">YOUR CART IS EMPTY.<br><br>ADD SOMETHING YOU LIKE.</div>`;
    cartTotalEl.textContent=money(0);
    return;
  }
  let total=0;
  cartItemsEl.innerHTML=cart.map((item,index)=>{
    const p=products.find(x=>x.id===item.id);
    if(!p) return "";
    total+=p.price*item.qty;
    return `<div class="cart-item">
      <div class="cart-thumb"><img src="${p.image}" alt="${escapeHtml(p.name)}"></div>
      <div><h3>${escapeHtml(p.name)}</h3><p>${money(p.price)}</p><p class="mw-cart-variant">${escapeHtml(item.color)} · Size ${escapeHtml(item.size)}</p>
      <div class="qty"><button onclick="changeQty(${index},-1)">−</button><strong>${item.qty}</strong><button onclick="changeQty(${index},1)">+</button></div></div>
      <button class="remove" onclick="changeQty(${index},-${item.qty})">Remove</button>
    </div>`;
  }).join("");
  cartTotalEl.textContent=money(total);
}

async function showProduct(id){
  const p=products.find(x=>x.id===id);
  if(!p) return;

  let modal=document.getElementById("mwProductModal");
  let backdrop=document.getElementById("mwProductBackdrop");

  if(!modal){
    backdrop=document.createElement("div");
    backdrop.id="mwProductBackdrop";
    backdrop.className="modal-backdrop";
    backdrop.onclick=closeProductModal;
    document.body.appendChild(backdrop);

    modal=document.createElement("div");
    modal.id="mwProductModal";
    modal.className="modal mw-product-modal";
    document.body.appendChild(modal);
  }

  modal.innerHTML=`
    <button class="modal-close" onclick="closeProductModal()">×</button>
    <div class="mw-modal-image"><canvas id="mwModalCanvas"></canvas></div>
    <div class="mw-modal-copy">
      <p class="eyebrow">MO-WEAR / T-SHIRT</p>
      <h2>${escapeHtml(p.name)}</h2>
      <div class="mw-modal-price">${money(p.price)}</div>
      <p class="mw-modal-desc">${escapeHtml(p.desc)}</p>
      <label class="mw-label">COLOR</label>
      <div class="mw-modal-swatches">
        ${Object.entries(COLORS).map(([name,c])=>`<button class="mw-swatch mw-modal-swatch ${name==='Black'?'selected':''}" title="${name}" aria-label="${name}" data-color="${name}" style="--swatch:${c.swatch}" onclick="selectModalColor(${p.id}, '${name}')"></button>`).join("")}
      </div>
      <div class="mw-selected-color" id="mwSelectedColor">Black</div>
      <label class="mw-label">SIZE</label>
      <div class="mw-size-buttons">
        ${SIZES.map((s,i)=>`<button class="mw-size ${i===0?'selected':''}" data-size="${s}" onclick="selectModalSize(this)">${s}</button>`).join("")}
      </div>
      <button class="btn btn-red full" onclick="confirmModalAdd(${p.id})">ADD TO CART — ${money(p.price)}</button>
    </div>
  `;

  modal.classList.add("show");
  backdrop.classList.add("show");
  await prepareCanvas(document.getElementById("mwModalCanvas"),p,"Black");
}

async function selectModalColor(id,color){
  const p=products.find(x=>x.id===id);
  if(!p) return;
  document.querySelectorAll(".mw-modal-swatch").forEach(b=>b.classList.toggle("selected",b.dataset.color===color));
  document.getElementById("mwSelectedColor").textContent=color;
  await prepareCanvas(document.getElementById("mwModalCanvas"),p,color);
}

function selectModalSize(btn){
  document.querySelectorAll(".mw-size").forEach(b=>b.classList.remove("selected"));
  btn.classList.add("selected");
}

function confirmModalAdd(id){
  const color=document.querySelector(".mw-modal-swatch.selected")?.dataset.color || "Black";
  const size=document.querySelector(".mw-size.selected")?.dataset.size || "M";
  closeProductModal();
  addToCart(id,color,size);
}

function closeProductModal(){
  document.getElementById("mwProductModal")?.classList.remove("show");
  document.getElementById("mwProductBackdrop")?.classList.remove("show");
}

function openCart(){cartDrawer.classList.add("open");drawerBackdrop.classList.add("show");}
function closeCart(){cartDrawer.classList.remove("open");drawerBackdrop.classList.remove("show");}
function openCheckout(){if(!cart.length){alert("Your cart is empty.");return;}closeCart();checkoutModal.classList.add("show");checkoutBackdrop.classList.add("show");}
function closeCheckout(){checkoutModal.classList.remove("show");checkoutBackdrop.classList.remove("show");}

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts(btn.dataset.category);
}));

document.querySelectorAll("[data-category-link]").forEach(btn=>btn.addEventListener("click",()=>{
  const category=btn.dataset.categoryLink;
  document.querySelector("#shop")?.scrollIntoView({behavior:"smooth"});
  setTimeout(()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.category===category));
    renderProducts(category);
  },250);
}));

document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
drawerBackdrop.addEventListener("click",closeCart);
document.getElementById("checkoutButton").addEventListener("click",openCheckout);
document.getElementById("clearCart").addEventListener("click",()=>{cart=[];saveCart();});
document.getElementById("closeCheckout").addEventListener("click",closeCheckout);
checkoutBackdrop.addEventListener("click",closeCheckout);
document.getElementById("menuButton").addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("nav").classList.remove("open")));

document.getElementById("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(e.target);
  const order={
    customer:Object.fromEntries(data.entries()),
    items:cart.map(item=>({product:products.find(p=>p.id===item.id)?.name,color:item.color,size:item.size,qty:item.qty})),
    total:cart.reduce((s,item)=>s+(products.find(p=>p.id===item.id)?.price||0)*item.qty,0),
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

document.getElementById("year").textContent=new Date().getFullYear();

hideOldCategories();
renderProducts();
renderCart();
