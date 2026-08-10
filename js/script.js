const products = [
    {
        id: 1,
        name: "Fire Graphic Tee",
        category: "tshirts",
        price: 400,
        desc: "Oversized black MO-WEAR graphic tee.",
        image: "images/model-1.png",
        colors: ["Black", "White", "Burgundy", "Beige"],
        sizes: ["M", "L", "XL"]
    },
    {
        id: 2,
        name: "Rose California Tee",
        category: "tshirts",
        price: 400,
        desc: "Clean cream tee with rose California graphic.",
        image: "images/model-02.png",
        colors: ["Black", "White", "Burgundy", "Beige"],
        sizes: ["M", "L", "XL"]
    },
    {
        id: 3,
        name: "Warrior Tee",
        category: "tshirts",
        price: 400,
        desc: "Black streetwear tee with warrior-inspired graphic.",
        image: "images/model-03.png",
        colors: ["Black", "White", "Burgundy", "Beige"],
        sizes: ["M", "L", "XL"]
    }
];


/* =========================================================
   MO-WEAR SETTINGS
========================================================= */

const WHATSAPP_NUMBER = "201112687108";

const TIKTOK_URL = "https://www.tiktok.com/@mowear1";


/* =========================================================
   CART
========================================================= */

let cart = JSON.parse(localStorage.getItem("moWearCart") || "[]");


/* =========================================================
   DOM ELEMENTS
========================================================= */

const productsEl = document.getElementById("products");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const cartDrawer = document.getElementById("cartDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutBackdrop = document.getElementById("checkoutBackdrop");


/* =========================================================
   HELPERS
========================================================= */

function money(value) {
    return "EGP " + Number(value || 0).toLocaleString("en-EG");
}


function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   REMOVE HOODIES / PANTS
========================================================= */

document.querySelectorAll(".filter, [data-category-link]").forEach(el => {
    const category = el.dataset.category || el.dataset.categoryLink;

    if (category === "hoodies" || category === "pants") {
        el.remove();
    }
});


/* =========================================================
   PRODUCTS
========================================================= */

function renderProducts(category = "all") {

    if (!productsEl) return;

    const list = category === "all"
        ? products
        : products.filter(p => p.category === category);

    productsEl.innerHTML = list.map(p => `
        <article class="product-card">

            <div class="product-image real-product-image">
                <img
                    src="${p.image}"
                    alt="${escapeHtml(p.name)}"
                >

                <div class="product-badge">
                    NEW
                </div>
            </div>


            <div class="product-info">

                <div class="product-name">
                    ${escapeHtml(p.name)}
                </div>


                <div class="product-meta">

                    <span class="product-category">
                        T-SHIRT
                    </span>

                    <span class="product-price">
                        ${money(p.price)}
                    </span>

                </div>


                <div class="product-options-preview">

                    <span>
                        Colors: Black · White · Burgundy · Beige
                    </span>

                    <span>
                        Sizes: M · L · XL
                    </span>

                </div>


                <div class="product-actions">

                    <button
                        class="add-btn"
                        onclick="showProduct(${p.id})"
                    >
                        ADD TO CART
                    </button>


                    <button
                        class="view-btn"
                        onclick="showProduct(${p.id})"
                    >
                        DETAILS
                    </button>

                </div>

            </div>

        </article>
    `).join("");
}


/* =========================================================
   SAVE CART
========================================================= */

function saveCart() {

    localStorage.setItem(
        "moWearCart",
        JSON.stringify(cart)
    );

    renderCart();
}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(id, color, size) {

    const existing = cart.find(
        item =>
            item.id === id &&
            item.color === color &&
            item.size === size
    );


    if (existing) {

        existing.qty++;

    } else {

        cart.push({
            id,
            color,
            size,
            qty: 1
        });

    }


    saveCart();

    closeProductModal();

    openCart();
}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQty(index, amount) {

    const item = cart[index];

    if (!item) return;


    item.qty += amount;


    if (item.qty <= 0) {

        cart.splice(index, 1);

    }


    saveCart();
}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    if (!cartItemsEl || !cartCountEl || !cartTotalEl) {
        return;
    }


    const totalQty = cart.reduce(
        (sum, item) => sum + item.qty,
        0
    );


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

        const p = products.find(
            x => x.id === item.id
        );


        if (!p) return "";


        total += p.price * item.qty;


        return `
            <div class="cart-item">

                <img
                    class="cart-product-image"
                    src="${p.image}"
                    alt="${escapeHtml(p.name)}"
                >


                <div>

                    <h3>
                        ${escapeHtml(p.name)}
                    </h3>


                    <p>
                        ${money(p.price)}
                    </p>


                    <p class="cart-variant">

                        Color:
                        ${escapeHtml(item.color || "—")}

                        ·

                        Size:
                        ${escapeHtml(item.size || "—")}

                    </p>


                    <div class="qty">

                        <button
                            onclick="changeQty(${index}, -1)"
                        >
                            −
                        </button>


                        <strong>
                            ${item.qty}
                        </strong>


                        <button
                            onclick="changeQty(${index}, 1)"
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    class="remove"
                    onclick="changeQty(${index}, -${item.qty})"
                >
                    Remove
                </button>

            </div>
        `;

    }).join("");


    cartTotalEl.textContent = money(total);
}


