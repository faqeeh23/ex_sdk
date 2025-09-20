// ----- Data (sample products) -----
const products = [
    { id: 1,  title: "Noise-Canceling Headphones", category: "electronics", price: 129.99, img: "https://picsum.photos/seed/1/600/400" },
    { id: 2,  title: "Smartwatch Pro",             category: "electronics", price: 199.00, img: "https://picsum.photos/seed/2/600/400" },
    { id: 3,  title: "Bestseller Novel",           category: "books",       price: 14.50,  img: "https://picsum.photos/seed/3/600/400" },
    { id: 4,  title: "Cookbook Deluxe",            category: "books",       price: 21.00,  img: "https://picsum.photos/seed/4/600/400" },
    { id: 5,  title: "Casual T-Shirt",             category: "clothing",    price: 18.99,  img: "https://picsum.photos/seed/5/600/400" },
    { id: 6,  title: "Denim Jacket",               category: "clothing",    price: 59.99,  img: "https://picsum.photos/seed/6/600/400" },
    { id: 7,  title: "Bluetooth Speaker",          category: "electronics", price: 45.00,  img: "https://picsum.photos/seed/7/600/400" },
    { id: 8,  title: "Sci-Fi Anthology",           category: "books",       price: 12.00,  img: "https://picsum.photos/seed/8/600/400" },
    { id: 9,  title: "Running Shoes",              category: "clothing",    price: 89.00,  img: "https://picsum.photos/seed/9/600/400" },
];

// ----- Elements -----
const cardsEl     = document.getElementById("cards");
const viewportEl  = document.getElementById("viewport");
const prevEl      = document.getElementById("prev");
const nextEl      = document.getElementById("next");
const searchEl    = document.getElementById("searchBox");
const filterBtns  = Array.from(document.querySelectorAll(".filter"));
const outputEl    = document.getElementById("output");
const themeBtn    = document.getElementById("btn_theme");

// Newsletter
const newsForm = document.getElementById("newsletterForm");
const newsEmail = document.getElementById("email");
const newsMsg = document.getElementById("msg");

// ----- State -----
let activeCategory = "all";
let query = "";

// ----- Render cards -----
function render(list) {
    if (!list.length) {
        cardsEl.innerHTML = `<div class="empty">No results. Try another search or category.</div>`;
        return;
    }
    cardsEl.innerHTML = list.map(p => `
    <article class="card">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
        <div class="info">
                <div class="title">${p.title}</div>
                <div class="meta">
                <span>${capitalize(p.category)}</span>
                <span>$${p.price.toFixed(2)}</span>
        </div>
            <button class="details-btn" data-id="${p.id}" type="button">Details</button>
        </div>
    </article>
`).join("");

}

function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

// ----- Filtering (live search + category) -----
function applyFilters() {
    const q = query.trim().toLowerCase();
    const filtered = products.filter(p => {
    const matchesCat = activeCategory === "all" || p.category === activeCategory;
    const matchesText = !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
    return matchesCat && matchesText;
    });
    render(filtered);
    if (outputEl) {
        outputEl.textContent = `Filter: ${activeCategory} | Search: "${query}" | Results: ${filtered.length}`;
    }
}

// ----- Events: search + category -----
searchEl.addEventListener("input", (e) => {
    query = e.target.value;
    applyFilters();
});

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.dataset.category; // "all" | "electronics" | "books" | "clothing"
        applyFilters();
    });
});

// ----- Arrows: scroll viewport horizontally -----
function scrollByAmount(dir = 1) {
  viewportEl.scrollBy({ left: dir * viewportEl.clientWidth, behavior: "smooth" });
}
prevEl.addEventListener("click", () => scrollByAmount(-1));
nextEl.addEventListener("click", () => scrollByAmount(1));
[prevEl, nextEl].forEach(el => {
el.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el === prevEl ? scrollByAmount(-1) : scrollByAmount(1);
        }
    });
});

// ----- Theme toggle -----
function updateThemeBtn() {
    const dark = document.body.classList.contains("dark");
    themeBtn.textContent = dark ? "Light" : "Dark";
    themeBtn.setAttribute("aria-pressed", String(dark));
}
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    updateThemeBtn();
});
updateThemeBtn();

// ----- Newsletter validation (client-side) -----
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function setNewsMsg(text, type = "") {
    newsMsg.textContent = text || "";
    newsMsg.className = "msg" + (type ? " " + type : "");
}

newsEmail.addEventListener("input", () => {
    if (!newsEmail.value) return setNewsMsg("");
    if (EMAIL_RE.test(newsEmail.value)) setNewsMsg("Looks good ✓", "success");
    else setNewsMsg("Please enter a valid email like name@domain.com", "error");
});

newsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = newsEmail.value.trim();
    if (!value) {
        setNewsMsg("Email is required.", "error");
        newsEmail.focus();
        return;
    }
    if (!EMAIL_RE.test(value)) {
        setNewsMsg("Please enter a valid email like name@domain.com", "error");
        newsEmail.focus();
        return;
}
    setNewsMsg("Subscribed! Check your inbox to confirm.", "success");
    newsForm.reset();
    setTimeout(() => setNewsMsg(""), 6000);
});

render(products);
applyFilters();


// Modal elements
const modal      = document.getElementById("modal");
const modalImg   = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc  = document.getElementById("modal-desc");
const modalCat   = document.getElementById("modal-cat");
const modalPrice = document.getElementById("modal-price");


let lastFocused = null;

// Open on "Details" click (event delegation)
cardsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".details-btn");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const product = products.find(p => p.id === id);
    if (!product) return;
    lastFocused = btn;
    openModal(product);
});

function openModal(p){
  // Fill content
    modalImg.src = p.img;
    modalImg.alt = p.title;
    modalTitle.textContent = p.title;
    modalDesc.textContent = `${p.title} is a great ${p.category}.`;
    modalCat.textContent = capitalize(p.category);
    modalPrice.textContent = `$${p.price.toFixed(2)}`;

  // Show modal
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

  // Focus trap
    const focusables = getFocusables();
    (focusables[0] || modal).focus();

    document.addEventListener("keydown", onKeyDown);
    modal.addEventListener("click", onOverlayClick);
}

function closeModal(){
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeyDown);
    modal.removeEventListener("click", onOverlayClick);
    if (lastFocused) lastFocused.focus();
}

// ESC to close, keep focus inside
function onKeyDown(e){
    if (e.key === "Escape"){ e.preventDefault(); closeModal(); return; }
    if (e.key === "Tab"){
        const f = getFocusables(); if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
}

// Click backdrop or ✕
function onOverlayClick(e){
    if (e.target.matches("[data-close]")) closeModal();
}

function getFocusables(){
    return Array.from(
        modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.hasAttribute("disabled") && el.offsetParent !== null);
}
