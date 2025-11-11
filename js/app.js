const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
// 💕 Handle "Add to cart" clicks
document.querySelectorAll('.add').forEach(btn=>{
  btn.addEventListener('click', async ()=>{
    const { data:{ user }, error: authErr } = await sb.auth.getUser();
    if (authErr) { alert('Auth error: ' + authErr.message); return; }
    if (!user)    { alert('Please login to add items 🧁'); location.href='login.html'; return; }

    const item  = btn.dataset.item;
    const price = Number(btn.dataset.price || 0);

    // Check if item exists -> increment qty
    const { data: existing, error: selErr } = await sb
      .from('cart_items')
      .select('id, qty')
      .eq('user_id', user.id)
      .eq('item_name', item)
      .limit(1)
      .maybeSingle();

    if (selErr) { alert('Select error: ' + selErr.message); return; }

    let res;
    if (existing) {
      res = await sb.from('cart_items').update({ qty: existing.qty + 1 }).eq('id', existing.id);
    } else {
      res = await sb.from('cart_items').insert({ user_id: user.id, item_name: item, price, qty: 1 });
    }

    if (res.error) { alert('DB error: ' + res.error.message); console.error(res.error); }
    else { btn.textContent = 'Added ✓'; }
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
