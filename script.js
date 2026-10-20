
const products = [
  {id:1,name:"Clutch Pro Earbuds",category:"earbuds",price:7595,old:9995,badge:"NEW",image:"photo-1606220945770-b5b6c2c55bf1"},
  {id:2,name:"Moment Smart Watch",category:"smartwatch",price:14995,old:19995,badge:"TRENDING",image:"photo-1523275335684-37898b6baf30"},
  {id:3,name:"Rap Wireless Headphones",category:"headphones",price:4495,old:5995,badge:"POPULAR",image:"photo-1505740420928-5e560c06d30e"},
  {id:4,name:"Megawatt Power Bank",category:"powerbank",price:11495,old:12995,badge:"NEW",image:"photo-1609091839311-d5365f9ff1c5"},
  {id:5,name:"Lucid Wireless Buds",category:"earbuds",price:6795,old:7995,badge:"FAVOURITE",image:"photo-1590658268037-6bf12165a8df"},
  {id:6,name:"Active Fit Watch",category:"smartwatch",price:3995,old:5495,badge:"NEW",image:"photo-1508685096489-7aacd43bd3b1"},
  {id:7,name:"Magnitude Headphones",category:"headphones",price:4995,old:8995,badge:"SALE",image:"photo-1546435770-a3e426bf472b"},
  {id:8,name:"Pocket Power Bank",category:"powerbank",price:2999,old:3999,badge:"POPULAR",image:"photo-1585338107529-13afc5f02586"}
];

const $ = selector => document.querySelector(selector);
let category = "all";
let search = "";
let cart = {};

const money = n => "Rs. " + n.toLocaleString("en-PK");
const photo = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=650&q=85`;

function card(p) {
  return `
    <article class="product-card">
      <div class="product-photo">
        <img src="${photo(p.image)}" alt="${p.name}" loading="lazy">
        <span class="badge">${p.badge}</span>
      </div>
      <div class="product-info">
        <span class="category-name">${p.category}</span>
        <h3>${p.name}</h3>
        <p>Designed for everyday use.</p>
        <div class="price-row">
          <p class="price">${money(p.price)}</p>
          <span class="old-price">${money(p.old)}</span>
        </div>
        <button class="add-btn" data-add="${p.id}">ADD TO BAG +</button>
      </div>
    </article>`;
}

function getFilteredProducts() {
  return products.filter(p =>
    (category === "all" || p.category === category) &&
    (p.name + " " + p.category).toLowerCase().includes(search)
  );
}

function renderProducts() {
  const filtered = getFilteredProducts();

  $("#newProducts").innerHTML = products.slice(0,4).map(card).join("");
  $("#productGrid").innerHTML = filtered.map(card).join("");
  $("#emptyMessage").hidden = filtered.length > 0;
}

function renderCart() {
  const items = Object.entries(cart);
  const count = items.reduce((total, [, qty]) => total + qty, 0);
  const subtotal = items.reduce((total, [id, qty]) => {
    const p = products.find(item => item.id === Number(id));
    return total + p.price * qty;
  }, 0);

  $("#cartCount").textContent = count;
  $("#subtotal").textContent = money(subtotal);

  $("#cartItems").innerHTML = items.length
    ? items.map(([id, qty]) => {
        const p = products.find(item => item.id === Number(id));
        return `
          <div class="cart-item">
            <img src="${photo(p.image)}" alt="${p.name}">
            <div>
              <h4>${p.name}</h4>
              <p>${money(p.price * qty)}</p>
              <div class="quantity">
                <button data-change="${id}" data-delta="-1">−</button>
                <span>${qty}</span>
                <button data-change="${id}" data-delta="1">+</button>
                <button class="remove" data-remove="${id}">REMOVE</button>
              </div>
            </div>
          </div>`;
      }).join("")
    : `<div class="empty-cart">Your shopping bag is empty.</div>`;
}

function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => $("#toast").classList.remove("show"), 2200);
}

function setCategory(value) {
  category = value;
  document.querySelectorAll("#filters button").forEach(button => {
    button.classList.toggle("active", button.dataset.category === value);
  });
  renderProducts();
}

function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#overlay").classList.add("open");
}

function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#overlay").classList.remove("open");
}

document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  if (add) {
    const id = Number(add.dataset.add);
    cart[id] = (cart[id] || 0) + 1;
    renderCart();
    toast("Product added to bag!");
    return;
  }

  const filter = event.target.closest("#filters [data-category]");
  if (filter) setCategory(filter.dataset.category);

  const tile = event.target.closest(".category[data-category]");
  if (tile) {
    setCategory(tile.dataset.category);
    $("#trending").scrollIntoView({behavior:"smooth"});
  }

  const change = event.target.closest("[data-change]");
  if (change) {
    const id = Number(change.dataset.change);
    cart[id] = (cart[id] || 0) + Number(change.dataset.delta);
    if (cart[id] <= 0) delete cart[id];
    renderCart();
  }

  const remove = event.target.closest("[data-remove]");
  if (remove) {
    delete cart[Number(remove.dataset.remove)];
    renderCart();
  }
});

$("#searchToggle").addEventListener("click", () => {
  $("#searchBox").classList.toggle("open");
  $("#searchInput").focus();
});

function runSearch() {
  search = $("#searchInput").value.trim().toLowerCase();
  renderProducts();
  $("#trending").scrollIntoView({behavior:"smooth"});
}

$("#searchButton").addEventListener("click", runSearch);
$("#searchInput").addEventListener("input", () => {
  search = $("#searchInput").value.trim().toLowerCase();
  renderProducts();
});
$("#searchInput").addEventListener("keydown", event => {
  if (event.key === "Enter") runSearch();
});

$("#cartToggle").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
$("#overlay").addEventListener("click", closeCart);

$("#menuToggle").addEventListener("click", () => {
  $("#navLinks").classList.toggle("open");
});
$("#navLinks").querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => $("#navLinks").classList.remove("open"));
});

$("#checkoutButton").addEventListener("click", () => {
  toast(Object.keys(cart).length
    ? "Demo checkout only. Payment is not connected."
    : "Your shopping bag is empty.");
});

$("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  $("#newsletterMessage").textContent =
    "Thanks! This demo does not save email addresses.";
  event.target.reset();
});

$("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