/* =========================================================
   PRODUCT MODAL
========================================================= */

function showProduct(id) {

    const p = products.find(
        x => x.id === id
    );


    if (!p) return;


    let modal =
        document.getElementById("productModal");


    if (!modal) {

        modal = document.createElement("div");

        modal.id = "productModal";

        modal.className =
            "modal product-modal";

        document.body.appendChild(modal);
    }


    modal.innerHTML = `

        <button
            class="modal-close"
            onclick="closeProductModal()"
        >
            ×
        </button>


        <div class="product-modal-image">

            <img
                src="${p.image}"
                alt="${escapeHtml(p.name)}"
            >

        </div>


        <div class="product-modal-copy">

            <p class="eyebrow">
                MO-WEAR / NEW DROP
            </p>


            <h2>
                ${escapeHtml(p.name)}
            </h2>


            <div class="product-modal-price">
                ${money(p.price)}
            </div>


            <p class="product-modal-desc">
                ${escapeHtml(p.desc)}
            </p>


            <label class="variant-label">
                COLOR
            </label>


            <div
                class="variant-buttons"
                id="colorOptions"
            >

                ${p.colors.map((color, i) => `

                    <button
                        type="button"
                        class="variant-btn ${i === 0 ? "selected" : ""}"
                        data-color="${escapeHtml(color)}"
                        onclick="selectVariant(this, 'colorOptions')"
                    >
                        ${escapeHtml(color)}
                    </button>

                `).join("")}

            </div>


            <label class="variant-label">
                SIZE
            </label>


            <div
                class="variant-buttons"
                id="sizeOptions"
            >

                ${p.sizes.map((size, i) => `

                    <button
                        type="button"
                        class="variant-btn ${i === 0 ? "selected" : ""}"
                        data-size="${escapeHtml(size)}"
                        onclick="selectVariant(this, 'sizeOptions')"
                    >
                        ${escapeHtml(size)}
                    </button>

                `).join("")}

            </div>


            <button
                class="btn btn-red full product-add-confirm"
                onclick="confirmAddToCart(${p.id})"
            >
                ADD TO CART — ${money(p.price)}
            </button>

        </div>
    `;


    modal.classList.add("show");


    let backdrop =
        document.getElementById("productBackdrop");


    if (!backdrop) {

        backdrop = document.createElement("div");

        backdrop.id =
            "productBackdrop";

        backdrop.className =
            "modal-backdrop";

        backdrop.addEventListener(
            "click",
            closeProductModal
        );

        document.body.appendChild(backdrop);
    }


    backdrop.classList.add("show");
}


/* =========================================================
   SELECT VARIANT
========================================================= */

function selectVariant(button, groupId) {

    document
        .querySelectorAll(
            `#${groupId} .variant-btn`
        )
        .forEach(btn =>
            btn.classList.remove("selected")
        );


    button.classList.add("selected");
}


/* =========================================================
   CONFIRM ADD TO CART
========================================================= */

function confirmAddToCart(id) {

    const colorButton =
        document.querySelector(
            "#colorOptions .variant-btn.selected"
        );


    const sizeButton =
        document.querySelector(
            "#sizeOptions .variant-btn.selected"
        );


    if (!colorButton || !sizeButton) {
        return;
    }


    addToCart(
        id,
        colorButton.dataset.color,
        sizeButton.dataset.size
    );
}


