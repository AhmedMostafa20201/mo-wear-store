const products = [  let currentLanguage = "en";
    

    {
        id: 1,
        name: "Fire Graphic Tee",
        category: "tshirts",
        price: 400,
        desc: "Oversized black MO-WEAR graphic tee.",
        image: "images/model-02.png",

        colors: ["Black", "White", "Burgundy", "Beige"],

        colorImages: {
            White: "images/model-02-white.png",
            Black: "images/model-02.png",
            Burgundy: "images/model-02-burgundy.png",
            Beige: "images/model-02-beige.png"
        },

        sizes: ["M", "L", "XL", "2XL", "3XL"]
    },

    {
        id: 2,
        name: "Rose California Tee",
        category: "tshirts",
        price: 400,
        desc: "Clean cream tee with rose California graphic.",
        image: "images/model-1.png",

        colors: ["Black", "White", "Burgundy", "Beige"],

        colorImages: {
            White: "images/model-1-white.png",
            Black: "images/model-1-black.png",
            Burgundy: "images/model-1-burgundy.png",
            Beige: "images/model-1.png"
        },

        sizes: ["M", "L", "XL", "2XL", "3XL"]
    },

    {
        id: 3,
        name: "Warrior Tee",
        category: "tshirts",
        price: 400,
        desc: "Black streetwear tee with warrior-inspired graphic.",
        image: "images/model-03.png",

        colors: ["Black", "White", "Burgundy", "Beige"],

        colorImages: {
            Black: "images/model-03.png",
            White: "images/model-03-white.png",
            Burgundy: "images/model-03-burgundy.png",
            Beige: "images/model-03-beige.png"
        },

        sizes: ["M", "L", "XL", "2XL", "3XL"]
    },

    {
        id: 4,
        name: "Future",
        category: "tshirts",
        price: 400,
        desc: "White streetwear tee with Future graphic.",
        image: "images/model-05.png",

        colors: ["White", "Black"],

        colorImages: {
            White: "images/model-05.png",
            Black: "images/model-05-black.png"
        },

        sizes: ["M", "L", "XL", "2XL", "3XL"]
    },

    {
        id: 5,
        name: "Courage Tee",
        category: "tshirts",
        price: 400,
        desc: "Oversized deep forest green tee with Courage chest graphic.",
        image: "images/model-04.png",

        colors: ["Deep Forest Green"],

        colorImages: {
            "Deep Forest Green": "images/model-04.png"
        },

        sizes: ["M", "L", "XL", "2XL", "3XL"]
    },

    {
        id: 6,
        name: "Basic White",
        category: "basic",
        price: 250,
        desc: "Clean slim basic white tee.",
        image: "images/Basic-01.png",

        colors: ["White"],

        colorImages: {
            White: "images/Basic-01.png"
        },

        sizes: ["M", "L", "XL", "2XL", "3XL"]
    },

    {
        id: 7,
        name: "Basic Black",
        category: "basic",
        price: 250,
        desc: "Clean slim basic black tee.",
        image: "images/Basic-02.png",

        colors: ["Black"],

        colorImages: {
            Black: "images/Basic-02.png"
        },

        sizes: ["M", "L", "XL", "2XL", "3XL"]
    },

    {
        id: 8,
        name: "Basic Burgundy",
        category: "basic",
        price: 250,
        desc: "Clean slim basic burgundy tee.",
        image: "images/Basic-03.png",

        colors: ["Burgundy"],

        colorImages: {
            Burgundy: "images/Basic-03.png"
        },

        sizes: ["M", "L", "XL", "2XL", "3XL"]
    }

];


// ======================================================
// CART
// ======================================================

let cart = JSON.parse(
    localStorage.getItem("moWearCart") || "[]"
);


// ======================================================
// ELEMENTS
// ======================================================

const productsEl = document.getElementById("products");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");

const cartDrawer = document.getElementById("cartDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");

