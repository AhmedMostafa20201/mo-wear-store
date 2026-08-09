/* =========================================================
   MO-WEAR - COLOR SWITCH FIX
   Replace your current js/script.js with this file.
   Your existing CSS already contains the needed mw-* styles.

   Image names supported:
   Model 1: images/model-1.png (fallback: images/model-00.png)
   Model 2: images/model-02.png
   Model 3: images/model-03.png
   Model 4: images/model-04.png
   Model 5: images/model-05.png
   ========================================================= */

const COLORS = {
  Black:    { rgb: [18, 18, 18],   swatch: "#111111" },
  White:    { rgb: [238, 236, 231], swatch: "#f2f0e9" },
  Burgundy: { rgb: [112, 22, 42],  swatch: "#70162a" },
  Beige:    { rgb: [215, 191, 160], swatch: "#d7bfa0" }
};

const SIZES = ["M", "L", "XL"];

const products = [
  {
    id: 1,
    name: "Fire Graphic Tee",
    imageCandidates: ["images/model-1.png", "images/model-00.png"],
    price: 400,
    category: "tshirts",
    desc: "Oversized MO-WEAR graphic tee.",
    mask: [[.03,.37],[.18,.25],[.36,.19],[.50,.17],[.65,.19],[.82,.25],[.98,.38],
           [.92,.64],[.87,.90],[.78,.96],[.22,.96],[.13,.89],[.07,.63]]
  },
  {
    id: 2,
    name: "Rose California Tee",
    imageCandidates: ["images/model-02.png"],
    price: 400,
    category: "tshirts",
    desc: "Clean oversized tee with rose California graphic.",
    mask: [[.07,.30],[.21,.22],[.40,.18],[.53,.18],[.69,.21],[.84,.28],[.96,.40],
           [.89,.62],[.84,.91],[.24,.93],[.15,.73],[.06,.56]]
  },
  {
    id: 3,
    name: "Warrior Tee",
    imageCandidates: ["images/model-03.png"],
    price: 400,
    category: "tshirts",
    desc: "Streetwear tee with warrior-inspired graphics.",
    mask: [[.07,.30],[.20,.23],[.38,.19],[.52,.18],[.68,.20],[.83,.27],[.95,.38],
           [.89,.63],[.85,.91],[.20,.92],[.14,.70],[.06,.56]]
  },
  {
    id: 4,
    name: "Courage Tee",
    imageCandidates: ["images/model-04.png"],
    price: 400,
    category: "tshirts",
    desc: "Minimal Courage tee with a clean streetwear fit.",
    mask: [[.05,.32],[.20,.23],[.38,.18],[.52,.17],[.68,.20],[.83,.27],[.96,.39],
           [.90,.64],[.84,.92],[.21,.93],[.13,.71],[.05,.57]]
  },
  {
    id: 5,
    name: "Red Shadow Tee",
    imageCandidates: ["images/model-05.png", "images/model-01.png"],
    price: 400,
    category: "tshirts",
    desc: "Black statement tee with bold red graphic.",
    mask: [[.08,.32],[.21,.24],[.40,.20],[.53,.19],[.68,.22],[.83,.29],[.95,.40],
           [.89,.64],[.85,.91],[.20,.92],[.14,.70],[.06,.57]]
  }
];

let cart = JSON.parse(localStorage.getItem("moWearCart") || "[]");
const imageCache = new Map();

function money(value) {
  return "EGP " + Number(value).toLocaleString("en-EG");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;"
  }[c]));
}

function hideOldCategories() {
  document.querySelectorAll(".filter").forEach(btn => {
    const text = btn.textContent.trim().toLowerCase();
    const cat = (btn.dataset.category || "").toLowerCase();
    if (["hoodie","hoodies","pants"].includes(text) ||
        ["hoodie","hoodies","pants"].includes(cat)) {
      btn.remove();
    }
  });
}

function pointInPolygon(x, y, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const hit = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (hit) inside = !inside;
  }
  return inside;
}

async function loadFirstAvailableImage(candidates) {
  const key = candidates.join("|");
  if (imageCache.has(key)) return imageCache.get(key);

  const promise = new Promise((resolve, reject) => {
    let index = 0;

    const tryNext = () => {
      if (index >= candidates.length) {
        reject(new Error("Product image not found: " + candidates.join(", ")));
        return;
      }

      const src = candidates[index++];
      const img = new Image();

      img.onload = () => resolve({ img, src });
      img.onerror = tryNext;
      img.src = src;
    };

    tryNext();
  });

  imageCache.set(key, promise);
  return promise;
}

