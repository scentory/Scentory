'use strict';
(() => {
 const product = JSON.parse(document.getElementById('product-data').textContent);
 const feedback = document.getElementById('cart-feedback');
 const button = document.getElementById('add-cart');
 function readCart() { const value=JSON.parse(localStorage.getItem('scentoryCart') || '[]'); if(!Array.isArray(value)) throw Error('Invalid cart'); return value; }
 function count() { try { document.getElementById('page-cart-count').textContent = '('+readCart().reduce((n,x)=>n+(Number(x.qty)||0),0)+')'; } catch { document.getElementById('page-cart-count').textContent=''; } }
 const first=document.querySelector('input[name="size"]:not(:disabled)'); if(first) first.checked=true;
 button.disabled=!first;
 button.addEventListener('click', async () => {
  button.disabled=true;
  try {
   const ml=document.querySelector('input[name="size"]:checked')?.value;
   const qty=Number(document.getElementById('quantity').value);
   if(!ml || !Number.isInteger(qty) || qty<1 || qty>20) { feedback.textContent='Choose a size and a quantity between 1 and 20.'; return; }
   const response=await fetch('../perfumes.json?v=3063',{cache:'no-store'});
   if(!response.ok) throw Error('catalogue');
   const latest=(await response.json()).find(p=>p.id===product.id);
   const size=latest?.sizes?.[ml];
   if(!latest || latest.status!=='available' || !size?.available || !Number.isFinite(size.price)) {feedback.textContent='This size is currently unavailable. Please refresh to see the latest options.';return;}
   if(size.price!==product.sizes[ml].price) {feedback.textContent='The price has changed. Please refresh before adding this size.';return;}
   const cart=readCart(), key=product.id+'-'+ml;
   const item=cart.find(x=>x.key===key);
   if((item ? Number(item.qty)||0 : 0)+qty>20){feedback.textContent='You can add up to 20 of this size.';return;}
   if(item){item.qty=(Number(item.qty)||0)+qty;item.price=size.price;item.image=latest.image;}
   else cart.push({key,id:latest.id,ml,name:latest.name,image:latest.image,price:size.price,premium:size.premium,qty});
   localStorage.setItem('scentoryCart',JSON.stringify(cart));count();
   feedback.textContent=qty+' × '+ml.replace('ml',' ML')+' added to your cart.';
  } catch {feedback.textContent='We could not save your item. Check your connection and allow browser storage, then try again.';}
  finally {button.disabled=!first;}
 });
 document.getElementById('share-product').addEventListener('click',async()=>{
  try {if(navigator.share) await navigator.share({title:product.name,url:location.href});else {await navigator.clipboard.writeText(location.href);feedback.textContent='Product link copied.';}}
  catch(e){if(e.name!=='AbortError'){feedback.textContent='Copy this product link from your browser address bar.';}}
 });
 window.addEventListener('storage',count);window.addEventListener('pageshow',count);count();
})();