/* =========================================================
   CLOSE PRODUCT MODAL
========================================================= */

function closeProductModal() {

    const modal =
        document.getElementById("productModal");


    const backdrop =
        document.getElementById("productBackdrop");


    if (modal) {
        modal.classList.remove("show");
    }


    if (backdrop) {
        backdrop.classList.remove("show");
    }
}


/* =========================================================
   CART DRAWER
========================================================= */

function openCart() {

    if (!cartDrawer || !drawerBackdrop) {
        return;
    }


    cartDrawer.classList.add("open");

    drawerBackdrop.classList.add("show");
}


function closeCart() {

    if (!cartDrawer || !drawerBackdrop) {
        return;
    }


    cartDrawer.classList.remove("open");

    drawerBackdrop.classList.remove("show");
}


/* =========================================================
   CHECKOUT
========================================================= */

function openCheckout() {

    if (!cart.length) {

        alert("Your cart is empty.");

        return;
    }


    closeCart();


    if (checkoutModal) {
        checkoutModal.classList.add("show");
    }


    if (checkoutBackdrop) {
        checkoutBackdrop.classList.add("show");
    }
}


function closeCheckout() {

    if (checkoutModal) {
        checkoutModal.classList.remove("show");
    }


    if (checkoutBackdrop) {
        checkoutBackdrop.classList.remove("show");
    }
}


/* =========================================================
   WHATSAPP ORDER MESSAGE
========================================================= */

function sendOrderToWhatsApp(order) {

    const customer =
        order.customer || {};


    let message = "";

    message += "🛍️ *NEW MO-WEAR ORDER*";
    message += "\n";
    message += "━━━━━━━━━━━━━━━━━━";
    message += "\n\n";


    message += "👤 *CUSTOMER DETAILS*";
    message += "\n";


    const customerEntries =
        Object.entries(customer);


    if (customerEntries.length) {

        customerEntries.forEach(
            ([key, value]) => {

                if (
                    value !== undefined &&
                    value !== null &&
                    String(value).trim() !== ""
                ) {

                    message +=
                        `• ${key}: ${value}\n`;
                }

            }
        );

    }


    message += "\n";
    message += "🛒 *ORDER ITEMS*";
    message += "\n";
    message += "━━━━━━━━━━━━━━━━━━";
    message += "\n";


    order.items.forEach(
        (item, index) => {

            message +=
                `\n${index + 1}. *${item.product}*`;

            message +=
                `\n   Color: ${item.color}`;

            message +=
                `\n   Size: ${item.size}`;

            message +=
                `\n   Quantity: ${item.qty}`;

            message +=
                `\n   Price: ${money(item.unitPrice)}`;

            message += "\n";
        }
    );


    message += "\n";
    message += "━━━━━━━━━━━━━━━━━━";
    message += "\n";


    message +=
        `💰 *TOTAL: ${money(order.total)}*`;


    message += "\n\n";

    message +=
        "Thank you for ordering from MO-WEAR ❤️";


    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


    /*
     * فتح واتساب في تاب جديدة.
     * لأن العملية تحدث مباشرة بعد Submit
     * فالمتصفح يسمح بفتح الرابط.
     */

    window.open(
        whatsappURL,
        "_blank"
    );
}


/* =========================================================
   FILTERS
========================================================= */

document
    .querySelectorAll(".filter")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".filter")
                    .forEach(b =>
                        b.classList.remove("active")
                    );


                btn.classList.add("active");


                renderProducts(
                    btn.dataset.category
                );

            }
        );

    });


/* =========================================================
   CATEGORY LINKS
========================================================= */

document
    .querySelectorAll("[data-category-link]")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            () => {

                const category =
                    btn.dataset.categoryLink;


                const shop =
                    document.querySelector("#shop");


                if (shop) {

                    shop.scrollIntoView({
                        behavior: "smooth"
                    });

                }


                setTimeout(
                    () => {

                        document
                            .querySelectorAll(".filter")
                            .forEach(b => {

                                b.classList.toggle(
                                    "active",
                                    b.dataset.category === category
                                );

                            });


                        renderProducts(category);

                    },
                    250
                );

            }
        );

    });


/* =========================================================
   CART BUTTONS
========================================================= */

const openCartButton =
    document.getElementById("openCart");


if (openCartButton) {

    openCartButton.addEventListener(
        "click",
        openCart
    );

}


