// Basic store logic using localStorage for cart demo
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function fmt(n){return n.toFixed(2)}

function getCart(){
try { return JSON.parse(localStorage.getItem('aurix_cart')||'[]'); }
catch(e){ return []; }
}
function setCart(items){
localStorage.setItem('aurix_cart', JSON.stringify(items));
renderCartCount();
}
function clearCart(){
localStorage.removeItem('aurix_cart');
renderCartCount();
}

function addToCart(id){
const p = PRODUCTS.find(x=>x.id===id);
if(!p) return;
const cart = getCart();
const existing = cart.find(x=>x.id===id);
if(existing){ existing.qty += 1; }
else { cart.push({id, qty:1}); }
setCart(cart);
}

function removeFromCart(id){
let cart = getCart().filter(x=>x.id!==id);
setCart(cart);
renderCart();
}

function updateQty(id, qty){
let cart = getCart();
const it = cart.find(x=>x.id===id);
if(!it) return;
it.qty = Math.max(1, qty|0);
setCart(cart);
renderCart();
}

function cartTotal(){
const cart = getCart();
let total = 0;
for(const c of cart){
const p = PRODUCTS.find(x=>x.id===c.id);
if(p) total += p.price * c.qty;
}
return total;
}

function renderCartCount(){
const el = $('#cart-count');
if(!el) return;
const count = getCart().reduce((a,b)=>a+b.qty,0);
el.textContent = count;
}

function productCard(p){
return <div class="product-card"> <a href="product.html?id=${encodeURIComponent(p.id)}"> <img src="${p.thumbnail}" alt="${p.title}" /> </a> <div class="pc-body"> <div class="pc-title">${p.title}</div> <div class="pc-meta"> <span>${p.fileType}</span> <span>⭐ ${p.rating}</span> </div> <div class="pc-actions"> <span class="price">$${fmt(p.price)}</span> <button class="add-btn" data-add="${p.id}">Add</button> </div> </div> </div> ;
}

function renderProducts(){
const grid = $('#product-grid');
if(!grid) return;

let list = [...PRODUCTS];

const catSel = $('#filter-category');
const sortSel = $('#sort-by');

function apply(){
let filtered = list;
const cat = catSel?.value || 'all';
if(cat !== 'all') filtered = filtered.filter(p=>p.category===cat);
const sort = sortSel?.value || 'popular';
if(sort==='price-asc') filtered.sort((a,b)=>a.price-b.price);
if(sort==='price-desc') filtered.sort((a,b)=>b.price-a.price);
if(sort==='new') filtered = filtered.reverse();grid.innerHTML = filtered.map(productCard).join('');
$$('#product-grid [data-add]').forEach(btn=>{
  btn.addEventListener('click',()=>addToCart(btn.dataset.add));
});
        
}

catSel?.addEventListener('change', apply);
sortSel?.addEventListener('change', apply);

// Category card quick filter

card.addEventListener('click', ()=>{ const f = card.getAttribute('data-filter'); if($('#filter-category')) { $('#filter-category').value = f; } setTimeout(()=>apply(), 50); }); }); apply(); } function renderProductDetail(){ const container = $('#product-detail'); if(!container) return; const params = new URLSearchParams(location.search); const id = params.get('id'); const p = PRODUCTS.find(x=>x.id===id) || PRODUCTS; container.innerHTML = ` <div class="product-gallery"> <img src="${p.images}" alt="${p.title}" /> </div> <div> <h1 class="pd-title">${p.title}</h1> <div class="pd-meta"> <span>${p.fileType}</span> <span>⭐ ${p.rating}</span> </div> <p class="pd-desc">${p.description}</p> <ul> ${p.includes.map(i=>`<li>${i}</li>`).join('')} </ul> <div class="pd-actions"> <span class="price">$${fmt(p.price)}</span> <button class="add-btn" onclick="addToCart('${p.id}')">Add to Cart</button> </div> </div> `; } function renderCart(){ const wrap = $('#cart-items'); if(!wrap) return; const cart = getCart(); if(cart.length===0){ wrap.innerHTML = `<p>Your cart is empty.</p>`; $('#cart-total').textContent = fmt(0); return; } wrap.innerHTML = cart.map(item=>{ const p = PRODUCTS.find(x=>x.id===item.id); if(!p) return ''; return ` <div class="cart-item"> <img src="${p.thumbnail}" alt="${p.title}"> <div style="flex:1"> <div class="cart-item-title">${p.title}</div> <div style="color:#98a2b3">${p.fileType} - ⭐ ${p.rating}</div> <div style="margin-top:8px"> <label>Qty: <input type="number" min="1" value="${item.qty}" data-qty="${p.id}" style="width:64px;padding:6px;background:var(--card);color:var(--text);border:1px solid var(--border);border-radius:8px"> </label> </div> </div> <div style="text-align:right"> <div class="price">$${fmt(p.price * item.qty)}</div> <button class="btn" data-remove="${p.id}" style="margin-top:8px">Remove</button> </div> </div> `; }).join(''); // Bind events $$('#cart-items [data-remove]').forEach(b=>{ b.addEventListener('click', ()=>removeFromCart(b.dataset.remove)); }); $$('#cart-items [data-qty]').forEach(inp=>{ inp.addEventListener('change', ()=>updateQty(inp.dataset.qty, parseInt(inp.value,10))); }); $('#cart-total').textContent = fmt(cartTotal()); } function renderCheckout(){ // Populate order summary const listWrap = $('#summary-items'); if(!listWrap) return; const cart = getCart(); if(cart.length===0){ listWrap.innerHTML = '<p>No items in cart.</p>'; $('#summary-total').textContent = fmt(0); return; } listWrap.innerHTML = cart.map(item=>{ const p = PRODUCTS.find(x=>x.id===item.id); if(!p) return ''; return ` <div class="summary-line"> <span>${p.title} × ${item.qty}</span> <span>$${fmt(p.price * item.qty)}</span> </div> `; }).join(''); $('#summary-total').textContent = fmt(cartTotal()); } // Init on each page document.addEventListener('DOMContentLoaded', ()=>{ renderCartCount(); const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear(); renderProducts(); }); File: assets/img placeholder