const checkoutModal = document.getElementById("checkoutModal");
const checkoutBackdrop = document.getElementById("checkoutBackdrop");


// ======================================================
// LANGUAGE
// ======================================================

function isArabic() {

    return (
        document.documentElement.lang &&
        document.documentElement.lang.toLowerCase().startsWith("ar")
    );

}


function t(key) {

    const ar = isArabic();

    const translations = {

        new: {
            en: "NEW",
            ar: "جديد"
        },

        tshirt: {
            en: "T-SHIRT",
            ar: "تيشيرت"
        },

        colors: {
            en: "Colors",
            ar: "الألوان"
        },

        sizes: {
            en: "Sizes",
            ar: "المقاسات"
        },

        details: {
            en: "DETAILS",
            ar: "التفاصيل"
        },

        addToCart: {
            en: "ADD TO CART",
            ar: "أضف للسلة"
        },

        color: {
            en: "COLOR",
            ar: "اللون"
        },

        size: {
            en: "SIZE",
            ar: "المقاس"
        },

        moWearNewDrop: {
            en: "MO-WEAR / NEW DROP",
            ar: "MO-WEAR / إصدار جديد"
        },

        close: {
            en: "Close",
            ar: "إغلاق"
        },

        remove: {
            en: "Remove",
            ar: "حذف"
        },

        cartEmpty: {
            en: "YOUR CART IS EMPTY.",
            ar: "السلة فارغة."
        },

        addSomething: {
            en: "ADD SOMETHING YOU LIKE.",
            ar: "أضف شيئًا يعجبك."
        },

        cartColor: {
            en: "Color",
            ar: "اللون"
        },

        cartSize: {
            en: "Size",
            ar: "المقاس"
        },

        checkout: {
            en: "CHECKOUT",
            ar: "إتمام الطلب"
        }

    };

    if (!translations[key]) {
        return key;
    }

    return ar
        ? translations[key].ar
        : translations[key].en;

}


// ======================================================
// COLOR TRANSLATION
// ======================================================

function translateColor(color) {

    if (!isArabic()) {
        return color;
    }

    const colors = {

        "Black": "أسود",

        "White": "أبيض",

        "Burgundy": "نبيتي",

        "Beige": "بيج",

        "Deep Forest Green": "أخضر غابة داكن"

    };

    return colors[color] || color;
}


// ======================================================
// MONEY
// ======================================================

function money(value) {

    if (isArabic()) {
        return value.toLocaleString("ar-EG") + " جنيه";
    }

    return "EGP " + value.toLocaleString("en-EG");
}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ======================================================
// REMOVE HOODIES / PANTS
// ======================================================

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


// ======================================================
// RENDER PRODUCTS
// ======================================================

function renderProducts(category = "all") {

    const list = category === "all"
        ? products
        : products.filter(p => p.category === category);

    const isArabic = currentLanguage === "ar";

    productsEl.innerHTML = list.map(p => `

        <article class="product-card">

            <div class="product-image real-product-image">
                <img
                    src="${p.image}"
                    alt="${escapeHtml(p.name)}"
                >

                <div class="product-badge">
                    ${isArabic ? "جديد" : "NEW"}
                </div>
            </div>

            <div class="product-info">

                <div class="product-name">
                    ${escapeHtml(p.name)}
                </div>

                <div class="product-meta">

                    <span class="product-category">
                        ${isArabic ? "تيشيرت" : "T-SHIRT"}
                    </span>

                    <span class="product-price">
                        ${money(p.price)}
                    </span>

                </div>

                <div class="product-options-preview">

                    <span>
                        ${isArabic ? "الألوان" : "Colors"}:
                        ${p.colors.join(" · ")}
                    </span>

                    <span>
                        ${isArabic ? "المقاسات" : "Sizes"}:
                        ${p.sizes.join(" · ")}
                    </span>

                </div>

                <div class="product-actions">

                    <button
                        class="add-btn"
                        onclick="showProduct(${p.id})"
                    >
                        ${isArabic ? "أضف للسلة" : "ADD TO CART"}
                    </button>

                    <button
                        class="view-btn"
                        onclick="showProduct(${p.id})"
                    >
                        ${isArabic ? "التفاصيل" : "DETAILS"}
                    </button>

                </div>

            </div>

        </article>

    `).join("");
}