/*
  The color change is done here.
  We recolor pixels that look like fabric while leaving:
  - the background fire
  - bright print/highlights
  - strong red/orange artwork
  as much as possible.
*/
function recolorCanvas(canvas, product, colorName, image) {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(image, 0, 0, w, h);

  if (colorName === "Black") return;

  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;
  const target = COLORS[colorName].rgb;

  for (let y = 0; y < h; y++) {
    const ny = y / h;

    for (let x = 0; x < w; x++) {
      const nx = x / w;
      if (!pointInPolygon(nx, ny, product.mask)) continue;

      const i = (y * w + x) * 4;
      const r = px[i];
      const g = px[i + 1];
      const b = px[i + 2];

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const lum = (0.2126*r + 0.7152*g + 0.0722*b) / 255;
      const sat = max === 0 ? 0 : (max - min) / max;

      /*
        Background protection:
        Fire/background is strongly orange/red.
        Keep it untouched.
      */
      const orangeBackground =
        r > g * 1.35 && r > b * 1.55 && sat > 0.35;

      if (orangeBackground) continue;

      /*
        Keep the main graphic artwork.
        Strong red/orange graphics should stay visible.
      */
      const strongWarmGraphic =
        r > g * 1.30 && r > b * 1.35 && sat > 0.45;

      if (strongWarmGraphic) continue;

      /*
        Very bright pixels can be print/highlights.
        Keep only a portion of them so white/beige can still work.
      */
      if (lum > 0.96 && sat < 0.15) {
        if (colorName !== "White") continue;
      }

      /*
        Estimate original fabric brightness and transfer it
        to the selected target color.
      */
      let shade = 0.32 + lum * 0.90;

      if (colorName === "White") {
        shade = 0.72 + lum * 0.48;
      }

      if (colorName === "Beige") {
        shade = 0.52 + lum * 0.82;
      }

      if (colorName === "Burgundy") {
        shade = 0.42 + lum * 0.78;
      }

      let nr = target[0] * shade;
      let ng = target[1] * shade;
      let nb = target[2] * shade;

      /*
        Keep a little of the original pixel for realistic
        texture, folds and lighting.
      */
      const texture = colorName === "White" ? 0.16 : 0.20;

      nr = nr * (1-texture) + r * texture;
      ng = ng * (1-texture) + g * texture;
      nb = nb * (1-texture) + b * texture;

      px[i]     = Math.max(0, Math.min(255, nr));
      px[i + 1] = Math.max(0, Math.min(255, ng));
      px[i + 2] = Math.max(0, Math.min(255, nb));
    }
  }

  ctx.putImageData(data, 0, 0);
}

async function prepareCanvas(canvas, product, color) {
  try {
    const { img } = await loadFirstAvailableImage(product.imageCandidates);

    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    recolorCanvas(canvas, product, color, img);
  } catch (error) {
    console.error(error);

    canvas.width = 300;
    canvas.height = 400;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e50914";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("IMAGE NOT FOUND", 150, 200);
  }
}

function swatches(product, selected = "Black") {
  return `
    <div class="mw-color-swatches" data-product-swatches="${product.id}">
      ${Object.entries(COLORS).map(([name, c]) => `
        <button
          class="mw-swatch ${name === selected ? "selected" : ""}"
          title="${name}"
          aria-label="${name}"
          data-color="${name}"
          style="--swatch:${c.swatch}"
          onclick="event.stopPropagation(); selectCardColor(${product.id}, '${name}')">
        </button>
      `).join("")}
    </div>
  `;
}

