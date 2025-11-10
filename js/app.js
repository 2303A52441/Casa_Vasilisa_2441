const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
document.querySelectorAll('.add').forEach(btn=>{
  btn.addEventListener('click', async ()=>{
    const { data:{ user } } = await sb.auth.getUser();
    if(!user){ alert('Please login to add items 🧁'); location.href='login.html'; return; }
    const item = btn.dataset.item, price = Number(btn.dataset.price||0);
    const { error } = await sb.from('cart_items').insert({ user_id:user.id, item_name:item, price, qty:1 });
    if(error) alert(error.message); else btn.textContent='Added ✓';
  });
});
const form=document.getElementById('reserve-form'); const msg=document.getElementById('reserve-msg');
if(form){ form.addEventListener('submit', async (e)=>{
  e.preventDefault(); msg.textContent='Saving reservation...';
  try{ const payload=Object.fromEntries(new FormData(form).entries());
    const res=await fetch('/api/reserve',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await res.json(); msg.textContent = data.ok ? 'Reservation confirmed! 🎉' : ('Error: '+(data.error||'unknown'));
    if(data.ok) form.reset();
  }catch{ msg.textContent='Hint: add POSTGRES_URL env in Vercel to enable reservations.'; }
});}