// ======================================================
// SAVE CART
// ======================================================

function saveCart() {

    localStorage.setItem(
        "moWearCart",
        JSON.stringify(cart)
    );

    renderCart();

}


// ======================================================
// ADD TO CART
// ======================================================

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


// ======================================================
// CHANGE QUANTITY
// ======================================================

function changeQty(index, amount) {

    const item = cart[index];

    if (!item) return;


    item.qty += amount;


    if (item.qty <= 0) {

        cart.splice(index, 1);

    }


    saveCart();

}


// ======================================================
// RENDER CART
// ======================================================

function renderCart() {

    if (!cartItemsEl) return;


    const totalQty = cart.reduce(
        (sum, item) =>
            sum + item.qty,
        0
    );


    if (cartCountEl) {

        cartCountEl.textContent =
            totalQty;

    }


    if (!cart.length) {

        cartItemsEl.innerHTML = `

            <div class="empty-cart">

                ${t("cartEmpty")}

                <br><br>

                ${t("addSomething")}

            </div>

        `;


        if (cartTotalEl) {

            cartTotalEl.textContent =
                money(0);

        }

        return;

    }


    let total = 0;


    cartItemsEl.innerHTML = cart.map(
        (item, index) => {

            const p =
                products.find(
                    x => x.id === item.id
                );


            if (!p) return "";


            total +=
                p.price *
                item.qty;


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

                        ${t("cartColor")}:
                        ${translateColor(item.color)}

                        ·

                        ${t("cartSize")}:
                        ${escapeHtml(item.size || "—")}

                    </p>


                    <div class="qty">

                        <button
                            onclick="changeQty(${index}, -1)">
                            −
                        </button>


                        <strong>
                            ${item.qty}
                        </strong>


                        <button
                            onclick="changeQty(${index}, 1)">
                            +
                        </button>

                    </div>

                </div>


                <button
                    class="remove"
                    onclick="changeQty(${index}, -${item.qty})">

                    ${t("remove")}

                </button>

            </div>

            `;

        }
    ).join("");


    if (cartTotalEl) {

        cartTotalEl.textContent =
            money(total);

    }

}


// ======================================================
// SHOW PRODUCT
// ======================================================

function showProduct(id) {

    const p =
        products.find(
            x => x.id === id
        );


    if (!p) return;


    let modal =
        document.getElementById(
            "productModal"
        );


    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "productModal";

        modal.className =
            "modal product-modal";

        document.body.appendChild(
            modal
        );

    }


    modal.innerHTML = `

        <button
            class="modal-close"
            onclick="closeProductModal()"
            aria-label="${t("close")}">

            ×

        </button>


        <div class="product-modal-image">

            <img
                id="productModalImage"
                src="${p.image}"
                alt="${escapeHtml(p.name)}"
            >

        </div>


        <div class="product-modal-copy">

            <p class="eyebrow">
                ${t("moWearNewDrop")}
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
                ${t("color")}
            </label>


            <div
                class="variant-buttons"
                id="colorOptions">

                ${p.colors.map(
                    (color, i) => `

                    <button
                        type="button"
                        class="variant-btn ${
                            i === 0
                                ? "selected"
                                : ""
                        }"
                        data-color="${escapeHtml(color)}"
                        onclick="
                            selectVariant(
                                this,
                                'colorOptions'
                            );
                            changeProductColor(
                                ${p.id},
                                '${escapeHtml(color)}'
                            );
                        ">

                        ${translateColor(color)}

                    </button>

                `
                ).join("")}

            </div>


            <label class="variant-label">
                ${t("size")}
            </label>


            <div
                class="variant-buttons"
                id="sizeOptions">

                ${p.sizes.map(
                    (size, i) => `

                    <button
                        type="button"
                        class="variant-btn ${
                            i === 0
                                ? "selected"
                                : ""
                        }"
                        data-size="${escapeHtml(size)}"
                        onclick="
                            selectVariant(
                                this,
                                'sizeOptions'
                            );
                        ">

                        ${escapeHtml(size)}

                    </button>

                `
                ).join("")}

            </div>


            <button
                class="btn btn-red full product-add-confirm"
                onclick="
                    confirmAddToCart(${p.id})
                ">

                ${t("addToCart")}
                — ${money(p.price)}

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
            document.createElement(
                "div"
            );

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


// ======================================================
// CHANGE PRODUCT COLOR IMAGE
// ======================================================

function changeProductColor(
    id,
    color
) {

    const p =
        products.find(
            x => x.id === id
        );


    const modalImage =
        document.getElementById(
            "productModalImage"
        );


    if (!p || !modalImage) return;


    if (
        p.colorImages &&
        p.colorImages[color]
    ) {

        modalImage.src =
            p.colorImages[color];

    } else {

        modalImage.src =
            p.image;

    }

}


// ======================================================
// SELECT VARIANT
// ======================================================

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


// ======================================================
// CONFIRM ADD TO CART
// ======================================================

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


// ======================================================
// CLOSE PRODUCT MODAL
// ======================================================

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


// ======================================================
// CART DRAWER
// ======================================================

function openCart() {

    if (cartDrawer) {

        cartDrawer.classList.add(
            "open"
        );

    }


    if (drawerBackdrop) {

        drawerBackdrop.classList.add(
            "show"
        );

    }

}


function closeCart() {

    if (cartDrawer) {

        cartDrawer.classList.remove(
            "open"
        );

    }


    if (drawerBackdrop) {

        drawerBackdrop.classList.remove(
            "show"
        );

    }

}


// ======================================================
// CHECKOUT
// ======================================================

function openCheckout() {

    if (!cart.length) {

        alert(
            isArabic()
                ? "السلة فارغة."
                : "Your cart is empty."
        );

        return;

    }


    closeCart();


    if (checkoutModal) {

        checkoutModal.classList.add(
            "show"
        );

    }


    if (checkoutBackdrop) {

        checkoutBackdrop.classList.add(
            "show"
        );

    }

}


function closeCheckout() {

    if (checkoutModal) {

        checkoutModal.classList.remove(
            "show"
        );

    }


    if (checkoutBackdrop) {

        checkoutBackdrop.classList.remove(
            "show"
        );

    }

}


// ======================================================
// FILTERS
// ======================================================

document
    .querySelectorAll(".filter")
    .forEach(btn => {

        btn.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter"
                    )
                    .forEach(b =>
                        b.classList.remove(
                            "active"
                        )
                    );


                btn.classList.add(
                    "active"
                );


                renderProducts(
                    btn.dataset.category
                );

            }
        );

    });


