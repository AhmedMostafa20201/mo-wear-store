const WHATSAPP_NUMBER = "201000000000"; // غيّر الرقم لرقم WhatsApp الخاص بالمتجر

const colors = {
  black: "أسود", beige: "بيج", white: "أبيض", burgundy: "نبيتي", olive: "زيتي"
};
const sizes = ["M","L","XL","2XL","3XL"];

const products = [
  {id:1,name:"Shadow Headphone",image:"images/model-01.png",color:"black",desc:"Graphic Oversized Tee"},
  {id:2,name:"Rose California",image:"images/model-02.png",color:"beige",desc:"Minimal Graphic Tee"},
  {id:3,name:"Warrior Way",image:"images/model-03.png",color:"black",desc:"Japanese Inspired Tee"},
  {id:4,name:"Courage",image:"images/model-04.png",color:"olive",desc:"Minimal Street Tee"},
  {id:5,name:"Broken Crown",image:"images/model-05.png",color:"black",desc:"Graphic Box Fit Tee"}
];

let cart = [];
let selectedProduct = null;
let selectedColor = "black";
let selectedSize = "L";
let selectedFit = "Oversized";

function renderProducts(filter="all"){
  const grid=document.getElementById("productGrid");
  const list = filter==="all" ? products : products.filter(p=>p.color===filter);
  grid.innerHTML=list.map(p=>`
    <article class="product">
      <img class="product-img" src="${p.image}" alt="${p.name}">
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-meta">
          <span class="product-price">400 EGP</span>
          <button class="view-btn" onclick="openProduct(${p.id})">اختار</button>
        </div>
      </div>
    </article>`).join("");
}
renderProducts();

document.querySelectorAll(".filter").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

function openProduct(id){
  selectedProduct=products.find(p=>p.id===id);
  selectedColor=selectedProduct.color;
  selectedSize="L";
  selectedFit="Oversized";
  document.getElementById("modalImage").src=selectedProduct.image;
  document.getElementById("modalName").textContent=selectedProduct.name;
  document.getElementById("colorOptions").innerHTML=Object.entries(colors).map(([key,name])=>
    `<button class="option color-option ${key===selectedColor?'active':''}" data-color="${key}">${name}</button>`).join("");
  document.getElementById("sizeOptions").innerHTML=sizes.map(s=>
    `<button class="option size-option ${s===selectedSize?'active':''}" data-size="${s}">${s}</button>`).join("");
  document.querySelectorAll(".fit-option").forEach(b=>b.classList.toggle("active",b.dataset.fit===selectedFit));
  document.querySelectorAll(".color-option").forEach(b=>b.onclick=()=>{selectedColor=b.dataset.color;document.querySelectorAll(".color-option").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
  document.querySelectorAll(".size-option").forEach(b=>b.onclick=()=>{selectedSize=b.dataset.size;document.querySelectorAll(".size-option").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
  document.querySelectorAll(".fit-option").forEach(b=>b.onclick=()=>{selectedFit=b.dataset.fit;document.querySelectorAll(".fit-option").forEach(x=>x.classList.remove("active"));b.classList.add("active")});
  document.getElementById("modal").classList.remove("hidden");
}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
function addToCart(){
  cart.push({product:selectedProduct,size:selectedSize,color:colors[selectedColor],fit:selectedFit,price:400});
  updateCartCount(); closeModal(); openCart();
}
function updateCartCount(){document.getElementById("cartCount").textContent=cart.length}
function openCart(){renderCart();document.getElementById("cartModal").classList.remove("hidden")}
function closeCart(){document.getElementById("cartModal").classList.add("hidden")}
function removeCart(i){cart.splice(i,1);updateCartCount();renderCart()}
function renderCart(){
  const box=document.getElementById("cartItems");
  if(!cart.length){box.innerHTML='<p style="color:#999;padding:25px 0">السلة فاضية — اختار موديل يعجبك 👕</p>';document.getElementById("cartTotal").textContent="0 EGP";return}
  box.innerHTML=cart.map((x,i)=>`
    <div class="cart-item">
      <img src="${x.product.image}" alt="">
      <div><h4>${x.product.name}</h4><p>${x.color} • ${x.size} • ${x.fit}</p><b>400 EGP</b></div>
      <button class="remove" onclick="removeCart(${i})">حذف</button>
    </div>`).join("");
  document.getElementById("cartTotal").textContent=`${cart.length*400} EGP`;
}
function checkoutWhatsApp(){
  if(!cart.length){alert("السلة فاضية");return}
  let text="طلب جديد من MO-WEAR%0A%0A";
  cart.forEach((x,i)=>text+=`${i+1}) ${x.product.name} - ${x.color} - ${x.size} - ${x.fit} - 400 EGP%0A`);
  text+=`%0Aالإجمالي: ${cart.length*400} EGP`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`,"_blank");
}
document.getElementById("whatsappFooter").href=`https://wa.me/${WHATSAPP_NUMBER}`;
