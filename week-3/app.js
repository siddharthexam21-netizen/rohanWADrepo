// app.js — simple client-side store using localStorage
const PRODUCTS = [
  {id:1,name:'Comfort Tee',price:19.99,image:'https://unsplash.com/photos/a-light-green-t-shirt-with-cotton-branches-oLSnyhU2BVU'},
  {id:2,name:'Classic Hoodie',price:39.99,image:'https://source.unsplash.com/collection/888146/400x300?sig=2'},
  {id:3,name:'Slim Jeans',price:49.99,image:'https://source.unsplash.com/collection/888146/400x300?sig=3'},
  {id:4,name:'Running Shoes',price:69.99,image:'https://source.unsplash.com/collection/888146/400x300?sig=4'},
  {id:5,name:'Cap',price:12.99,image:'https://source.unsplash.com/collection/888146/400x300?sig=5'},
  {id:6,name:'Socks (3 pack)',price:9.99,image:'https://source.unsplash.com/collection/888146/400x300?sig=6'}
];

//get the items from the local storage
function getCart(){
    return JSON.parse(localStorage.getItem('cart')||'[]')
}
emoji : 'laptop'

//save the items to the local storage
function saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart)); 
    updateCartCount();
}

//get all the users from the local storage by inspecting in the application tab and then go to local storage
function getUsers(){
    return JSON.parse(localStorage.getItem('users')||'[]')
}
//save the users to the local storage
function saveUsers(u){
    localStorage.setItem('users', JSON.stringify(u))
}
//set session for the logged in user
function setSession(email){
    localStorage.setItem('session', email)
}
//get the session for the logged in user by inspecting in the appilication tab and then go to local storage
function getSession(){
    return localStorage.getItem('session')
}

/* Cart logic */
function addToCart(id){
    const cart=getCart();
    const item=cart.find(i=>i.id===id);
    if(item){item.qty+=1}
    else{cart.push({id,qty:1});}
    saveCart(cart);
}
function removeFromCart(id){
    let cart=getCart(); 
    cart=cart.filter(i=>i.id!==id); 
    saveCart(cart)
}
function updateQty(id,qty){
    const cart=getCart();
    const item=cart.find(i=>i.id===id); 
    if(item){
        item.qty=qty;
        if(item.qty<=0) 
            removeFromCart(id); 
        else saveCart(cart)
    } 
}
function clearCart(){
    localStorage.removeItem('cart');
    updateCartCount();
}

/* Render helpers */
function updateCartCount(){const cart=getCart(); const count=cart.reduce((s,i)=>s+i.qty,0); const el=document.getElementById('cart-count'); if(el) el.textContent=count}

function renderCatalog(){const container=document.getElementById('products'); if(!container) return; container.innerHTML=''; PRODUCTS.forEach(p=>{const card=document.createElement('div'); card.className='product-card'; card.innerHTML=`<img src="${p.image}" alt="${p.name}"><div class="product-body"><div class="product-title">${p.name}</div><div class="product-desc text-muted">Nice & simple product</div><div class="product-meta"><div class="price">$${p.price.toFixed(2)}</div><button class="btn btn-sm btn-primary btn-add">Add</button></div></div>`; const btn=card.querySelector('.btn-add'); btn.addEventListener('click', ()=>{addToCart(p.id); btn.textContent='Added'; setTimeout(()=>btn.textContent='Add',800)}); container.appendChild(card)}); updateCartCount();}