function renderProducts(category = "all") {
  const productsEl = document.getElementById("products");
  if (!productsEl) return;

  hideOldCategories();

  const list = category === "all"
    ? products
    : products.filter(p => p.category === category);

  productsEl.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image mw-real-image">
        <canvas
          class="mw-product-canvas"
          data-canvas-product="${p.id}">
        </canvas>
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
          <button class="add-btn" onclick="showProduct(${p.id})">
            ADD TO CART
          </button>

          <button class="view-btn" onclick="showProduct(${p.id})">
            DETAILS
          </button>
        </div>
      </div>
    </article>
  `).join("");

  list.forEach(async product => {
    const canvas = document.querySelector(
      `[data-canvas-product="${product.id}"]`
    );

    if (canvas) {
      await prepareCanvas(canvas, product, "Black");
    }
  });
}

async function selectCardColor(id, color) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const canvas = document.querySelector(
    `[data-canvas-product="${id}"]`
  );

  if (canvas) {
    await prepareCanvas(canvas, product, color);
  }

  document.querySelectorAll(
    `[data-product-swatches="${id}"] .mw-swatch`
  ).forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.color === color);
  });
}

function saveCart() {
  localStorage.setItem("moWearCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id, color, size) {
  const existing = cart.find(
    item => item.id === id &&
            item.color === color &&
            item.size === size
  );

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, color, size, qty: 1 });
  }

  saveCart();
  closeProductModal();
  openCart();
}

function changeQty(index, amount) {
  if (!cart[index]) return;

  cart[index].qty += amount;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
}

function renderCart() {
  const cartItemsEl = document.getElementById("cartItems");
  const cartCountEl = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");

  if (!cartItemsEl || !cartCountEl || !cartTotalEl) return;

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalQty;

  if (!cart.length) {
    cartItemsEl.innerHTML = `
      <div class="empty-cart">
        YOUR CART IS EMPTY.<br><br>
        ADD SOMETHING YOU LIKE.
      </div>
    `;
    cartTotalEl.textContent = money(0);
    return;
  }

  let total = 0;

  cartItemsEl.innerHTML = cart.map((item, index) => {
    const p = products.find(x => x.id === item.id);
    if (!p) return "";

    total += p.price * item.qty;

    return `
      <div class="cart-item">
        <div class="cart-thumb">
          <img src="${p.imageCandidates[0]}" alt="${escapeHtml(p.name)}">
        </div>

        <div>
          <h3>${escapeHtml(p.name)}</h3>
          <p>${money(p.price)}</p>
          <p class="mw-cart-variant">
            Color: ${escapeHtml(item.color || "Black")}
            · Size: ${escapeHtml(item.size || "M")}
          </p>

          <div class="qty">
            <button onclick="changeQty(${index}, -1)">−</button>
            <strong>${item.qty}</strong>
            <button onclick="changeQty(${index}, 1)">+</button>
          </div>
        </div>

        <button
          class="remove"
          onclick="changeQty(${index}, -${item.qty})">
          Remove
        </button>
      </div>
    `;
  }).join("");

  cartTotalEl.textContent = money(total);
}

async function showProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  let modal = document.getElementById("mwProductModal");
  let backdrop = document.getElementById("mwProductBackdrop");

  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "mwProductBackdrop";
    backdrop.className = "modal-backdrop";
    backdrop.onclick = closeProductModal;
    document.body.appendChild(backdrop);
  }

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "mwProductModal";
    modal.className = "modal mw-product-modal";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <button class="modal-close" onclick="closeProductModal()">×</button>

    <div class="mw-modal-image">
      <canvas id="mwModalCanvas"></canvas>
    </div>

    <div class="mw-modal-copy">
      <p class="eyebrow">MO-WEAR / T-SHIRT</p>

      <h2>${escapeHtml(product.name)}</h2>

      <div class="mw-modal-price">
        ${money(product.price)}
      </div>

      <p class="mw-modal-desc">
        ${escapeHtml(product.desc)}
      </p>

      <label class="mw-label">COLOR</label>

      <div class="mw-modal-swatches">
        ${Object.entries(COLORS).map(([name, c]) => `
          <button
            class="mw-swatch mw-modal-swatch ${name === "Black" ? "selected" : ""}"
            title="${name}"
            aria-label="${name}"
            data-color="${name}"
            style="--swatch:${c.swatch}"
            onclick="selectModalColor(${product.id}, '${name}')">
          </button>
        `).join("")}
      </div>

      <div class="mw-selected-color" id="mwSelectedColor">
        Black
      </div>

      <label class="mw-label">SIZE</label>

      <div class="mw-size-buttons">
        ${SIZES.map((size, i) => `
          <button
            class="mw-size ${i === 0 ? "selected" : ""}"
            data-size="${size}"
            onclick="selectModalSize(this)">
            ${size}
          </button>
        `).join("")}
      </div>

      <button
        class="btn btn-red full"
        onclick="confirmModalAdd(${product.id})">
        ADD TO CART — ${money(product.price)}
      </button>
    </div>
  `;

  modal.classList.add("show");
  backdrop.classList.add("show");

  await prepareCanvas(
    document.getElementById("mwModalCanvas"),
    product,
    "Black"
  );
}