// ======================================================
// CATEGORY LINKS
// ======================================================

document
    .querySelectorAll(
        "[data-category-link]"
    )
    .forEach(btn => {

        btn.addEventListener(
            "click",
            () => {

                const category =
                    btn.dataset.categoryLink;


                const shop =
                    document.querySelector(
                        "#shop"
                    );


                if (shop) {

                    shop.scrollIntoView({
                        behavior:
                            "smooth"
                    });

                }


                setTimeout(
                    () => {

                        document
                            .querySelectorAll(
                                ".filter"
                            )
                            .forEach(b => {

                                b.classList.toggle(
                                    "active",
                                    b.dataset.category ===
                                    category
                                );

                            });


                        renderProducts(
                            category
                        );

                    },
                    250
                );

            }
        );

    });


// ======================================================
// OPEN CART BUTTON
// ======================================================

const openCartButton =
    document.getElementById(
        "openCart"
    );


if (openCartButton) {

    openCartButton.addEventListener(
        "click",
        openCart
    );

}


// ======================================================
// CLOSE CART BUTTON
// ======================================================

const closeCartButton =
    document.getElementById(
        "closeCart"
    );


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


// ======================================================
// CHECKOUT BUTTON
// ======================================================

const checkoutButton =
    document.getElementById(
        "checkoutButton"
    );


