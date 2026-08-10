const products = [
    {
        id: 1,
        name: "Rose California Tee",
        category: "tshirts",
        price: 400,
        desc: "Clean cream tee with rose California graphic.",
        image: "images/model-1.png",
        colors: ["Black", "White", "Burgundy", "Beige"],
        sizes: ["M", "L", "XL"]
    },

    {
        id: 2,
        name: "Fire Graphic Tee",
        category: "tshirts",
        price: 400,
        desc: "Oversized black MO-WEAR graphic tee.",
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
    },


    {
        id: 4,
        name: "Basic White ",
        category: "basic",
        price: 400,
        desc: "Clean slim basic",
        image: "images/basic-01.png",
        colors: ["White"],
        sizes: ["M", "L", "XL"]
    },

    

let cart = JSON.parse(
    localStorage.getItem("moWearCart") || "[]"
);

const productsEl = document.getElementById("products");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const cartDrawer = document.getElementById("cartDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const checkoutModal = document.getElementById("checkoutModal");
const checkoutBackdrop = document.getElementById("checkoutBackdrop");

function money(value) {
    return "EGP " + Number(value).toLocaleString("en-EG");
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* Remove HOODIES and PANTS */
document
    .querySelectorAll(".filter, [data-category-link]")
    .forEach(el => {

        const category =
            el.dataset.category ||
            el.dataset.categoryLink;

        if (
            category === "hoodies" ||
            category === "pants"
        ) {
            el.remove();
        }
    });

function renderProducts(category = "all") {

    if (!productsEl) return;

    const list =
        category === "all"
            ? products
            : products.filter(
                p => p.category === category
            );

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
                        ${
                            p.category === "basic"
                                ? "BASIC"
                                : "T-SHIRT"
                        }
                    </span>

                    <span class="product-price">
                        ${money(p.price)}
                    </span>

                </div>

                <div class="product-options-preview">

                    <span>
                        Colors:
                        ${p.colors
                            .map(escapeHtml)
                            .join(" · ")}
                    </span>

                    <span>
                        Sizes:
                        ${p.sizes
                            .map(escapeHtml)
                            .join(" · ")}
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
function saveCart() {
    localStorage.setItem(
        "moWearCart",
        JSON.stringify(cart)
    );

    renderCart();
}


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
            id: id,
            color: color,
            size: size,
            qty: 1
        });

    }

    saveCart();

    closeProductModal();

    openCart();
}


function changeQty(index, amount) {

    const item = cart[index];

    if (!item) return;

    item.qty += amount;

    if (item.qty <= 0) {

        cart.splice(index, 1);

    }

    saveCart();
}


function renderCart() {

    if (
        !cartItemsEl ||
        !cartCountEl ||
        !cartTotalEl
    ) {
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
                YOUR CART IS EMPTY.
                <br><br>
                ADD SOMETHING YOU LIKE.
            </div>
        `;

        cartTotalEl.textContent = money(0);

        return;
    }


    let total = 0;


    cartItemsEl.innerHTML = cart.map(
        (item, index) => {

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
                            ${escapeHtml(
                                item.color || "—"
                            )}
                            ·
                            Size:
                            ${escapeHtml(
                                item.size || "—"
                            )}
                        </p>


                        <div class="qty">

                            <button
                                onclick="changeQty(
                                    ${index},
                                    -1
                                )"
                            >
                                −
                            </button>

                            <strong>
                                ${item.qty}
                            </strong>

                            <button
                                onclick="changeQty(
                                    ${index},
                                    1
                                )"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        class="remove"
                        onclick="changeQty(
                            ${index},
                            -${item.qty}
                        )"
                    >
                        Remove
                    </button>

                </div>
            `;
        }
    ).join("");


    cartTotalEl.textContent = money(total);
}



function showProduct(id) {

    const p = products.find(
        x => x.id === id
    );

    if (!p) return;


    let modal =
        document.getElementById(
            "productModal"
        );


    if (!modal) {

        modal =
            document.createElement("div");

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

                ${p.colors.map(
                    (color, i) => `
                        <button
                            type="button"
                            class="variant-btn ${
                                i === 0
                                    ? "selected"
                                    : ""
                            }"
                            data-color="${escapeHtml(
                                color
                            )}"
                            onclick="selectVariant(
                                this,
                                'colorOptions'
                            )"
                        >
                            ${escapeHtml(color)}
                        </button>
                    `
                ).join("")}

            </div>


            <label class="variant-label">
                SIZE
            </label>


            <div
                class="variant-buttons"
                id="sizeOptions"
            >

                ${p.sizes.map(
                    (size, i) => `
                        <button
                            type="button"
                            class="variant-btn ${
                                i === 0
                                    ? "selected"
                                    : ""
                            }"
                            data-size="${escapeHtml(
                                size
                            )}"
                            onclick="selectVariant(
                                this,
                                'sizeOptions'
                            )"
                        >
                            ${escapeHtml(size)}
                        </button>
                    `
                ).join("")}

            </div>


            <button
                class="btn btn-red full product-add-confirm"
                onclick="confirmAddToCart(${p.id})"
            >
                ADD TO CART —
                ${money(p.price)}
            </button>

        </div>

    `;


    modal.classList.add("show");


    let backdrop =
        document.getElementById(
            "productBackdrop"
        );


    if (!backdrop) {

        backdrop =
            document.createElement("div");

        backdrop.id =
            "productBackdrop";

        backdrop.className =
            "modal-backdrop";


        backdrop.addEventListener(
            "click",
            closeProductModal
        );


        document.body.appendChild(
            backdrop
        );

    }


    backdrop.classList.add("show");
}



function selectVariant(
    button,
    groupId
) {

    document
        .querySelectorAll(
            `#${groupId} .variant-btn`
        )
        .forEach(btn => {

            btn.classList.remove(
                "selected"
            );

        });


    button.classList.add(
        "selected"
    );
}



function confirmAddToCart(id) {

    const colorButton =
        document.querySelector(
            "#colorOptions .variant-btn.selected"
        );


    const sizeButton =
        document.querySelector(
            "#sizeOptions .variant-btn.selected"
        );


    if (
        !colorButton ||
        !sizeButton
    ) {
        return;
    }


    addToCart(
        id,
        colorButton.dataset.color,
        sizeButton.dataset.size
    );
}



function closeProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    const backdrop =
        document.getElementById(
            "productBackdrop"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    if (backdrop) {

        backdrop.classList.remove(
            "show"
        );

    }
}