async function selectModalColor(id, color) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.querySelectorAll(".mw-modal-swatch").forEach(btn => {
    btn.classList.toggle("selected", btn.dataset.color === color);
  });

  const selected = document.getElementById("mwSelectedColor");
  if (selected) selected.textContent = color;

  const canvas = document.getElementById("mwModalCanvas");
  if (canvas) {
    await prepareCanvas(canvas, product, color);
  }
}

function selectModalSize(btn) {
  document.querySelectorAll(".mw-size").forEach(b => {
    b.classList.remove("selected");
  });

  btn.classList.add("selected");
}

function confirmModalAdd(id) {
  const color =
    document.querySelector(".mw-modal-swatch.selected")?.dataset.color ||
    "Black";

  const size =
    document.querySelector(".mw-size.selected")?.dataset.size ||
    "M";

  addToCart(id, color, size);
}

function closeProductModal() {
  document.getElementById("mwProductModal")?.classList.remove("show");
  document.getElementById("mwProductBackdrop")?.classList.remove("show");
}

function openCart() {
  document.getElementById("cartDrawer")?.classList.add("open");
  document.getElementById("drawerBackdrop")?.classList.add("show");
}

function closeCart() {
  document.getElementById("cartDrawer")?.classList.remove("open");
  document.getElementById("drawerBackdrop")?.classList.remove("show");
}

function openCheckout() {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  closeCart();

  document.getElementById("checkoutModal")?.classList.add("show");
  document.getElementById("checkoutBackdrop")?.classList.add("show");
}

function closeCheckout() {
  document.getElementById("checkoutModal")?.classList.remove("show");
  document.getElementById("checkoutBackdrop")?.classList.remove("show");
}

/* Filters */
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
    renderProducts(btn.dataset.category);
  });
});

/* Cart */
document.getElementById("openCart")?.addEventListener("click", openCart);
document.getElementById("closeCart")?.addEventListener("click", closeCart);
document.getElementById("drawerBackdrop")?.addEventListener("click", closeCart);

document.getElementById("checkoutButton")
  ?.addEventListener("click", openCheckout);

document.getElementById("clearCart")
  ?.addEventListener("click", () => {
    cart = [];
    saveCart();
  });

/* Checkout */
document.getElementById("closeCheckout")
  ?.addEventListener("click", closeCheckout);

document.getElementById("checkoutBackdrop")
  ?.addEventListener("click", closeCheckout);

/* Mobile menu */
document.getElementById("menuButton")
  ?.addEventListener("click", () => {
    document.getElementById("nav")?.classList.toggle("open");
  });

document.querySelectorAll(".nav a").forEach(a => {
  a.addEventListener("click", () => {
    document.getElementById("nav")?.classList.remove("open");
  });
});

/* Checkout form */
document.getElementById("checkoutForm")
  ?.addEventListener("submit", e => {
    e.preventDefault();

    const data = new FormData(e.target);

    const order = {
      customer: Object.fromEntries(data.entries()),
      items: cart.map(item => {
        const p = products.find(x => x.id === item.id);

        return {
          product: p?.name || "Unknown",
          color: item.color || "Black",
          size: item.size || "M",
          qty: item.qty,
          unitPrice: p?.price || 0
        };
      }),
      total: cart.reduce((sum, item) => {
        const p = products.find(x => x.id === item.id);
        return sum + (p ? p.price * item.qty : 0);
      }, 0),
      createdAt: new Date().toISOString()
    };

    console.log("MO-WEAR ORDER", order);
    localStorage.setItem("lastMoWearOrder", JSON.stringify(order));

    e.target.style.display = "none";
    document.querySelector(".modal .small")?.style.setProperty("display", "none");
    document.getElementById("orderSuccess")?.classList.add("show");

    cart = [];
    saveCart();
  });

document.getElementById("closeSuccess")
  ?.addEventListener("click", () => {
    document.getElementById("checkoutForm")?.reset();

    const form = document.getElementById("checkoutForm");
    if (form) form.style.display = "grid";

    document.querySelector(".modal .small")
      ?.style.setProperty("display", "block");

    document.getElementById("orderSuccess")
      ?.classList.remove("show");

    closeCheckout();
  });

document.getElementById("year").textContent =
  new Date().getFullYear();

/* Start */
hideOldCategories();
renderProducts();
renderCart();