const closeCartButton =
    document.getElementById("closeCart");


if (closeCartButton) {

    closeCartButton.addEventListener(
        "click",
        closeCart
    );

}


if (drawerBackdrop) {

    drawerBackdrop.addEventListener(
        "click",
        closeCart
    );

}


/* =========================================================
   CHECKOUT BUTTON
========================================================= */

const checkoutButton =
    document.getElementById("checkoutButton");


if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        openCheckout
    );

}


/* =========================================================
   CLEAR CART
========================================================= */

const clearCartButton =
    document.getElementById("clearCart");


if (clearCartButton) {

    clearCartButton.addEventListener(
        "click",
        () => {

            cart = [];

            saveCart();

        }
    );

}


/* =========================================================
   CLOSE CHECKOUT
========================================================= */

const closeCheckoutButton =
    document.getElementById("closeCheckout");


if (closeCheckoutButton) {

    closeCheckoutButton.addEventListener(
        "click",
        closeCheckout
    );

}


if (checkoutBackdrop) {

    checkoutBackdrop.addEventListener(
        "click",
        closeCheckout
    );

}


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton =
    document.getElementById("menuButton");


if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            const nav =
                document.getElementById("nav");


            if (nav) {
                nav.classList.toggle("open");
            }

        }
    );

}


document
    .querySelectorAll(".nav a")
    .forEach(a => {

        a.addEventListener(
            "click",
            () => {

                const nav =
                    document.getElementById("nav");


                if (nav) {
                    nav.classList.remove("open");
                }

            }
        );

    });


/* =========================================================
   CHECKOUT FORM
========================================================= */

const checkoutForm =
    document.getElementById("checkoutForm");


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        (e) => {

            e.preventDefault();


            const data =
                new FormData(e.target);


            /*
             * إنشاء الطلب
             */

            const order = {

                customer:
                    Object.fromEntries(
                        data.entries()
                    ),


                items:
                    cart.map(item => {

                        const p =
                            products.find(
                                p => p.id === item.id
                            );


                        return {

                            product:
                                p
                                    ? p.name
                                    : "Unknown",

                            color:
                                item.color || "—",

                            size:
                                item.size || "—",

                            qty:
                                item.qty,

                            unitPrice:
                                p
                                    ? p.price
                                    : 0

                        };

                    }),


                total:
                    cart.reduce(
                        (sum, item) => {

                            const p =
                                products.find(
                                    p => p.id === item.id
                                );


                            return sum +
                                (
                                    p
                                        ? p.price * item.qty
                                        : 0
                                );

                        },
                        0
                    ),


                createdAt:
                    new Date().toISOString()

            };


            /*
             * حفظ آخر طلب
             */

            console.log(
                "MO-WEAR ORDER",
                order
            );


            localStorage.setItem(
                "lastMoWearOrder",
                JSON.stringify(order)
            );


            /*
             * إرسال الطلب إلى WhatsApp
             */

            sendOrderToWhatsApp(order);


            /*
             * إظهار نجاح الطلب
             */

            e.target.style.display =
                "none";


            const smallText =
                document.querySelector(
                    ".modal .small"
                );


            if (smallText) {
                smallText.style.display =
                    "none";
            }


            const orderSuccess =
                document.getElementById(
                    "orderSuccess"
                );


            if (orderSuccess) {
                orderSuccess.classList.add("show");
            }


            /*
             * تفريغ السلة
             */

            cart = [];

            saveCart();

        }
    );

}


/* =========================================================
   CLOSE SUCCESS
========================================================= */

const closeSuccessButton =
    document.getElementById("closeSuccess");


if (closeSuccessButton) {

    closeSuccessButton.addEventListener(
        "click",
        () => {

            if (checkoutForm) {

                checkoutForm.reset();

                checkoutForm.style.display =
                    "grid";

            }


            const smallText =
                document.querySelector(
                    ".modal .small"
                );


            if (smallText) {
                smallText.style.display =
                    "block";
            }


            const orderSuccess =
                document.getElementById(
                    "orderSuccess"
                );


            if (orderSuccess) {
                orderSuccess.classList.remove(
                    "show"
                );
            }


            closeCheckout();

        }
    );

}


/* =========================================================
   YEAR
========================================================= */

const yearElement =
    document.getElementById("year");


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   INIT
========================================================= */

renderProducts();

renderCart();