function renderCartPage(){const el=document.getElementById('cart-items'); if(!el) return; const cart=getCart(); if(cart.length===0){el.innerHTML='<div class="alert alert-info">Your cart is empty</div>'; document.getElementById('cart-total').textContent='0.00'; return}
  el.innerHTML=''; let total=0; cart.forEach(ci=>{const p=PRODUCTS.find(x=>x.id===ci.id); const line=document.createElement('div'); line.className='list-group-item d-flex align-items-center'; line.innerHTML=`<img src="${p.image}" style="width:80px;height:60px;object-fit:cover;border-radius:6px;margin-right:12px"><div class="flex-grow-1"><div class="fw-bold">${p.name}</div><div class="text-muted">$${p.price.toFixed(2)}</div></div><div class="d-flex align-items-center gap-2"><input type="number" min="0" value="${ci.qty}" data-id="${ci.id}" class="form-control form-control-sm qty-input" style="width:70px"><button class="btn btn-sm btn-danger remove-btn" data-id="${ci.id}">Remove</button></div>`; el.appendChild(line); total += p.price * ci.qty}); document.getElementById('cart-total').textContent=total.toFixed(2);
  // events
  document.querySelectorAll('.remove-btn').forEach(b=>b.addEventListener('click', e=>{removeFromCart(Number(e.target.dataset.id)); renderCartPage()}));
  document.querySelectorAll('.qty-input').forEach(i=>i.addEventListener('change', e=>{const id=Number(e.target.dataset.id); const val=Number(e.target.value)||0; if(val<=0) removeFromCart(id); else updateQty(id,val); renderCartPage()}));
}

document.getElementById('register-form').addEventListener('submit', e=>{
    e.preventDefault(); 
    const name=document.getElementById('name').value.trim();
    const email=document.getElementById('email').value.trim(); 
    const password=document.getElementById('password').value; 
    if(name && email && password) registerUser(name,email,password); 

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        alert('Invalid email format');
        return false;
    }



    const users = getUsers() || []; 
    if(users.find((user)=>{return user.email === email;})){
        alert('Email already registered');
        return false
    } 
    users.push({name,email,password}); 
    saveUsers(users); 
    setSession(email); 
    alert('Registered — logged in'); 
    window.location.href='cart.html';
    return true
});


document.getElementById('login-form').addEventListener('submit', e=>{
    e.preventDefault(); 
    const email=document.getElementById('email').value.trim(); 
    const password=document.getElementById('password').value; 
    if(email && password) loginUser(email,password);
     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        alert('Invalid email format');
        return false;
    }
    const users = getUsers() || []; 
    const user = users.find((user)=>{return user.email === email && user.password === password;});
    if(user){
        setSession(email); 
        alert('Login successful'); 
        window.location.href='cart.html';
        return true
    }
    else{
        alert('Invalid email or password');
        return false
    }
});




/* Attach behaviors for forms and pages */
document.addEventListener('DOMContentLoaded', ()=>{updateCartCount(); renderCatalog(); renderCartPage();
  // Registration form - handles user registration and saves data to local storage  
  const regForm=document.getElementById('register-form'); 
  if(regForm){ regForm.addEventListener('submit', 
    e=>{
        e.preventDefault(); 
        const name=document.getElementById('name').value.trim(); 
        const email=document.getElementById('email').value.trim(); 
        const password=document.getElementById('password').value; 
        if(name && email && password) registerUser(name,email,password); 
    })}
  // Login form - handles user login the data comes from the local storage by inspecting in the appilication tab and then go to local storage
  const loginForm=document.getElementById('login-form'); 
  if(loginForm){loginForm.addEventListener('submit', 
    e=>{
        e.preventDefault(); 
        const email=document.getElementById('email').value.trim(); 
        const password=document.getElementById('password').value; 
        if(email && password) loginUser(email,password); 
    })}
  // Clear cart button - this clears the cart after confirmation
  const clearBtn=document.getElementById('clear-cart'); 
  if(clearBtn) clearBtn.addEventListener('click', 
    ()=>{if(confirm('Clear cart?')){clearCart(); 
        renderCartPage()
    }})
  // Checkout button - this clears the cart and shows a thank you message
  const checkoutBtn=document.getElementById('checkout'); 
  if(checkoutBtn) checkoutBtn.addEventListener('click',
    ()=>{
    if(getCart().length===0)
    {
        alert('Cart empty');
        return;
    } 
    if(confirm('are you sure you want to checkout?')){
        clearCart(); 
        renderCartPage(); 
        alert('Thank you for your purchase!')
    }})
});