if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        openCheckout
    );

}


// ======================================================
// CLEAR CART
// ======================================================

const clearCartButton =
    document.getElementById(
        "clearCart"
    );


if (clearCartButton) {

    clearCartButton.addEventListener(
        "click",
        () => {

            cart = [];

            saveCart();

        }
    );

}


// ======================================================
// CLOSE CHECKOUT
// ======================================================

const closeCheckoutButton =
    document.getElementById(
        "closeCheckout"
    );


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


// ======================================================
// MOBILE MENU
// ======================================================

const menuButton =
    document.getElementById(
        "menuButton"
    );


if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            const nav =
                document.getElementById(
                    "nav"
                );


            if (nav) {

                nav.classList.toggle(
                    "open"
                );

            }

        }
    );

}


// ======================================================
// CLOSE MOBILE MENU
// ======================================================

document
    .querySelectorAll(
        ".nav a"
    )
    .forEach(a => {

        a.addEventListener(
            "click",
            () => {

                const nav =
                    document.getElementById(
                        "nav"
                    );


                if (nav) {

                    nav.classList.remove(
                        "open"
                    );

                }

            }
        );

    });


// ======================================================
// CHECKOUT FORM
// ======================================================

const checkoutForm =
    document.getElementById(
        "checkoutForm"
    );


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        (e) => {

            e.preventDefault();


            const data =
                new FormData(
                    e.target
                );


            const order = {

                customer:
                    Object.fromEntries(
                        data.entries()
                    ),


                items:
                    cart.map(item => {

                        const p =
                            products.find(
                                p =>
                                    p.id ===
                                    item.id
                            );


                        return {

                            product:
                                p
                                    ? p.name
                                    : "Unknown",

                            color:
                                item.color ||
                                "—",

                            size:
                                item.size ||
                                "—",

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
                                    p =>
                                        p.id ===
                                        item.id
                                );


                            return sum +
                                (
                                    p
                                        ? p.price *
                                          item.qty
                                        : 0
                                );

                        },
                        0
                    ),


                createdAt:
                    new Date()
                        .toISOString()

            };


            console.log(
                "MO-WEAR ORDER",
                order
            );


            localStorage.setItem(
                "lastMoWearOrder",
                JSON.stringify(
                    order
                )
            );


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

                orderSuccess.classList.add(
                    "show"
                );

            }


            cart = [];

            saveCart();

        }
    );

}


// ======================================================
// CLOSE SUCCESS
// ======================================================

const closeSuccessButton =
    document.getElementById(
        "closeSuccess"
    );


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


// ======================================================
// YEAR
// ======================================================

const yearElement =
    document.getElementById(
        "year"
    );


if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}


// ======================================================
// LANGUAGE CHANGE OBSERVER
// ======================================================
//
// ده الجزء المهم جدًا:
// لما زر EN / AR يغير <html lang="en">
// إلى <html lang="ar">
// الكود ده يعيد رسم المنتجات تلقائيًا.
//

const languageObserver =
    new MutationObserver(
        () => {

            renderProducts();

            renderCart();

        }
    );


languageObserver.observe(
    document.documentElement,
    {
        attributes: true,

        attributeFilter: [
            "lang"
        ]
    }
);


// ======================================================
// INITIAL RENDER
// ======================================================

renderProducts();

renderCart();
